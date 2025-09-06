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
 * ---- Local Rule-Based Fallback ----
 * ✅ Returns 3–4 blocks (warning/tip/success/info) when AI quota or API fails
 */
function localSleepInsights(records: SleepRecord[]): AIInsight[] {
  if (!records || records.length === 0) {
    return [
      {
        id: 'local-empty',
        type: 'info',
        title: 'No Data',
        message: 'Add more sleep records to see insights.',
        confidence: 0.5,
      },
    ];
  }

  const avgHours = records.reduce((s, r) => s + r.hours, 0) / records.length;
  const poorDays = records.filter(r => r.hours < 6).length;
  const goodDays = records.filter(r => r.hours >= 7).length;

  const insights: AIInsight[] = [];

  // 1️⃣ Average sleep
  if (avgHours < 6) {
    insights.push({
      id: 'local-1',
      type: 'warning',
      title: 'Low Sleep Duration',
      message: `Your average sleep is ${avgHours.toFixed(
        1
      )}h — aim for 7–8h consistently.`,
      confidence: 0.7,
    });
  } else {
    insights.push({
      id: 'local-2',
      type: 'success',
      title: 'Healthy Sleep Average',
      message: `Nice! Your average sleep is ${avgHours.toFixed(
        1
      )}h, which is within the healthy range.`,
      confidence: 0.8,
    });
  }

  // 2️⃣ Consistency
  if (poorDays > 2) {
    insights.push({
      id: 'local-3',
      type: 'tip',
      title: 'Inconsistent Sleep',
      message: `You had ${poorDays} nights under 6h. Try to avoid late nights.`,
      confidence: 0.6,
    });
  } else {
    insights.push({
      id: 'local-4',
      type: 'success',
      title: 'Consistent Routine',
      message: `Most of your nights (${goodDays}) were above 7h — great consistency!`,
      confidence: 0.75,
    });
  }

  // 3️⃣ Motivation
  insights.push({
    id: 'local-5',
    type: 'info',
    title: 'Keep Going',
    message: 'Logging sleep daily helps build stronger insights. Keep it up!',
    confidence: 0.9,
  });

  // 4️⃣ General health tip
  insights.push({
    id: 'local-6',
    type: 'tip',
    title: 'Sleep Hygiene',
    message:
      'Try to maintain a fixed bedtime, avoid caffeine late in the evening, and keep screens away before sleep.',
    confidence: 0.7,
  });

  return insights;
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
     Focus on: consistency of hours, trends in quality, health/wellness suggestions, positive reinforcement.`,
    recent // ✅ pass recent records for local fallback
  );
}

/**
 * ---- Shared Helper ----
 */
async function generateInsightsHelper(
  compactData: string,
  prompt: string,
  recentRecords?: SleepRecord[]
): Promise<AIInsight[]> {
  try {
    const user = await checkUser();
    if (!user) throw new Error('User not authenticated');

    // ✅ Check quota
    const { allowed, fallback, reason } = await checkAndLogAIRequest();
    if (!allowed) {
      if (fallback && recentRecords) {
        console.warn('⚠️ Daily quota reached — using local insights instead.');
        return localSleepInsights(recentRecords);
      }
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

    // ---- Try primary model first ----
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3-0324:free', // primary
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
        max_tokens: 150,
      });
    } catch (err: any) {
      if (err.status === 429) {
        console.warn('⚠️ Provider 429 error, retrying with backup model...');
        // ---- Fallback to backup model ----
        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // backup
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
          max_tokens: 150,
        });
      } else {
        throw err;
      }
    }

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from AI');

    // ---- Cleanup response ----
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
  } catch (error: any) {
    console.error('❌ Error generating AI insights:', error);

    // ✅ Local fallback if records exist
    if (recentRecords) {
      return localSleepInsights(recentRecords);
    }

    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          error?.status === 429
            ? 'Provider limit reached. Please wait or upgrade to continue using AI insights.'
            : 'Unable to generate insights right now. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}
