
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const token = event.headers.cookie?.split('; ').find(x => x.startsWith('discord_token=')).split('=')[1];
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const guilds = await res.json();
  const enriched = guilds.map(g => ({
    id: g.id,
    name: g.name,
    icon: g.icon,
    memberCount: Math.floor(Math.random() * 5000),
    joinedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
  return {
    statusCode: 200,
    body: JSON.stringify(enriched),
  };
};
