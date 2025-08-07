````markdown
# 🛡️ Discord Blacklist Checker

A Discord selfbot built with `discord.js-selfbot-v13` that checks if a user appears in one or more **blacklisted servers**, and can automatically ban them from a target server if configured.

> ⚠️ **Note:** This is for educational, private, or moderation use **only**. Using selfbots on Discord violates [Discord's Terms of Service](https://discord.com/terms) and can result in account bans.

---

## 🚀 Features

- Check if a user is a member of any blacklisted servers
- Check all users in a server (`checkall`)
- Automatically ban blacklisted users (optional)
- Add/remove servers to blacklist
- Manual ban command
- JSON-based config and blacklist file
- Fast, simple, command-line interface

---

## ⚙️ Setup

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/discord-blacklist-checker.git
cd discord-blacklist-checker
npm install discord.js-selfbot-v13
````

### 2. Create Config Files

#### `config.json`

```json
{
  "prefix": "?#",
  "banToggle": false
}
```

#### `servers.json`

```json
[]
```

* Add server IDs to this array to define your blacklist
* Example: `["123456789012345678", "987654321098765432"]`

---

## 🔧 Usage

Run the bot with:

```bash
node blacklist-checker.js
```

### 📜 Commands

| Command                          | Description                            |
| -------------------------------- | -------------------------------------- |
| `?#check @user`                  | Check a specific user                  |
| `?#checkid <user_id>`            | Check a user by ID                     |
| `?#checkall`                     | Check all members in current server    |
| `?#blacklist add <server_id>`    | Add server to blacklist                |
| `?#blacklist remove <server_id>` | Remove server from blacklist           |
| `?#blacklist list`               | Show current blacklist                 |
| `?#bantoggle on/off`             | Enable/disable auto-ban                |
| `?#ban @user`                    | Manually ban a user from target server |
| `?#banlist`                      | Show list of banned users (optional)   |
| `?#checkstatus`                  | Show current ban toggle status         |
| `?#prefix {newprefix}`           | Change command prefix                  |
| `?#help`                         | Display command help                   |

---

## ⚠️ Disclaimer

This tool uses a **selfbot account**, which is against Discord’s Terms of Service.
Use responsibly, privately, and at your own risk.
