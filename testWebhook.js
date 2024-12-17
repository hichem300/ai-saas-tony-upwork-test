import axios from 'axios';

// Base URL of your webhook server
const baseURL = 'http://localhost:3000/webhooks';

// Hardcoded verification token for testing
const VERIFY_TOKEN = 'test'; // Replace with your actual token

// Function to test GET request for webhook verification
async function testGetWebhook() {
  try {
    const response = await axios.get(`${baseURL}/whatsapp`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': VERIFY_TOKEN,
        'hub.challenge': 'CHALLENGE_ACCEPTED'
      }
    });
    console.log('GET Webhook Response:', response.data);
  } catch (error) {
    console.error('GET Webhook Error:', error.response ? error.response.data : error.message);
  }
}

// Function to test POST request for incoming messages
async function testPostWebhook() {
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
                    timestamp: '1733599352',
                    text: {
                      body: 'Test message'
                    },
                    type: 'text'
                  }
                ]
              },
              field: 'messages'
            }
          ]
        }
      ]
    });
    console.log('POST Webhook Response:', response.status);
  } catch (error) {
    console.error('POST Webhook Error:', error.response ? error.response.data : error.message);
  }
}

// Run tests
testGetWebhook();
testPostWebhook();