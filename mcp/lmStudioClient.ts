import axios from 'axios';

interface LMStudioConfig {
  url: string;
  model: string;
  apiKey: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LMStudioClient {
  private config: LMStudioConfig;

  constructor(config: LMStudioConfig) {
    this.config = config;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<ChatResponse>(
        `${this.config.url}/v1/chat/completions`,
        {
          model: this.config.model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('LM Studio API error:', error);
      throw error;
    }
  }

  async generateTestSteps(pageContent: string, testObjective: string): Promise<string[]> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert test automation engineer. Given HTML content and a test objective, generate specific Playwright test steps. Return only the steps as a JSON array of strings.`,
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: `HTML Content: ${pageContent}\n\nTest Objective: ${testObjective}\n\nGenerate specific Playwright test steps to achieve this objective.`,
    };

    const response = await this.chat([systemMessage, userMessage]);
    
    try {
      return JSON.parse(response);
    } catch {
      // If JSON parsing fails, return steps as split lines
      return response.split('\n').filter(line => line.trim().length > 0);
    }
  }

  async analyzePageStructure(pageContent: string): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert web analyzer. Analyze the HTML structure and provide insights about the page layout, key elements, and potential testing strategies.`,
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: `Analyze this HTML content and provide insights:\n\n${pageContent}`,
    };

    return await this.chat([systemMessage, userMessage]);
  }
}

// Factory function to create LM Studio client
export function createLMStudioClient(): LMStudioClient {
  const config: LMStudioConfig = {
    url: process.env.LM_STUDIO_URL || 'http://localhost:1234',
    model: process.env.LM_STUDIO_MODEL || 'llama-3.2-3b-instruct',
    apiKey: process.env.LM_STUDIO_API_KEY || 'lm-studio',
  };

  return new LMStudioClient(config);
}
