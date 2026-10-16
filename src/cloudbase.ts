import cloudbase from "@cloudbase/js-sdk";

export const CLOUDBASE_ENV_ID = "ustc-play-dev-d4gwfhjz88eefeafa";

export const cloudbaseApp = cloudbase.init({ env: CLOUDBASE_ENV_ID });
export const auth = cloudbaseApp.auth();
export const db = cloudbaseApp.database();
