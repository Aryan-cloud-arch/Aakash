import { Question } from './types';

// Using gemini-2.5-flash-lite model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// Utility function to wait
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Multi-API key management
interface KeyStatus {
  key: string;
  isExhausted: boolean;
  lastUsed: number;
  requestCount: number;
  successCount: number;
  failCount: number;
}

let apiKeys: KeyStatus[] = [];

// Set multiple API keys
export const setApiKeys = (keys: string[]) => {
  apiKeys = keys
    .map(k => k.trim())
    .filter(k => k.length > 20) // Valid API keys are longer than 20 chars
    .map(key => ({
      key,
      isExhausted: false,
      lastUsed: 0,
      requestCount: 0,
      successCount: 0,
      failCount: 0,
    }));
};

// Get API keys count
export const getApiKeysCount = () => apiKeys.length;

// Get a specific key by index
const getKeyByIndex = (index: number): KeyStatus | null => {
  if (index >= 0 && index < apiKeys.length) {
    return apiKeys[index];
  }
  return null;
};

// Mark a key as exhausted
const markKeyExhausted = (key: string) => {
  const keyStatus = apiKeys.find(k => k.key === key);
  if (keyStatus) {
    keyStatus.isExhausted = true;
    keyStatus.failCount++;
  }
};

// Mark a key as successful
const markKeySuccess = (key: string) => {
  const keyStatus = apiKeys.find(k => k.key === key);
  if (keyStatus) {
    keyStatus.successCount++;
    keyStatus.requestCount++;
    keyStatus.lastUsed = Date.now();
  }
};

// Reset all exhausted keys
export const resetExhaustedKeys = () => {
  apiKeys.forEach(k => k.isExhausted = false);
};

// Get key statistics
export const getKeyStats = (): { total: number; active: number; exhausted: number; stats: KeyStatus[] } => {
  return {
    total: apiKeys.length,
    active: apiKeys.filter(k => !k.isExhausted).length,
    exhausted: apiKeys.filter(k => k.isExhausted).length,
    stats: apiKeys,
  };
};

// Find next available (non-exhausted) key starting from a given index
const findAvailableKey = (startIndex: number): KeyStatus | null => {
  for (let i = 0; i < apiKeys.length; i++) {
    const index = (startIndex + i) % apiKeys.length;
    if (!apiKeys[index].isExhausted) {
      return apiKeys[index];
    }
  }
  return null;
};

const lengthInstructions = {
  short: 'Keep questions concise, 1-2 sentences maximum.',
  medium: 'Questions should be 2-3 sentences with moderate detail.',
  long: 'Questions should be 3-5 sentences with good detail and context.',
  very_long: 'Questions should be 5-8 sentences with extensive detail, multiple given values, and complex scenarios. Perfect for filling exam pages.',
};

