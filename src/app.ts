import './app.scss';

declare global {
    interface CloudManager {
        hasTotHEntitlement: boolean;
        hasAoDEntitlement: boolean;
    }

    const cloudManager: CloudManager;

    interface BaseItemModificationData {
        expandedDescription?: string;
    }

    interface Item {
        _expandedDescription?: string;
    }
}

export class App {
    constructor(private readonly context: Modding.ModContext) {}

    public async init() {
        this.patchDataModification();
        await this.addTranslations();

        await this.loadDescriptions();
    }

    private async loadDescriptions() {
        await this.context.gameData.addPackage('data/data.json');

        if (cloudManager.hasTotHEntitlement) {
            await this.context.gameData.addPackage('data/data-toth.json');
        }

        if (cloudManager.hasAoDEntitlement) {
            await this.context.gameData.addPackage('data/data-aod.json');
        }
    }

    private async addTranslations() {
        let lang = setLang;

        if (lang === 'lemon' || lang === 'carrot') {
            lang = 'en';
        }

        const languages = {
            en: 'english',
            'zh-CN': 'chinese-simplified',
            'zh-TW': 'chinese-traditional',
            fr: 'french',
            de: 'german',
            it: 'italian',
            ko: 'korean',
            ja: 'japanese',
            pt: 'portuquese',
            'pt-br': 'portuguese-brasil',
            es: 'spanish',
            ru: 'russian',
            tr: 'turkish'
        };

        const { language } = await this.context.loadModule(`${languages[lang]}.mjs`);

        for (const [key, value] of Object.entries<string>(language)) {
            loadedLangJson[`IDE_${key}`] = value;
        }
    }

    private patchDataModification() {
        const that = this;

        this.context.patch(Item, 'applyDataModification').after(function (_patch, modData) {
            if (modData.expandedDescription !== undefined) {
                this._expandedDescription = modData.expandedDescription;
            }
        });

        this.context.patch(Item, 'hasDescription').get(function (patch) {
            if (patch()) {
                return true;
            }

            if (this instanceof EquipmentItem && this.modifiers !== undefined) {
                return false;
            }

            return this._expandedDescription !== undefined;
        });

        this.context.patch(Item, 'description').get(function (patch) {
            if (this instanceof PotionItem || this instanceof EquipmentItem || this instanceof TokenItem) {
                return patch();
            }

            return that.getItemDescription(this, patch);
        });

        this.context.patch(EquipmentItem, 'description').get(function (patch) {
            return that.getItemDescription(this, patch);
        });

        this.context.patch(PotionItem, 'description').get(function (patch) {
            return that.getItemDescription(this, patch);
        });

        this.context.patch(TokenItem, 'description').get(function (patch) {
            return that.getItemDescription(this, patch);
        });
    }

    private getItemDescription(item: Item, patch: () => string) {
        let description = patch();

        if (item._expandedDescription) {
            description = description.replace(loadedLangJson['BANK_STRING_38'], '');

            if (description) {
                description += `<br /><br />`;
            }

            description += `<span class="ide fc">${getLangString(`IDE_${item.localID}`)}</span>`;
        }

        return description;
    }
}
