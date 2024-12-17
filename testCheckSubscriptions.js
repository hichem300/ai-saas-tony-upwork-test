import stripe from './src/config/stripe.js';

async function testCheckSubscriptions() {
    try {
        const subscriptions = await stripe.subscriptions.list({
            limit: 100 // Adjust the limit as necessary
        });
        console.log('All Subscriptions:', subscriptions.data);
    } catch (error) {
        console.error('Error retrieving subscriptions:', error.message);
    }
}

testCheckSubscriptions();
