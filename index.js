const { Client } = require("discord.js-selfbot-v13");
const fs = require('fs');
const path = require('path');

const client = new Client();
const config = require('./config.json'); // { "prefix": "?#", "banToggle": false }
const servers = require('./servers.json'); // [ "blacklisted_server_id", ... ]

const targetServerId = 'YOUR_TARGET_SERVER_ID'; // <- set your own target server here

// Save functions
const saveConfig = () => fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
const saveServers = () => fs.writeFileSync('./servers.json', JSON.stringify(servers, null, 4));

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.id !== client.user.id || !message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  if (command === "check" || command === "checkid") {
    let user;
    if (command === "checkid" && args[0]) {
      try {
        user = await client.users.fetch(args[0]);
      } catch {
        return message.channel.send("❌ Invalid user ID.");
      }
    } else {
      user = message.mentions.users.first();
    }

    if (!user) return message.channel.send("❌ Please mention a user or provide a valid ID.");

    let foundIn = 0;
    for (const guildId of servers) {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) continue;
      try {
        await guild.members.fetch(user.id);
        foundIn++;
      } catch {}
    }

    await message.channel.send(`> 🔍 Checked: <@${user.id}> (${user.tag})\n> ⚠️ Found in **${foundIn}** blacklisted server(s).`);

    if (config.banToggle && foundIn > 0) {
      const targetGuild = client.guilds.cache.get(targetServerId);
      if (!targetGuild) return message.channel.send("❌ Target server not found.");
      try {
        const member = await targetGuild.members.fetch(user.id);
        await member.ban({ reason: "Blacklisted" });
        await message.channel.send(`✅ <@${user.id}> has been banned from **${targetGuild.name}**.`);
      } catch {
        await message.channel.send(`❌ Failed to ban <@${user.id}>.`);
      }
    }
  }

  if (command === "blacklist") {
    const action = args[0];
    const serverId = args[1];

    if (action === "add") {
      if (!serverId) return message.channel.send("❌ Provide a server ID.");
      if (!servers.includes(serverId)) {
        servers.push(serverId);
        saveServers();
        return message.channel.send(`✅ Server ${serverId} added to blacklist.`);
      }
      return message.channel.send("❌ Server is already blacklisted.");
    }

    if (action === "remove") {
      const index = servers.indexOf(serverId);
      if (index > -1) {
        servers.splice(index, 1);
        saveServers();
        return message.channel.send(`✅ Server ${serverId} removed.`);
      }
      return message.channel.send("❌ Server not in blacklist.");
    }

    if (action === "list") {
      if (servers.length === 0) return message.channel.send("❌ No servers in the blacklist.");
      const list = servers.map(id => `- ${id}`).join('\n');
      return message.channel.send(`📋 Blacklisted Servers:\n${list}`);
    }
  }

  if (command === "bantoggle") {
    if (args[0] === "on") {
      config.banToggle = true;
      saveConfig();
      return message.channel.send("✅ Auto-ban enabled.");
    }
    if (args[0] === "off") {
      config.banToggle = false;
      saveConfig();
      return message.channel.send("✅ Auto-ban disabled.");
    }
    return message.channel.send("❌ Use `on` or `off`.");
  }

  if (command === "checkall") {
    const guild = message.guild;
    if (!guild) return message.channel.send("❌ Command must be run in a server.");

    const members = await guild.members.fetch();
    for (const member of members.values()) {
      if (member.user.bot) continue;

      let count = 0;
      for (const guildId of servers) {
        const g = client.guilds.cache.get(guildId);
        if (!g) continue;
        try {
          await g.members.fetch(member.user.id);
          count++;
        } catch {}
      }

      await message.channel.send(`> 🔍 Checked: <@${member.user.id}> (${member.user.tag})\n> ⚠️ Found in **${count}** blacklisted server(s).`);

      if (config.banToggle && count > 0) {
        const targetGuild = client.guilds.cache.get(targetServerId);
        if (!targetGuild) continue;
        try {
          const toBan = await targetGuild.members.fetch(member.user.id);
          await toBan.ban({ reason: "Auto-ban - Blacklisted" });
          await message.channel.send(`✅ Banned <@${member.user.id}> from **${targetGuild.name}**.`);
        } catch {
          await message.channel.send(`❌ Failed to ban <@${member.user.id}>.`);
        }
      }
    }
  }

  if (command === "checkstatus") {
    return message.channel.send(`✅ Auto-ban is currently **${config.banToggle ? "enabled" : "disabled"}**.`);
  }

  if (command === "prefix") {
    const newPrefix = args[0];
    if (!newPrefix) return message.channel.send("❌ Provide a new prefix.");
    config.prefix = newPrefix;
    saveConfig();
    return message.channel.send(`✅ Prefix changed to \`${newPrefix}\`.`);
  }

  if (command === "help") {
    return message.channel.send(`
🛠️ **Available Commands**
- \`${config.prefix}check @user\` — Check user via mention
- \`${config.prefix}checkid <id>\` — Check user by ID
- \`${config.prefix}checkall\` — Check all members in this server
- \`${config.prefix}blacklist add/remove/list <id>\` — Manage blacklist
- \`${config.prefix}bantoggle on/off\` — Toggle auto-ban
- \`${config.prefix}checkstatus\` — View auto-ban status
- \`${config.prefix}prefix <new>\` — Change command prefix
- \`${config.prefix}help\` — Show this help menu
    `);
  }
});

client.login("YOUR_DISCORD_USER_TOKEN_HERE"); // 🚨 Replace with your user token (for private use only)
