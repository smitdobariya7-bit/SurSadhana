import dotenv from "dotenv";
import Groq from "groq-sdk";
import User from "../models/User.js";

dotenv.config();

let groq = null;
if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (err) {
    console.error('Failed to instantiate Groq client:', err?.message ?? err);
    groq = null;
  }
} else {
  console.warn('GROQ_API_KEY not set — AI endpoints will be disabled until a key is provided.');
}

// OpenAI configuration - only use server-side API key
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DEFAULT_GROQ_MODELS = [
  process.env.GROQ_MODEL,
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "mixtral-8x7b-32768"
].filter(Boolean);

const callOpenAI = async (message) => {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: message }]
    })
  });
  if (!resp.ok) {
    const errText = await resp.text();
    const error = new Error(`OpenAI API error: ${resp.status} ${errText}`);
    error.status = resp.status;
    throw error;
  }
  const json = await resp.json();
  return { choices: [{ message: { content: json.choices?.[0]?.message?.content || '' } }] };
};

const getTextCompletion = async (message) => {
  if (groq) {
    let lastGroqError = null;
    for (const model of DEFAULT_GROQ_MODELS) {
      try {
        return await groq.chat.completions.create({
          model,
          messages: [{ role: "user", content: message }]
        });
      } catch (modelErr) {
        lastGroqError = modelErr;
        console.warn(`Groq model failed: ${model}`);
      }
    }

    // Fall back to OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      try {
        return await callOpenAI(message);
      } catch (openaiErr) {
        console.warn("OpenAI fallback failed:", openaiErr?.message || openaiErr);
      }
    }

    throw lastGroqError || new Error("No text model available");
  }

  return callOpenAI(message);
};

const transcribeAudio = async (audioBuffer, filename, mimeType) => {
  const safeFilename = filename || `practice-${Date.now()}.webm`;
  const safeMimeType = mimeType || "audio/webm";
  const hasFileCtor = typeof File !== "undefined";

  // Try Groq transcription first when available
  if (hasFileCtor && groq && groq.audio && groq.audio.transcriptions && typeof groq.audio.transcriptions.create === "function") {
    try {
      const groqFile = new File([audioBuffer], safeFilename, { type: safeMimeType });
      const groqResp = await groq.audio.transcriptions.create({
        file: groqFile,
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json"
      });
      return groqResp?.text || "";
    } catch (err) {
      console.warn("Groq transcription failed, trying OpenAI fallback:", err?.message || err);
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    throw new Error("Transcription service not configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
  }

  const formData = new FormData();
  const audioBlob = new Blob([audioBuffer], { type: safeMimeType });
  formData.append("file", audioBlob, safeFilename);
  formData.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(errText);
    } catch {
      parsed = null;
    }

    const openaiCode = parsed?.error?.code || '';
    const openaiMessage = parsed?.error?.message || '';
    const error = new Error(`Transcription failed: ${response.status} ${openaiMessage || errText}`);
    error.status = response.status;
    error.code = openaiCode;
    throw error;
  }

  const json = await response.json();
  return json?.text || "";
};

const parseModelJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const formatResponse = (content) => {
  if (!content) return content;

  // Ensure proper line breaks and spacing
  let formatted = content
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\n\s*\n/g, '\n\n'); // Consistent paragraph spacing

  // Ensure bullet points have proper spacing using hyphen style for cleaner display
  formatted = formatted.replace(/(\n?)(•|\*|\-)\s*/g, '\n- ');

  // Ensure numbered lists have proper spacing
  formatted = formatted.replace(/(\n?)(\d+\.)\s*/g, '\n$2 ');

  return formatted;
};

const extractRequestedLanguage = (question = '') => {
  const q = question.trim();
  const patterns = [
    /\b(?:in|into)\s+([a-zA-Z]{3,20})\b/i,
    /\b([a-zA-Z]{3,20})\s+(?:me|mein|mai|main)\b/i,
    /\b([a-zA-Z]{3,20})\s+(?:language|bhasha|bhasa)\b/i
  ];
  for (const pattern of patterns) {
    const match = q.match(pattern);
    if (match?.[1]) {
      const lang = match[1].toLowerCase();
      if (!['what', 'which', 'this', 'that', 'with', 'from'].includes(lang)) {
        return lang;
      }
    }
  }
  return '';
};

