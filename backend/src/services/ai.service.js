/**
 * AI Service
 * Logic for medical chat and query analysis with structured JSON output
 */

const axios = require('axios');
const AIConversation = require('../models/AIConversation.model');
const logger = require('../config/logger');

// Gemini Model Configuration (Preferred)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Custom LLM Configuration
const CUSTOM_LLM_URL = process.env.CUSTOM_LLM_URL;
const CUSTOM_LLM_MODEL = process.env.CUSTOM_LLM_MODEL;

const MEDICAL_SYSTEM_PROMPT = `
You are DocBuddy AI, a medical assistant. Your goal is to guide patients safely.
CRITICAL RULES:
1. NEVER provide prescriptions or specific medication dosages.
2. ALWAYS include a disclaimer: "This is not medical advice. Consult a doctor for diagnosis."
3. If red flags (chest pain, severe bleeding, difficulty breathing) are detected, advise IMMEDIATELY seeking emergency care.
4. Structure your response in valid JSON format.
5. Suggest relevant medical specializations (e.g., Cardiologist, Dermatologist).
6. Be empathetic but professional.

JSON Structure:
{
  "summary": "Brief analysis of the patient's concerns",
  "possibleCauses": ["Possible cause 1", "Possible cause 2"],
  "recommendations": ["Safe lifestyle advice", "Consultation suggestion"],
  "warningFlags": ["Symptoms that require immediate attention"],
  "shouldSeeDoctor": true/false,
  "urgencyLevel": "low/medium/high/emergency",
  "suggestedSpecialization": "Recommended doctor type",
  "disclaimer": "Standard medical disclaimer"
}
`;

/**
 * Chat with AI (Context-aware)
 */
exports.chatWithAi = async (patientId, sessionId, content) => {
  try {
    // 1. Get or create conversation session
    let conversation = await AIConversation.findOne({ sessionId, patient: patientId });

    if (!conversation) {
      conversation = await AIConversation.create({
        patient: patientId,
        sessionId,
        title: content.substring(0, 50),
        messages: [{ role: 'system', content: MEDICAL_SYSTEM_PROMPT }]
      });
    }

    // 2. Format message history for LLM
    const history = conversation.messages.map(m => ({ 
      role: m.role, 
      content: m.content 
    }));
    
    // Add new user message
    history.push({ role: 'user', content });

    // 3. Call LLM (Example: Custom LLM or Gemini)
    let aiMessageContent;
    let structured;

    if (process.env.AI_PROVIDER === 'gemini') {
      aiMessageContent = await callGeminiAPI(history);
    } else {
      aiMessageContent = await callCustomLLM(history);
    }

    // 4. Parse JSON Response
    try {
      // Find JSON block if LLM adds markdown or fluff
      // First try to match between ```json and ```
      let jsonStr = aiMessageContent.match(/```json\s*([\s\S]*?)\s*```/)?.[1];
      
      // If that fails, find the first '{' and last '}'
      if (!jsonStr) {
        const match = aiMessageContent.match(/\{[\s\S]*\}/);
        jsonStr = match ? match[0] : null;
      }

      if (!jsonStr) throw new Error('No JSON found in AI response');
      
      structured = JSON.parse(jsonStr);
    } catch (e) {
      logger.error('AI Failed to provide structured JSON:', aiMessageContent);
      structured = { 
        summary: aiMessageContent.replace(/\{[\s\S]*\}/g, '').trim(), 
        urgencyLevel: 'unknown',
        disclaimer: "This is not medical advice. Consult a doctor for diagnosis."
      };
    }

    // 5. Save to Conversation
    conversation.messages.push({ role: 'user', content });
    conversation.messages.push({ 
      role: 'assistant', 
      content: structured.summary || aiMessageContent,
      structuredResponse: structured
    });
    
    conversation.lastMessageAt = Date.now();
    conversation.messageCount = conversation.messages.length;
    await conversation.save();

    return structured;
  } catch (err) {
    logger.error(`AI Chat Error: ${err.message}`);
    throw err;
  }
};

/**
 * Gemini API Shim
 */
async function callGeminiAPI(history) {
  // Using simplified axios call to Gemini 1.5 Pro/Flash endpoint
  // Implementation note: You'll need to use the actual Google Generative AI Node.js SDK for production.
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        { role: "user", parts: [{ text: history[0].content }] }, // System Prompt
        ...history.slice(1).map(h => ({ 
          role: h.role === 'user' ? "user" : "model", 
          parts: [{ text: h.content }] 
        }))
      ],
      generationConfig: {
        responseMimeType: "application/json",
      }
    }
  );

  return response.data.candidates[0].content.parts[0].text;
}

/**
 * Helper to format prompt for fine-tuned models
 */
function formatPromptByModel(messages) {
  const modelName = CUSTOM_LLM_MODEL.toLowerCase();

  // Llama-3 Format
  if (modelName.includes('llama-3') || modelName.includes('llama3')) {
    let prompt = "<|begin_of_text|>";
    messages.forEach(msg => {
      prompt += `<|start_header_id|>${msg.role}<|end_header_id|>\n\n${msg.content}<|eot_id|>`;
    });
    prompt += `<|start_header_id|>assistant<|end_header_id|>\n\n`;
    return prompt;
  }

  // Mistral / Llama-2 [INST] format
  if (modelName.includes('mistral') || modelName.includes('llama-2')) {
    let prompt = "";
    messages.forEach(msg => {
      if (msg.role === 'system') prompt += `[INST] <<SYS>>\n${msg.content}\n<</SYS>>\n\n`;
      else if (msg.role === 'user') prompt += `${msg.content} [/INST] `;
      else prompt += `${msg.content} [INST] `;
    });
    return prompt;
  }

  // Default: Return as-is for OpenAI-compatible ChatCompletions APIs
  return messages;
}

/**
 * Custom LLM Shim (compatible with OpenAI-like API or RAW prompt)
 */
async function callCustomLLM(history) {
  try {
    const formattedInput = formatPromptByModel(history);
    const isRawPrompt = typeof formattedInput === 'string';

    const payload = isRawPrompt 
      ? { model: CUSTOM_LLM_MODEL, prompt: formattedInput, stop: ["<|eot_id|>", "[/INST]"], temperature: 0.1 }
      : { model: CUSTOM_LLM_MODEL, messages: history, temperature: 0.1, response_format: { type: "json_object" } };

    const endpoint = isRawPrompt 
      ? CUSTOM_LLM_URL.replace('/chat/completions', '/completions') 
      : CUSTOM_LLM_URL;

    logger.debug(`Calling Custom LLM at: ${endpoint}`);

    const response = await axios.post(
      endpoint,
      payload,
      { 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY || 'no-key'}` 
        },
        timeout: 60000 // 60s timeout for local inference
      }
    );

    const result = isRawPrompt 
      ? response.data.choices[0].text 
      : response.data.choices[0].message.content;

    return result;
  } catch (error) {
    logger.error('Custom LLM Call Failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`AI model server at ${CUSTOM_LLM_URL} is not reachable. Ensure your fine-tuned model is running.`);
    }
    throw error;
  }
}
