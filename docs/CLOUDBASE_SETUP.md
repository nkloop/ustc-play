# CloudBase setup for USTC Play

The GitHub Pages build is static. CloudBase supplies email-code authentication and the shared database.

## 1. Create and configure the CloudBase environment

1. Create a CloudBase environment in the Tencent CloudBase console and copy its environment ID.
2. Enable email verification-code authentication. Configure the sender and email template in the authentication settings.
3. Add the public site origin to the environment's web security domain allowlist: `https://nkloop.github.io`.
4. Create two document database collections: `play_status` and `court_reports`.
5. Apply the rules below to each collection. They allow public reads while permitting signed-in users to write only documents whose `uid` is their CloudBase UID.

`play_status`:

```json
{
  "read": true,
  "create": "doc._id == auth.uid && request.data.uid == auth.uid",
  "update": "doc._id == auth.uid && doc.uid == auth.uid && request.data.uid == auth.uid",
  "delete": "doc._id == auth.uid && doc.uid == auth.uid"
}
```

`court_reports`:

```json
{
  "read": true,
  "create": "doc._id == auth.uid && request.data.uid == auth.uid",
  "update": "doc._id == auth.uid && doc.uid == auth.uid && request.data.uid == auth.uid",
  "delete": "doc._id == auth.uid && doc.uid == auth.uid"
}
```

The website uses one status document per UID (`play_status/<uid>`) and one report document per UID (`court_reports/<uid>`). Each report document contains one current report per court, so a UID contributes at most one heat report per court. Heat summaries read reports from the last two hours; status summaries count only unexpired records.

## 2. Configure the website build

For local testing, copy `.env.example` to `.env.local` and set `VITE_CLOUDBASE_ENV_ID` to the environment ID. This value is a public client identifier, not a secret.

For GitHub Pages, add a repository **Actions variable** named `VITE_CLOUDBASE_ENV_ID` with that environment ID before merging the feature branch to `main`. The Pages workflow reads the variable during the Vite build. The web security domain allowlist must contain the published origin before authentication is tested.

## 3. Verify

1. Open the Pages website, request a code, and complete email-code login.
2. Publish a status; confirm `play_status/<your UID>` appears and the status is visible in another browser.
3. Publish a heat report; confirm a matching `court_reports` document appears and the court summary updates.
4. Try writing a document with another UID. The database must reject the operation.

Email verification proves control of an email inbox. It discourages anonymous counter inflation but cannot prove one human has only one email address. Rate limits, monitoring, and a moderation/reporting path may be needed if abuse appears.
