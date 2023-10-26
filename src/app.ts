import { App , HTTPReceiver, LogLevel } from "@slack/bolt";
import appConfig from "./config";
import { botCommands } from "./commands";import { handleBotError } from "./utils/error";
import { afterInstallation, beforeRedirection, fetchInstallation } from "./middleware/auth-middleware";
import appManifest from "../manifest.json"
import { botViews } from "./view";
import { homeOpened } from "./view/home-opened.view";


const app = new App({
    signingSecret: appConfig.slack?.signingSecret as string,
    clientId: appConfig.slack?.clientId,
    clientSecret: appConfig.slack?.clientSecret,
    stateSecret: 'my-app-secret',
    logLevel: LogLevel.DEBUG,
    scopes: appManifest.oauth_config.scopes.bot,
    installerOptions: {
        userScopes: appManifest.oauth_config.scopes.user,
        directInstall: true,
        installPath: '/slack/install/workspace',
        installPathOptions: {
            beforeRedirection,
        },
        callbackOptions: {
           afterInstallation,
        }
    },
    installationStore: {
        storeInstallation : async () => {},
        fetchInstallation
    }
})



homeOpened(app)
botViews(app)
botCommands(app);

app.error(handleBotError);
export { app }