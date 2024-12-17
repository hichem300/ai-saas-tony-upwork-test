import whatsapp from '../services/whatsappService.js';
import { generateResponse } from '../ai/model.js';
import { findOrCreateUser, updateSubscription, incrementMessageCount, getConversationContext, saveMessage, checkSubscription } from '../services/databaseService.js';
import {checkStripeSubscription} from '../services/paymentService.js';
import { isBlockedCountry, BLOCKED_MESSAGE } from '../utils/countryBlocker.js';
import { default as transcriptionService } from '../services/transcriptionService.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add other transports like File if needed
  ],
});

const SUBSCRIPTION_MESSAGE = "You're out of love sparks 🔥 Click here to upgrade and reignite unlimited passion ❤️ https://buy.stripe.com/test_00g3ep0YGg1GdfW8ww";

function extractCountryCode(wa_id) {
  return wa_id.substring(0, 2); // "33" for France
}

async function handleMessage(req) {
  const { entry } = req.body;

  for (const e of entry) {
    for (const change of e.changes) {
      if (change.field === 'messages') {
        if (change.value.messages) {
          for (const message of change.value.messages) {
            const from = message.from;
            const messageType = message.type;

            try {
              if (isBlockedCountry(from)) {
                await whatsapp.sendText(from, BLOCKED_MESSAGE);
                logger.info(`[INFO] Blocked message from ${from}`);
                continue;
              }

              let messageContent;
              if (messageType === 'text') {
                messageContent = message.text.body;
              } else if (messageType === 'audio') {
                const mediaId = message.audio.id;
                messageContent = await transcriptionService.transcribeAudio(mediaId);
              } else {
                logger.info(`[INFO] Unsupported message type: ${messageType}`);
                continue;
              }

              const isSubscribed = await checkStripeSubscription(from);
              const user = await findOrCreateUser(from);

              logger.info(`[INFO] Checking subscription status for user ${from}`);
              const subscriptionStatus = await checkSubscription(from);
              logger.info(`[INFO] Subscription status for user ${from}: ${subscriptionStatus}`);

              if (isSubscribed !== user.is_subscribed) {
                logger.info(`[INFO] Updating subscription status for user ${from}`);
                await updateSubscription(from, isSubscribed);
                logger.info(`[INFO] Subscription status updated for user ${from}`);
              }

              const messageCount = await incrementMessageCount(from);
              const contextMessages = await getConversationContext(from);

              const countryCode = extractCountryCode(from);
              logger.info(`[INFO] Extracted country code: ${countryCode}`);

              if (messageCount <= 5 || isSubscribed) {
                const context = contextMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
                const prompt = `Previous conversation:\n${context}\n\nUser: ${messageContent}\nAssistant:`;

                logger.info(`[INFO] Generated prompt: ${prompt}`);

                const aiResponse = await generateResponse(prompt);
                await whatsapp.sendText(from, aiResponse);
                await saveMessage(from, messageContent, aiResponse);
              } else {
                await whatsapp.sendText(from, SUBSCRIPTION_MESSAGE);
              }

              logger.info(`[INFO] Handled message from ${from}`);
            } catch (error) {
              console.error(`[ERROR] Error handling message: ${error.message}`);
            }
          }
        } else if (change.value.statuses) {
          // Handle status updates
          for (const status of change.value.statuses) {
            logger.info(`[INFO] Message status update: ${status.status} for ${status.recipient_id}`);
          }
        }
      }
    }
  }
}

export { handleMessage };
