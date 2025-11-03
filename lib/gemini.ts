import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Você é um assistente de nutrição para usuários de medicamentos GLP-1 (Mounjaro, Ozempic, Wegovy, Zepbound).

REGRAS OBRIGATÓRIAS:
1. APENAS responda sobre alimentação e nutrição
2. Se perguntarem sobre outros tópicos, responda: "Desculpe, só posso ajudar com nutrição 🍽️"
3. Não dê diagnósticos médicos
4. Não sugira mudanças em medicações
5. Foque em resumir o que o usuário comeu

FORMATO DE RESPOSTA:
- Resuma as refeições mencionadas (café da manhã, almoço, jantar, lanches)
- Estime macros aproximados (calorias, proteína, carboidratos quando relevante)
- Dê feedback motivacional breve e positivo
- Use tom amigável e encorajador
- Use emojis para deixar a mensagem mais amigável

EXEMPLO DE RESPOSTA:
"Resumo do seu dia:
☀️ Café da manhã: Café com leite, pão integral
🍽️ Almoço: Arroz, feijão, frango grelhado

📊 Estimativa nutricional:
• Calorias: ~850 kcal
• Proteína: ~45g
• Carboidratos: ~95g

💪 Muito bom! Excelente quantidade de proteína no almoço, fundamental durante o tratamento com GLP-1!"

Se o usuário perguntar algo não relacionado a nutrição, responda educadamente que só pode ajudar com alimentação.`;

export interface NutritionAnalysis {
  summary: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  rawResponse: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Access environment variable directly
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'models/gemini-flash-lite-latest',
        systemInstruction: SYSTEM_PROMPT,
      });
    } catch (error) {
      console.error('Error initializing Gemini:', error);
    }
  }

  async analyzeNutrition(userMessage: string): Promise<NutritionAnalysis> {
    if (!this.model) {
      throw new Error('Gemini API não configurada. Por favor, adicione sua API key no arquivo .env');
    }

    try {
      const result = await this.model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      // Extract macros from response using regex
      const caloriesMatch = text.match(/(\d+)\s*kcal/i);
      const proteinMatch = text.match(/(\d+)\s*g.*proteína/i);
      const carbsMatch = text.match(/(\d+)\s*g.*carboidrat/i);
      const fatsMatch = text.match(/(\d+)\s*g.*gordura/i);

      return {
        summary: text,
        calories: caloriesMatch ? parseInt(caloriesMatch[1]) : undefined,
        protein: proteinMatch ? parseInt(proteinMatch[1]) : undefined,
        carbs: carbsMatch ? parseInt(carbsMatch[1]) : undefined,
        fats: fatsMatch ? parseInt(fatsMatch[1]) : undefined,
        rawResponse: text,
      };
    } catch (error: any) {
      console.error('Error analyzing nutrition:', error);
      
      if (error?.message?.includes('API key')) {
        throw new Error('API key inválida. Verifique sua configuração.');
      }
      
      throw new Error('Erro ao processar sua mensagem. Tente novamente.');
    }
  }

  isConfigured(): boolean {
    return this.model !== null;
  }
}

// Singleton instance
export const geminiService = new GeminiService();

