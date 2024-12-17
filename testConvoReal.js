import axios from 'axios';
import readline from 'readline';

// Base URL of your webhook server
const baseURL = 'http://localhost:3000/webhooks';

// Create an interface for reading lines from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send a message to the webhook
async function sendMessage(body) {
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
                    text: { body },
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
    console.log(`Sent message: "${body}" - Response: ${response.status}`);
  } catch (error) {
    console.error(`Error sending message: "${body}" -`, error.response ? error.response.data : error.message);
  }
}

// Prompt the user for input and send messages
function promptUser() {
  rl.question('Enter message: ', async (message) => {
    if (message.toLowerCase() === 'exit') {
      rl.close();
    } else {
      await sendMessage(message);
      promptUser(); // Prompt for the next message
    }
  });
}

promptUser(); // Start the prompt