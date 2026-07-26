exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const payload = JSON.parse(event.body);

        // We only want to alert you when a checkout is completed
        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const amount = (session.amount_total / 100).toFixed(2);
            const customerEmail = session.customer_details?.email || 'No email provided';

            // Send notification to your private Discord webhook
            await fetch(process.env.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: "💰 **NEW STRIPE PAYMENT RECEIVED!**",
                    embeds: [{
                        title: "✅ Payment Successful",
                        color: 65280, // Green
                        fields: [
                            { name: "Amount Paid", value: `$${amount}`, inline: true },
                            { name: "Customer Email", value: customerEmail, inline: true }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });
        }

        return { statusCode: 200, body: 'Webhook processed successfully' };
    } catch (error) {
        console.error(error);
        return { statusCode: 400, body: `Webhook Error: ${error.message}` };
    }
}
