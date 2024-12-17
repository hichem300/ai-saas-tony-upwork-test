import { checkStripeSubscription } from './src/services/paymentService.js';

async function testCheckSubscription() {
    const phoneNumber = ''; // Replace with a valid phone number for testing
    const isSubscribed = await checkStripeSubscription(phoneNumber);
    console.log(`Subscription status for ${phoneNumber}: ${isSubscribed}`);
}

testCheckSubscription();
