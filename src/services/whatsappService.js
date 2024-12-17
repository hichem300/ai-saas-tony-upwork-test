import axios from 'axios';
import pkg from 'whatsapp-cloud-api';
const { WhatsAppClient } = pkg;
import fs from 'fs';
import path from 'path';
import consoleWrapper from '../utils/console.js';

const whatsapp = {
  sendText: async (to, text) => {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: text }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      consoleWrapper.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
};

export default whatsapp;
