import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_PRIMARY_MODEL = 'gemini-3.1-flash-lite';
export const GEMINI_FALLBACK_MODEL = 'gemini-2.5-flash-lite';

export async function generateContentWithFallback(
  genAI: GoogleGenerativeAI,
  contents: any
) {
  const primaryModel = genAI.getGenerativeModel({ model: GEMINI_PRIMARY_MODEL });

  try {
    return await primaryModel.generateContent(contents);
  } catch (primaryError) {
    console.warn(
      `${GEMINI_PRIMARY_MODEL} 호출 실패, ${GEMINI_FALLBACK_MODEL}로 재시도합니다.`,
      primaryError
    );

    const fallbackModel = genAI.getGenerativeModel({ model: GEMINI_FALLBACK_MODEL });
    return fallbackModel.generateContent(contents);
  }
}
