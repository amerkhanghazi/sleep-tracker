import OpenAI from 'openai';
import { checkAndLogAIRequest } from './checkLimit';
import { checkUser } from './checkUser';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Tracker-360 AI',
  },
});

export interface SleepRecord {
  id: string;
  date: string;
  quality: string;
  hours: number;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

/**
 * ---- Sleep Insights ----
 */
export async function generateSleepInsights(
  sleepRecords: SleepRecord[]
): Promise<AIInsight[]> {
  // Use last 7 days only (saves tokens)
  const recent = sleepRecords.slice(-7);

  // Compact representation instead of full JSON.stringify
  const compactData = recent
    .map(r => `${r.date}:${r.hours}h:${r.quality}`)
    .join(', ');

  return generateInsightsHelper(
    compactData,
    `Analyze the following sleep data (last 7 days) and provide 1–2 actionable insights. 
     Sleep Data: ${compactData}
     Focus on: consistency of hours, trends in quality, health/wellness suggestions, positive reinforcement.`
  );
}

/**
 * ---- Shared Helper ----
 */
async function generateInsightsHelper(
  compactData: string,
  prompt: string
): Promise<AIInsight[]> {
  try {
    const user = await checkUser();
    if (!user) throw new Error('User not authenticated');

    // ✅ Check quota
    const { allowed, reason } = await checkAndLogAIRequest();
    if (!allowed) {
      return [
        {
          id: 'quota-reached',
          type: 'warning',
          title: 'Daily Quota Reached',
          message:
            reason ||
            '🚦 You’ve used your free AI insights for today. Please try again tomorrow.',
          action: 'Upgrade for unlimited insights',
          confidence: 1.0,
        },
      ];
    }

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'system',
          content: `You are a health insights AI. 
          Always return only a valid JSON array. 
          Each object must have: type, title, message, action, confidence. 
          No text outside the array.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 150, // reduced from 300 for token savings
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from AI');

    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    const insights = JSON.parse(cleanedResponse);

    return insights.map((insight: RawInsight, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: (insight.type as AIInsight['type']) || 'info',
      title: insight.title || 'AI Insight',
      message: insight.message || 'Analysis complete',
      action: insight.action,
      confidence: insight.confidence || 0.8,
    }));
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message: 'Unable to generate insights right now. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}
