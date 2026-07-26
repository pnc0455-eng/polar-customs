exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
    
    try {
        const { userId } = JSON.parse(event.body);
        
        // These will pull securely from your Netlify Environment Variables
        const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
        const GUILD_ID = process.env.DISCORD_GUILD_ID;

        // Ask Discord's official API if this User ID is in your server
        const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`, {
            headers: {
                'Authorization': `Bot ${BOT_TOKEN}`
            }
        });
        
        if (response.ok) {
            // User is in the server!
            return { statusCode: 200, body: JSON.stringify({ isMember: true }) };
        } else {
            // User is NOT in the server
            return { statusCode: 404, body: JSON.stringify({ isMember: false }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
    }
}