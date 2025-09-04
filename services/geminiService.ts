
import { GoogleGenAI } from "@google/genai";
import { Employee, Withdrawal } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you would handle this more gracefully.
  // For this context, we assume API_KEY is set in the environment.
  console.warn("API_KEY is not set. AI Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const askAiAssistant = async (
  question: string,
  employees: Employee[],
  withdrawals: Withdrawal[]
): Promise<string> => {
  if (!API_KEY) {
    return "عذراً، خدمة المساعد الذكي غير متاحة حالياً. يرجى التأكد من إعداد مفتاح API.";
  }

  const currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
أنت مساعد محاسبة ذكي في تطبيق لإدارة رواتب الموظفين. مهمتك هي الإجابة على أسئلة المستخدم بناءً على البيانات المقدمة بصيغة JSON.
يجب أن تكون إجاباتك باللغة العربية، واضحة، وموجزة.
تاريخ اليوم هو: ${currentDate}.

بيانات الموظفين:
${JSON.stringify(employees, null, 2)}

بيانات السحوبات:
${JSON.stringify(withdrawals, null, 2)}

سؤال المستخدم: "${question}"

قم بتحليل البيانات وأجب على السؤال.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد محاسبة ذكي تتحدث باللغة العربية. حلل البيانات المقدمة للإجابة على أسئلة المستخدم.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "حدث خطأ أثناء محاولة الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
