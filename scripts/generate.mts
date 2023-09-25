import demo from '../data/game-data/melvorD.json' assert { type: 'json' };
import full from '../data/game-data/melvorF.json' assert { type: 'json' };
import toth from '../data/game-data/melvorTotH.json' assert { type: 'json' };
import aod from '../data/game-data/melvorAoD.json' assert { type: 'json' };
import { volumes } from '../data/volumes/index.mjs';
import { writeFile } from 'fs/promises';

interface Item {
    id: string;
    full: string;
    namespace: string;
    description: string;
}

interface DataItem {
    id: string;
    expandedDescription: string;
}

interface Descriptions {
    $schema: string;
    namespace: string;
    modifications?: { items?: DataItem[] };
}

const attachNamespace = (item: any, namespace: string) => {
    item.namespace = namespace;
    return item;
};

const items: any[] = [
    ...demo.data.items.map(item => attachNamespace(item, 'melvorD:')),
    ...full.data.items.map(item => attachNamespace(item, 'melvorF:')),
    ...toth.data.items.map(item => attachNamespace(item, 'melvorTotH:')),
    ...aod.data.items.map(item => attachNamespace(item, 'melvorAoD:'))
];

const descriptions = volumes
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(row => {
        const [name, ...description] = row.split(' - ');
        const item = items.find(item => item.id === name.replace(/ /g, '_') || item.name === name);

        if (item === undefined) {
            console.error(`\x1b[31mUnable to locate item with name '${name}'\nTried: '${name.replace(/ /g, '_')}' and '${name}'\n\n\x1b[34m`, row, '\x1b[0m');
            return;
        }

        return {
            id: item.id,
            namespace: item.namespace,
            full: `${item.namespace}${item.id}`,
            description: description.join(' - ')
        };
    })
    .filter(item => item !== undefined) as Item[];

const groupedDescriptions = descriptions.reduce(
    (result, current) => {
        switch (current.namespace) {
            case 'melvorD:':
            case 'melvorF:':
                result.base.push({ id: current.full, expandedDescription: current.description });
                break;
            case 'melvorTotH:':
                result.toth.push({ id: current.full, expandedDescription: current.description });
                break;
            case 'melvorAoD:':
                result.aod.push({ id: current.full, expandedDescription: current.description });
                break;
        }

        return result;
    },
    { base: [], toth: [], aod: [] } as { base: DataItem[]; toth: DataItem[]; aod: DataItem[] }
);

const baseDescriptions: Descriptions = {
    $schema: 'https://melvoridle.com/assets/schema/gameData.json',
    namespace: 'itemDescriptionsExpanded'
};

if (groupedDescriptions.base.length) {
    baseDescriptions.modifications = { items: groupedDescriptions.base };
}

const tothDescriptions: Descriptions = {
    $schema: 'https://melvoridle.com/assets/schema/gameData.json',
    namespace: 'itemDescriptionsExpanded'
};

if (groupedDescriptions.toth.length) {
    tothDescriptions.modifications = { items: groupedDescriptions.toth };
}

const aodDescriptions: Descriptions = {
    $schema: 'https://melvoridle.com/assets/schema/gameData.json',
    namespace: 'itemDescriptionsExpanded'
};

if (groupedDescriptions.aod.length) {
    tothDescriptions.modifications = { items: groupedDescriptions.aod };
}

const run = async () => {
    await writeFile('src/data/data.json', JSON.stringify(baseDescriptions));
    await writeFile('src/data/data-toth.json', JSON.stringify(tothDescriptions));
    await writeFile('src/data/data-aod.json', JSON.stringify(aodDescriptions));

    await writeFile(
        'src/languages/english.ts',
        `export const language = {
        ${descriptions.map(description => `${description.id}: "${description.description.replace(/"/g, '\\"')}"`).join(',\n')}
}`
    );
};

run();
