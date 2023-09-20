import { App } from './app';

export async function setup(context: Modding.ModContext) {
    const app = new App(context);
    await app.init();
}
