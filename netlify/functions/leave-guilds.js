
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const token = event.headers.cookie?.split('; ').find(x => x.startsWith('discord_token=')).split('=')[1];
  const { guildIds } = JSON.parse(event.body);
  let success = 0;
  for (const id of guildIds) {
    const res = await fetch(`https://discord.com/api/users/@me/guilds/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) success++;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Left ${success} guild(s).` }),
  };
};
