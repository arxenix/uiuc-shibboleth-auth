# Shibboleth Link

> [!NOTE]  
> SIGPwny Shibboleth Auth is now named Shibboleth Link.

Shibboleth Link is a simple service that links Shibboleth accounts to Discord accounts. This allows for gated access to Discord roles based on Shibboleth group membership.

## New in v3.0
- **Discord bot improvements**
  - Supports Discord slash commands.
  - Discord User Commands: see Shibboleth information by right-clicking a user.
- **Privacy improvements**
  - Discord to Shibboleth links are no longer directly logged to Discord channels.

## Security
- JWT cookies are used for session management.
  - JWT was picked over session cookies because it is more privacy-friendly - the server does not store user information until the user links their account.
- CSRF tokens are used to prevent CSRF attacks.

## Privacy
Shibboleth Link is designed to protect both Discord servers and users. By default, user information is not stored by Shibboleth Link or shared with Discord server owners. Depending on how Shibboleth Link is configured, Discord servers that use Shibboleth Link can opt into receiving user linking information. Prior to linking, users are always informed how exactly their information will be stored and shared.

Linking a Shibboleth user and a Discord user is tied only to the Discord server that the user is linking for. Other Discord servers do not have access to link information unless the user links on that Discord server.

- **Confirm Only**: When linking, Shibboleth Link will collect user data to confirm that the user is part of a Shibboleth group and grant roles on the Discord server. User data is immediately discarded and not stored or shared with the Discord server owners.
- **Link and Store**: In this case, user link data is collected and stored in a database maintained by Shibboleth Link, specific to each Discord server. Discord server owners can lookup a Discord user's Shibboleth information or see Discord accounts associated with a Shibboleth identity.

To provide protection from potentially malicious Discord server owners, lookups are logged and can be audited by the provider of the Shibboleth Link instance. The provider can also require verification before a Discord server can enable **Link and Store**.

- Discord server owners can verify their Discord server by linking their Shibboleth account to their Discord account. Additionally, the server owner must provide a valid contact email and configure a private Discord channel for Shibboleth Link to send updates to.
- Verification of the Discord server must be done by a user with Administrator permissions.
- Verification of a Discord server expires in one year (configurable). Reminders will be sent via the contact email and the private Discord channel before expiration (configurable).
- If a Discord server fails to re-verify before verification expires, then lookup privileges are immediately disabled. The ability for users to link accounts is also temporarily disabled, but can be re-enabled by switching to **Confirm Only**. A grace period of 90 days (configurable) is given before user linking data for the Discord server is wiped. The Discord server must reverify within the grace period to retain the link information as well as re-enable **Link and Store**.
- At any point, the Discord server can request deletion of its users' link information.

Users can also opt to unlink their accounts, in which case their link information will be deleted (and their roles removed). However, Shibboleth Link and/or Discord servers may enforce a minimum period before the user's data is deleted.

## Installation

### Register as a Shibboleth Service Provider

### Set Up Discord App

### Configure TLS

TLS certificates are required for HTTPS. You can use Certbot to generate free certificates.

```
docker run -it --rm --name certbot -p 80:80 -v "./data/certbot/letsencrypt:/etc/letsencrypt" certbot/certbot certonly
```

After you generate your initial certificates, the `docker-compose.yml` file is configured to automatically renew them.

### Putting It All Together

Configure the `.env` file with your Discord bot token and the path to your SSL certificates.

```
docker-compose up --build
```
