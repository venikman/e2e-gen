import axios from 'axios';

interface OllamaConfig {
  url: string;
  model: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaClient {
  private config: OllamaConfig;

  constructor(config: OllamaConfig) {
    this.config = config;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(
        `${this.config.url}/api/chat`,
        {
          model: this.config.model,
          messages,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 2 minutes timeout for Ollama
        }
      );

      return response.data.message?.content || '';
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  async generateTestSteps(pageContent: string, testObjective: string): Promise<string[]> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert test automation engineer specializing in Playwright test generation. 
      Given HTML content and a test objective, generate specific Playwright test steps. 
      Return only the steps as a JSON array of strings with valid Playwright syntax.
      
      Focus on:
      - Valid CSS selectors and locators
      - Proper async/await syntax
      - Clear assertions using expect()
      - Realistic test scenarios
      - Error handling considerations`,
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: `HTML Content: ${pageContent}

Test Objective: ${testObjective}

Generate specific Playwright test steps to achieve this objective. Return as a JSON array of strings.`,
    };

    const response = await this.chat([systemMessage, userMessage]);
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If it's not an array, wrap it
      return [response];
    } catch {
      // If JSON parsing fails, try to extract code blocks or return as split lines
      const codeBlockMatch = response.match(/```(?:json|javascript|typescript)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        try {
          return JSON.parse(codeBlockMatch[1]);
        } catch {
          return codeBlockMatch[1].split('\n').filter(line => line.trim().length > 0);
        }
      }
      // Fallback to splitting by lines
      return response.split('\n').filter(line => line.trim().length > 0);
    }
  }

  async analyzePageStructure(pageContent: string): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert web analyzer and test strategist. 
      Analyze HTML structure and provide comprehensive insights about:
      - Page layout and key sections
      - Interactive elements (forms, buttons, links)
      - Navigation patterns
      - Accessibility considerations
      - Potential testing strategies and edge cases
      - Performance considerations
      
      Provide actionable insights that can guide test creation.`,
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: `Analyze this HTML content and provide detailed insights for test planning:

${pageContent}`,
    };

    return await this.chat([systemMessage, userMessage]);
  }

  async generateTestCode(pageContent: string, testObjective: string, pageName: string): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert Playwright test code generator. 
      Generate complete, runnable Playwright test code with:
      - Proper TypeScript syntax
      - Import statements for @playwright/test
      - Describe blocks for organization
      - Multiple test cases covering different scenarios
      - Proper error handling
      - Realistic selectors based on the HTML
      - Clear test descriptions
      - Assertions that verify expected behavior`,
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content: `Generate complete Playwright test code for:
      
Page Name: ${pageName}
Test Objective: ${testObjective}
HTML Content: ${pageContent}

Return only the TypeScript test code without any explanation.`,
    };

    return await this.chat([systemMessage, userMessage]);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.url}/api/tags`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.config.url}/api/tags`);
      return response.data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error('Error listing Ollama models:', error);
      return [];
    }
  }
}

// Factory function to create Ollama client
export function createOllamaClient(): OllamaClient {
  const config: OllamaConfig = {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2:latest',
  };

  return new OllamaClient(config);
}