const inferLanguageHint = (text = '') => {
  if (/[\u0900-\u097F]/.test(text)) return 'hindi (devanagari)';
  if (/[\u0600-\u06FF]/.test(text)) return 'arabic';
  if (/[\u0400-\u04FF]/.test(text)) return 'cyrillic-based language';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'chinese';
  if (/[\u3040-\u30FF]/.test(text)) return 'japanese';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'korean';
  if (/[a-z]/i.test(text)) return 'latin-script language (likely english or transliterated language)';
  return 'user language';
};

const isLikelyEnglish = (text = '') => {
  const sample = text.trim();
  if (!sample) return false;
  if (/[^\x00-\x7F]/.test(sample)) return false;
  const lower = sample.toLowerCase();
  const englishHints = ['what', 'how', 'why', 'when', 'where', 'is', 'are', 'the', 'please', 'explain'];
  return englishHints.some((w) => lower.includes(` ${w} `) || lower.startsWith(`${w} `));
};

const getDeterministicRefusal = (question, requestedLanguage) => {
  const q = question || '';
  if (requestedLanguage) return '';
  if (/[\u0900-\u097F]/.test(q)) {
    return 'प्रश्न संगीत से संबंधित नहीं है। कृपया एक संगीत संबंधी प्रश्न पूछें।';
  }
  if (isLikelyEnglish(q)) {
    return 'This question is not music-related. Please ask a music-related question.';
  }
  return '';
};

const buildMultilingualRefusalPrompt = (question, requestedLanguage, languageHint) => `
You are AI Guru for a music-learning app.
Task: return ONLY one short refusal message.

Rules:
1) Refuse to answer non-music questions.
2) Ask user to ask a music-related question.
3) Output in the same language as the user message.
4) If user explicitly asks for another language, use that requested language.
5) Never choose an unrelated third language.
6) Keep script consistent with target language (for example Devanagari, Arabic, Cyrillic, etc.).
7) No extra explanation, no markdown, no bullets.

Requested output language (if any): ${requestedLanguage || 'none'}
Language hint from input: ${languageHint}

User message:
"""${question}"""
`.trim();

const isMusicRelatedQuestion = (question = '') => {
  const q = question.toLowerCase();
  const musicKeywords = [
    'music', 'song', 'sing', 'singing', 'vocal', 'voice', 'pitch', 'scale', 'notes', 'melody', 'rhythm',
    'raag', 'raga', 'raaga', 'taal', 'laya', 'swar', 'sur', 'riyaz', 'alaap', 'taan', 'bandish', 'sargam',
    'tanpura', 'tabla', 'harmonium', 'guitar', 'piano', 'flute', 'violin', 'tempo', 'metronome',
    'गाना', 'संगीत', 'राग', 'ताल', 'स्वर', 'सुर', 'लय', 'रियाज़', 'आलाप', 'तान', 'बंदिश'
  ];
  return musicKeywords.some((keyword) => q.includes(keyword));
};

