import axios from 'axios';

// Base URL of your webhook server
const baseURL = 'http://localhost:3000/webhooks';

// Function to simulate a conversation
async function simulateConversation() {
  const messages = [
    { body: 'Hello!', type: 'text' },
    { body: 'How are you?', type: 'text' },
    { body: 'Tell me a joke.', type: 'text' },
    { body: 'Thank you!', type: 'text' }
  ];

  for (const message of messages) {
    try {
      const response = await axios.post(`${baseURL}/whatsapp`, {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: '123456789',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '1234567890',
                    phone_number_id: '0987654321'
                  },
                  contacts: [
                    {
                      profile: {
                        name: 'Test User'
                      },
                      wa_id: '33649951296'
                    }
                  ],
                  messages: [
                    {
                      from: '33649951296',
                      id: 'wamid.TEST',
                      timestamp: Date.now().toString(),
                      text: message,
                      type: message.type
                    }
                  ]
                },
                field: 'messages'
              }
            ]
          }
        ]
      });
      console.log(`Sent message: "${message.body}" - Response: ${response.status}`);
    } catch (error) {
      console.error(`Error sending message: "${message.body}" -`, error.response ? error.response.data : error.message);
    }
  }
}

// Run the conversation simulation
simulateConversation();