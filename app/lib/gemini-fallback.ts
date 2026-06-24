import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_PRIMARY_MODEL = 'gemini-2.5-flash-lite';
export const GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

type GenerateContentOptions = {
  minTextLength?: number;
};

const DEFAULT_GENERATION_CONFIG = {
  maxOutputTokens: 8192,
  temperature: 0.45,
  topP: 0.95,
};

const QUALITY_SYSTEM_INSTRUCTION = `
당신은 한국 산업안전보건 문서 작성 전문가입니다.
응답은 사용자가 바로 업무 문서에 활용할 수 있도록 구체적이고 충분한 분량으로 작성하세요.
항목을 과도하게 축약하지 말고, 위험요인과 대책은 현장 상황을 반영해 실무적인 문장으로 작성하세요.
요청한 출력 형식은 반드시 유지하세요.
`;

function createModel(genAI: GoogleGenerativeAI, model: string) {
  return genAI.getGenerativeModel({
    model,
    generationConfig: DEFAULT_GENERATION_CONFIG,
    systemInstruction: QUALITY_SYSTEM_INSTRUCTION,
  });
}

function getResponseTextLength(result: any) {
  try {
    return result.response.text().trim().length;
  } catch {
    return 0;
  }
}

export async function generateContentWithFallback(
  genAI: GoogleGenerativeAI,
  contents: any,
  options: GenerateContentOptions = {}
) {
  const primaryModel = createModel(genAI, GEMINI_PRIMARY_MODEL);

  try {
    const primaryResult = await primaryModel.generateContent(contents);
    const minTextLength = options.minTextLength ?? 0;

    if (minTextLength > 0 && getResponseTextLength(primaryResult) < minTextLength) {
      console.warn(
        `${GEMINI_PRIMARY_MODEL} 응답이 짧아 ${GEMINI_FALLBACK_MODEL}로 재시도합니다.`
      );
      const fallbackModel = createModel(genAI, GEMINI_FALLBACK_MODEL);
      return fallbackModel.generateContent(contents);
    }

    return primaryResult;
  } catch (primaryError) {
    console.warn(
      `${GEMINI_PRIMARY_MODEL} 호출 실패, ${GEMINI_FALLBACK_MODEL}로 재시도합니다.`,
      primaryError
    );

    const fallbackModel = createModel(genAI, GEMINI_FALLBACK_MODEL);
    return fallbackModel.generateContent(contents);
  }
}