const buildMusicOnlyPrompt = (question, requestedLanguage, languageHint) => `
You are "AI Guru" for SurSadhana, an Indian music learning app.
Requested output language (if any): ${requestedLanguage || 'none'}
Language hint from input: ${languageHint}

Mandatory rules:
1) Answer ONLY music-related questions (Indian classical, vocal training, raag, taal, riyaz, swar, sur, laya, theory, practice plans, voice care for singing, instruments used in music learning).
2) If the question is not music-related, do NOT answer it. Politely refuse in the same language as the user and ask for a music question.
3) Detect the user's language from the question and reply in the SAME language.
4) If user explicitly asks for another language, reply in that requested language.
5) Keep script style correct for the chosen language.
6) Keep the same script style as user input when possible:
   - If user writes in Roman Hindi/Hinglish, reply in Roman Hindi/Hinglish.
   - If user writes in Devanagari Hindi, reply in Devanagari Hindi.
   - If user writes in English, reply in English.
7) Give practical, clear, structured guidance. Avoid generic filler.
8) Never switch language unless user asks.
9) Format responses for maximum readability:
   - Use short paragraphs (2-4 sentences each)
   - Use bullet points (•) for lists and steps
   - Use numbered lists (1., 2., 3.) for sequences
   - Use bold text with **asterisks** for emphasis
   - Break down complex ideas into simple steps
   - Use clear headings like "Practice Plan:" or "Key Points:"
   - Keep explanations simple and actionable
   - Avoid long blocks of text without breaks
10) Return ONLY valid JSON, with exactly two keys:
    {
      "english": "...",
      "hindi": "..."
    }
    Do not include markdown or any extra text before or after the JSON.
    Make the English answer simple and easy to read.
    Make the Hindi answer clear and natural for Hindi speakers.
    Provide both versions even if the question is already in one language.

User question:
"""${question}"""
`.trim();

export const askAI = async (req, res) => {
  try {
    if (!groq) {
      // If Groq missing, try fallback to OpenAI (developer convenience)
      if (!OPENAI_KEY_FALLBACK && !process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'AI service not configured. Set GROQ_API_KEY in server .env or environment.' });
      }
    }

    const question = (req.body?.message || req.body?.question || '').trim();
    if (!question) {
      return res.status(400).json({ error: 'message or question is required' });
    }
    const requestedLanguage = extractRequestedLanguage(question);
    const languageHint = inferLanguageHint(question);

    if (!isMusicRelatedQuestion(question)) {
      let refusal = 'I can only answer music-related questions. Please ask a music question.';
      const deterministicRefusal = getDeterministicRefusal(question, requestedLanguage);
      if (deterministicRefusal) {
        refusal = deterministicRefusal;
        return res.json({
          reply: refusal,
          answer: refusal,
          related_raag: '',
          practice_tip: '',
          difficulty_level: 'Beginner'
        });
      }
      try {
        const refusalCompletion = await getTextCompletion(
          buildMultilingualRefusalPrompt(question, requestedLanguage, languageHint)
        );
        const refusalText = refusalCompletion?.choices?.[0]?.message?.content?.trim();
        if (refusalText) refusal = refusalText;
      } catch (refusalError) {
        console.warn('Multilingual refusal generation failed:', refusalError?.message || refusalError);
      }
      return res.json({
        reply: formatResponse(refusal),
        answer: formatResponse(refusal),
        related_raag: '',
        practice_tip: '',
        difficulty_level: 'Beginner'
      });
    }

    const message = buildMusicOnlyPrompt(question, requestedLanguage, languageHint);

    // Retry wrapper for transient errors (e.g., rate limits)
    const maxRetries = 2;
    let attempt = 0;
    let completion = null;
    while (attempt <= maxRetries) {
      try {
        completion = await getTextCompletion(message);
        break;
      } catch (err) {
        attempt += 1;
        const isRate = err && (err.status === 429 || /rate limit/i.test(err?.message || ''));
        if (attempt > maxRetries || !isRate) throw err;
        const backoff = 500 * Math.pow(2, attempt - 1);
        console.warn(`AI request rate-limited, retrying in ${backoff}ms (attempt ${attempt})`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }

    if (!completion) {
      throw new Error('AI completion failed after retries');
    }

    const content = completion.choices[0].message.content;
    const parsed = parseModelJson(content);
    if (parsed && (typeof parsed.english === 'string' || typeof parsed.hindi === 'string')) {
      const answerEn = formatResponse(parsed.english || parsed.hindi || content);
      const answerHi = formatResponse(parsed.hindi || parsed.english || content);
      const defaultAnswer = answerEn || answerHi;
      return res.json({
        reply: defaultAnswer,
        answer: defaultAnswer,
        answer_en: answerEn,
        answer_hi: answerHi,
        related_raag: '',
        practice_tip: '',
        difficulty_level: 'Beginner'
      });
    }

    const formattedContent = formatResponse(content);
    res.json({
      reply: formattedContent,
      answer: formattedContent,
      answer_en: formattedContent,
      answer_hi: formattedContent,
      related_raag: '',
      practice_tip: '',
      difficulty_level: 'Beginner'
    });

  } catch (error) {
    console.error('AI error:', error?.message ?? error);
    const message = error?.message || 'AI error';
    const isRateLimit = (error && (error.status === 429 || /rate limit/i.test(message))) || false;
    if (isRateLimit) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    res.status(500).json({ error: message });
  }
};

