import axios from 'axios';
import { OpenAI } from 'openai';
import { writeFileSync, createReadStream, unlinkSync } from 'fs';
import { join } from 'path';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function transcribeAudio(mediaId) {
  try {
    const audioBuffer = await downloadAudioFromWhatsApp(mediaId);
    const tempFilePath = join(__dirname, '..', '..', 'temp', `${mediaId}.ogg`);
    
    writeFileSync(tempFilePath, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: "whisper-1",
    });

    unlinkSync(tempFilePath);

    return transcription.text;
  } catch (error) {
    consoleWrapper.error(`Error transcribing audio: ${error.message}`);
    throw error;
  }
}

async function downloadAudioFromWhatsApp(mediaId) {
  try {
    const mediaUrl = await getMediaUrl(mediaId);
    const response = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
      }
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading audio from WhatsApp: ${error.message}`);
    throw error;
  }
}

async function getMediaUrl(mediaId) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v20.0/${mediaId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );
    return response.data.url;
  } catch (error) {
    console.error(`Error getting media URL: ${error.message}`);
    throw error;
  }
}

export default { transcribeAudio };
