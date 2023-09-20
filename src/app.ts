import { languages } from './languages';
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
        this.addTranslations();

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

    private addTranslations() {
        let lang = setLang;

        if (lang === 'lemon' || lang === 'carrot') {
            lang = 'en';
        }

        for (const [key, value] of Object.entries<string>(languages[lang])) {
            loadedLangJson[`IDE_${key}`] = value;
        }
    }

    private patchDataModification() {
        this.context.patch(Item, 'applyDataModification').after(function (_patch, modData) {
            if (modData.expandedDescription !== undefined) {
                this._expandedDescription = modData.expandedDescription;
            }
        });

        this.context.patch(Item, 'hasDescription').get(function (patch) {
            const hasDescription = patch();

            return hasDescription || this._expandedDescription !== undefined;
        });

        this.context.patch(Item, 'description').get(function (patch) {
            let description = patch();

            if (this._expandedDescription) {
                // no item description
                if (description === loadedLangJson['BANK_STRING_38']) {
                    description = '';
                }

                if (description) {
                    description += `<br /><br />`;
                }

                description += `<span class="ide fc">${getLangString(`IDE_${this.localID}`)}</span>`;
            }

            return description;
        });
    }
}
