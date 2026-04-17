/**
 * Connectivity Test for AI Fine-Tuned Model
 */
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const CUSTOM_LLM_URL = process.env.CUSTOM_LLM_URL;
const CUSTOM_LLM_MODEL = process.env.CUSTOM_LLM_MODEL;

async function testConnection() {
  console.log('--- DocBuddy AI Integration Test ---');
  console.log(`Endpoint: ${CUSTOM_LLM_URL}`);
  console.log(`Model: ${CUSTOM_LLM_MODEL}`);
  console.log('------------------------------------');

  try {
    const response = await axios.post(
      CUSTOM_LLM_URL,
      {
        model: CUSTOM_LLM_MODEL,
        messages: [
          { role: 'system', content: 'You are a medical assistant. Always respond in JSON.' },
          { role: 'user', content: 'I have a headache. What should I do?' }
        ],
        temperature: 0.1,
        max_tokens: 200
      },
      { timeout: 10000 }
    );

    console.log('✅ Connection Successful!');
    console.log('Response Preview:');
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Connection Failed!');
    if (error.code === 'ECONNREFUSED') {
      console.error(`- Error: Model server at ${CUSTOM_LLM_URL} is offline.`);
      console.error('- Solution: Ensure your fine-tuned model (e.g., via Ollama/vLLM) is running.');
    } else {
      console.error(`- Error: ${error.message}`);
    }
  }
}

testConnection();
