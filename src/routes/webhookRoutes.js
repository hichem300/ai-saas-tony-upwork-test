import { Router, json } from 'express';
import { handleMessage } from '../controllers/messageController.js';

const router = Router();

console.log('Webhook routes loaded');

// WhatsApp webhook verification route
router.get('/whatsapp', (req, res) => {
  console.log('WhatsApp GET route hit');
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('WhatsApp webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    console.log('Invalid WhatsApp webhook request');
    res.sendStatus(400);
  }
});

// New POST route for handling incoming WhatsApp messages
router.post('/whatsapp', json(), async (req, res) => {
  // Send 200 OK immediately
  res.sendStatus(200);
  
  console.log('Received WhatsApp POST request');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    await handleMessage(req);
  } catch (error) {
    console.error('Error handling WhatsApp message:', error);
  }
});

export default router;