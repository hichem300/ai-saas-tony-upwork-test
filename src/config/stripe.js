import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const stripeSecretKey = dotenv.config().parsed.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.error('Stripe secret key is not set. Please check your environment variables.');
} else {
    console.log('Stripe secret key is set. Proceeding with Stripe initialization.');
}

const stripe = new Stripe(stripeSecretKey);

export default stripe;
