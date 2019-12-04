module.exports = {
  description: "Dump a server's data to DMs.",
  usage: {
    "[server id]": "Normally it will dump the current server's data. If you supply this, it will dump that server's data instead. This is bot owner only."
  },
  examples: {},
  aliases: [],
  permissionRequired: 3, // 0 All, 1 Mods, 2 Admins, 3 Server Owner, 4 Bot Admin, 5 Bot Owner
  checkArgs: (args, permissionLevel) => {
    if (permissionLevel < 4 && args.length) return false;
    else return true;
  }
}

module.exports.run = async function(client, message, args, config, gdb, { permissionLevel }) {
  let id = args[0]
  if (!id) id = message.guild.id;
  if (id !== message.guild.id && permissionLevel < 4) return message.channel.send("❌ You don't have permission! ")

  let guilddb = await db.guild(id)

  await message.author.send("Database information for guild " + id, {
    files: [
      {
        attachment: Buffer.from(JSON.stringify(await guilddb.get())),
        name: id + ".json"
      }
    ]
  }).then(m => message.channel.send("✅ Sent to DMs. [" + m.url + "]")).catch(() => message.channel.send("❌ I couldn't send you the file in DMs. Have you enabled DMs in this server?"))
}