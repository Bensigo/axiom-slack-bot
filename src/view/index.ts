import { App } from "@slack/bolt";
import { queryDatasetView } from "./query-dataset.view";
import { connectAccount } from "./connect-account.view";


export function botViews(app: App) {
    // queryDatasetView(app);
    connectAccount(app);
}