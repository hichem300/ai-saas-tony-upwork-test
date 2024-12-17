import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import stripe from '../config/stripe.js';

async function checkStripeSubscription(phoneNumber) {
  try {
    const formattedPhoneNumber = '+' + phoneNumber;
    const customers = await stripe.customers.search({
      query: `phone:'${formattedPhoneNumber}'`,
    });

    if (customers.data.length === 0) {
      return false;
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active', // You can adjust the status as needed
      limit: 1 // Adjust the limit as necessary
    });

    // Log the subscriptions list
    console.log('Subscriptions for customer:', subscriptions.data);

    return subscriptions.data.length > 0;
  } catch (error) {
    console.error(`Error checking Stripe subscription: ${error.message}`);
    return false;
  }
}

export {checkStripeSubscription};
