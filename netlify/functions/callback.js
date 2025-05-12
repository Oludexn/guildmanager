
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const code = new URLSearchParams(event.rawQuery).get("code");
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const res = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const data = await res.json();

  return {
    statusCode: 302,
    headers: {
      'Set-Cookie': `discord_token=${data.access_token}; Path=/; HttpOnly`,
      'Location': "/",
    }
  };
};