export const analyzeAudioWithAI = async (req, res) => {
  try {
    const { audioBase64, mimeType, filename, question = '', context = '' } = req.body || {};
    if (!audioBase64 || typeof audioBase64 !== "string") {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const cleanedBase64 = audioBase64.includes(",") ? audioBase64.split(",")[1] : audioBase64;
    const audioBuffer = Buffer.from(cleanedBase64, "base64");
    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: "Invalid audio data" });
    }

    if (audioBuffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: "Audio file too large. Max allowed size is 15MB." });
    }

    const transcript = await transcribeAudio(audioBuffer, filename, mimeType);
    if (!transcript.trim()) {
      return res.status(422).json({ error: "Could not transcribe audio. Try clearer recording." });
    }

    const prompt = `
You are AI Guru, an expert Indian classical vocal practice coach.
Analyze the following practice audio transcript and provide clear, practical feedback.

Transcript:
${transcript}

Extra context from user:
${context || "N/A"}

User question (if any):
${question || "No specific question. Provide a complete review."}

Return STRICT JSON with keys:
{
  "summary": "2-4 lines summary",
  "detected_content": "what the user likely sang/spoke/practiced",
  "strengths": ["...","..."],
  "improvements": ["...","...","..."],
  "practice_plan": ["...","...","..."],
  "answer_to_question": "direct answer to user question"
}
Only JSON. No markdown.
    `.trim();

    const completion = await getTextCompletion(prompt);
    const modelText = completion?.choices?.[0]?.message?.content || "";
    const parsed = parseModelJson(modelText);

    if (!parsed) {
      return res.json({
        transcript,
        summary: "Audio was processed, but structured feedback parsing failed.",
        detected_content: transcript.slice(0, 200),
        strengths: [],
        improvements: ["Please retry the analysis with a shorter question."],
        practice_plan: [],
        answer_to_question: question ? "Could not generate a reliable answer this time." : ""
      });
    }

    return res.json({
      transcript,
      summary: parsed.summary || "",
      detected_content: parsed.detected_content || "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      practice_plan: Array.isArray(parsed.practice_plan) ? parsed.practice_plan : [],
      answer_to_question: parsed.answer_to_question || ""
    });
  } catch (error) {
    console.error("Audio analysis error:", error?.message || error);
    const isQuotaError =
      error?.status === 429 ||
      error?.code === 'insufficient_quota' ||
      /insufficient[_\s-]?quota|exceeded your current quota/i.test(error?.message || '');

    if (isQuotaError) {
      return res.status(402).json({
        error: "Transcription quota exceeded. OpenAI quota/top-up required, or configure a valid GROQ_API_KEY for fallback."
      });
    }
    return res.status(500).json({ error: error?.message || "Audio analysis failed" });
  }
};

export const getAIHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('aiChatHistory');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ messages: user.aiChatHistory || [] });
  } catch (error) {
    console.error('Get AI history error:', error);
    return res.status(500).json({ error: 'Failed to fetch AI history' });
  }
};

export const saveAIHistory = async (req, res) => {
  try {
    const { messages } = req.body || {};
    const cleanedMessages = sanitizeHistory(messages);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.aiChatHistory = cleanedMessages;
    await user.save();

    return res.json({ success: true, count: cleanedMessages.length });
  } catch (error) {
    console.error('Save AI history error:', error);
    return res.status(500).json({ error: 'Failed to save AI history' });
  }
};

export default groq