// Generate questions for a single batch using a specific API key
async function generateBatch(
  keyIndex: number,
  subject: string,
  syllabus: string,
  count: number,
  length: 'short' | 'medium' | 'long' | 'very_long',
  startNum: number,
  onProgress?: (msg: string) => void
): Promise<Question[]> {
  let currentKeyData = getKeyByIndex(keyIndex) || findAvailableKey(0);
  
  if (!currentKeyData) {
    throw new Error('No API keys available');
  }
  
  let activeApiKey = currentKeyData.key;

  const prompt = `Generate ${count} multiple choice questions for a NEET exam on the subject: ${subject}.

Syllabus/Topics to cover: ${syllabus}

${lengthInstructions[length]}

Requirements:
- Each question must have exactly 4 options
- Questions should be exam-appropriate for NEET level
- Include a mix of conceptual and numerical questions where applicable
- Options should be realistic and challenging
- Do NOT include the correct answer marking

Return ONLY a valid JSON array in this exact format (no markdown, no code blocks):
[
  {
    "text": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
  }
]`;

  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check if current key is exhausted
      const keyStatus = apiKeys.find(k => k.key === activeApiKey);
      if (keyStatus?.isExhausted) {
        const nextKey = findAvailableKey(keyIndex);
        if (!nextKey) {
          onProgress?.(`⏳ All keys exhausted. Waiting 30s to reset...`);
          await sleep(30000);
          resetExhaustedKeys();
          activeApiKey = apiKeys[keyIndex]?.key || apiKeys[0]?.key;
        } else {
          activeApiKey = nextKey.key;
        }
      }

      const response = await fetch(`${API_URL}?key=${activeApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
          },
        }),
      });

      if (response.status === 429) {
        // Rate limited - mark this key as exhausted
        markKeyExhausted(activeApiKey);
        onProgress?.(`🔄 Key (${activeApiKey.slice(-4)}) rate limited. Switching...`);
        
        // Find another key
        const nextKey = findAvailableKey(keyIndex + 1);
        if (nextKey) {
          activeApiKey = nextKey.key;
          continue;
        }
        
        // All keys exhausted
        const waitTime = Math.pow(2, attempt + 1) * 15000;
        onProgress?.(`⏳ All keys exhausted. Waiting ${Math.round(waitTime / 1000)}s...`);
        await sleep(waitTime);
        resetExhaustedKeys();
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Clean and parse JSON
      let jsonStr = text.trim();
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      jsonStr = jsonStr.trim();

      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      // Mark success
      markKeySuccess(activeApiKey);

      return parsed.map((q: { text: string; options: string[] }, index: number) => ({
        id: `q_${Date.now()}_${startNum + index}`,
        number: startNum + index,
        text: q.text || '',
        options: q.options || ['', '', '', ''],
        subject: subject,
      }));
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await sleep(2000);
    }
  }

  throw new Error('Failed after all retries');
}

interface GenerateQuestionsParams {
  apiKey: string;
  subject: string;
  syllabus: string;
  count: number;
  length: 'short' | 'medium' | 'long' | 'very_long';
  onProgress?: (progress: string) => void;
}

export async function generateQuestions({
  apiKey,
  subject,
  syllabus,
  count,
  length,
  onProgress,
}: GenerateQuestionsParams): Promise<Question[]> {
  // Parse API keys (comma or newline separated)
  const keys = apiKey.split(/[,\n]/).map(k => k.trim()).filter(k => k.length > 20);
  setApiKeys(keys);

  const numKeys = keys.length;
  onProgress?.(`🚀 Initialized ${numKeys} API keys for PARALLEL processing`);

  const allQuestions: Question[] = [];
  const batchSize = 5; // Questions per batch
  const totalBatches = Math.ceil(count / batchSize);
  
  // ⚡ MAXIMUM PARALLELISM: Use ALL keys simultaneously
  // Each key handles one batch at a time
  const parallelBatches = Math.min(numKeys, totalBatches);
  
  onProgress?.(`📊 Strategy: ${totalBatches} batches, ${parallelBatches} running in parallel`);
  onProgress?.(`⚡ Each of your ${numKeys} keys will work simultaneously!`);

  let completedBatches = 0;
  
  // Process batches in waves, each wave uses all available keys
  for (let waveStart = 0; waveStart < totalBatches; waveStart += parallelBatches) {
    const batchPromises: Promise<{ batchIndex: number; questions: Question[] }>[] = [];
    const waveSize = Math.min(parallelBatches, totalBatches - waveStart);
    
    onProgress?.(`\n🌊 Wave ${Math.floor(waveStart / parallelBatches) + 1}: Launching ${waveSize} parallel batches...`);

    for (let i = 0; i < waveSize; i++) {
      const batchIndex = waveStart + i;
      const keyIndex = i % numKeys; // Assign each batch to a different key
      const questionsInBatch = Math.min(batchSize, count - batchIndex * batchSize);
      const startNum = batchIndex * batchSize + 1;
      
      const keyInfo = keys[keyIndex].slice(-6);
      onProgress?.(`  🔑 Batch ${batchIndex + 1} → Key #${keyIndex + 1} (...${keyInfo})`);

      // Create promise for this batch
      const batchPromise = generateBatch(
        keyIndex,
        subject,
        syllabus,
        questionsInBatch,
        length,
        startNum,
        onProgress
      ).then(questions => ({ batchIndex, questions }));

      batchPromises.push(batchPromise);
    }

    // Wait for ALL parallel batches in this wave to complete
    try {
      onProgress?.(`  ⏳ Waiting for ${waveSize} batches to complete...`);
      
      const results = await Promise.allSettled(batchPromises);
      
      // Process results
      let successCount = 0;
      let failCount = 0;
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allQuestions.push(...result.value.questions);
          successCount++;
          completedBatches++;
        } else {
          failCount++;
          onProgress?.(`  ❌ A batch failed: ${result.reason?.message || 'Unknown error'}`);
        }
      }

      const progress = Math.round((completedBatches / totalBatches) * 100);
      onProgress?.(`  ✅ Wave complete: ${successCount}/${waveSize} successful | Total: ${allQuestions.length}/${count} questions (${progress}%)`);

      // Small cooldown between waves (only if more waves remain)
      if (waveStart + parallelBatches < totalBatches) {
        const cooldown = numKeys >= 5 ? 1500 : 3000; // Less cooldown with more keys
        onProgress?.(`  💤 Cooling down ${cooldown / 1000}s before next wave...`);
        await sleep(cooldown);
      }
    } catch (error) {
      onProgress?.(`  ⚠️ Wave error: ${error instanceof Error ? error.message : 'Unknown'}`);
      if (allQuestions.length > 0) {
        onProgress?.(`  📦 Returning ${allQuestions.length} questions generated so far`);
        return allQuestions;
      }
      throw error;
    }
  }

  // Renumber all questions sequentially
  allQuestions.sort((a, b) => a.number - b.number);
  allQuestions.forEach((q, index) => {
    q.number = index + 1;
  });

  const stats = getKeyStats();
  onProgress?.(`\n🎉 COMPLETE! Generated ${allQuestions.length} questions`);
  onProgress?.(`📈 Key Stats: ${stats.active} active, ${stats.exhausted} exhausted`);

  return allQuestions;
}

interface RegenerateQuestionParams {
  apiKey: string;
  subject: string;
  syllabus: string;
  length: 'short' | 'medium' | 'long' | 'very_long';
}

export async function regenerateQuestion({
  apiKey,
  subject,
  syllabus,
  length,
}: RegenerateQuestionParams): Promise<{ text: string; options: string[] }> {
  // Use first available key
  const keys = apiKey.split(/[,\n]/).map(k => k.trim()).filter(k => k.length > 20);
  const key = keys[Math.floor(Math.random() * keys.length)] || keys[0]; // Random key for distribution

  const prompt = `Generate 1 multiple choice question for a NEET exam on the subject: ${subject}.

Syllabus/Topics: ${syllabus}

${lengthInstructions[length]}

Requirements:
- Must have exactly 4 options
- Question should be exam-appropriate for NEET level
- Options should be realistic and challenging

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "text": "Question text here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}`;

  const response = await fetch(`${API_URL}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Clean and parse JSON
  let jsonStr = text.trim();
  jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  jsonStr = jsonStr.trim();

  const parsed = JSON.parse(jsonStr);

  return {
    text: parsed.text || '',
    options: parsed.options || ['', '', '', ''],
  };
}
