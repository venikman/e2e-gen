import { OllamaClient, createOllamaClient } from './ollamaClient';
import { LMStudioClient, createLMStudioClient } from './lmStudioClient';

export type AIProvider = 'ollama' | 'lmstudio';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIClient {
  chat(messages: ChatMessage[]): Promise<string>;
  generateTestSteps(pageContent: string, testObjective: string): Promise<string[]>;
  analyzePageStructure(pageContent: string): Promise<string>;
  generateTestCode?(pageContent: string, testObjective: string, pageName: string): Promise<string>;
  isAvailable?(): Promise<boolean>;
  listModels?(): Promise<string[]>;
}

export class UnifiedAIClient implements AIClient {
  private client: AIClient;
  private provider: AIProvider;

  constructor(client: AIClient, provider: AIProvider) {
    this.client = client;
    this.provider = provider;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    return this.client.chat(messages);
  }

  async generateTestSteps(pageContent: string, testObjective: string): Promise<string[]> {
    return this.client.generateTestSteps(pageContent, testObjective);
  }

  async analyzePageStructure(pageContent: string): Promise<string> {
    return this.client.analyzePageStructure(pageContent);
  }

  async generateTestCode(pageContent: string, testObjective: string, pageName: string): Promise<string> {
    if (this.client.generateTestCode) {
      return this.client.generateTestCode(pageContent, testObjective, pageName);
    }
    
    // Fallback implementation for clients that don't support generateTestCode
    const steps = await this.generateTestSteps(pageContent, testObjective);
    return this.generateTestCodeFromSteps(steps, pageName, testObjective);
  }

  async isAvailable(): Promise<boolean> {
    if (this.client.isAvailable) {
      return this.client.isAvailable();
    }
    return true; // Assume available if not implemented
  }

  async listModels(): Promise<string[]> {
    if (this.client.listModels) {
      return this.client.listModels();
    }
    return [];
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  private generateTestCodeFromSteps(steps: string[], pageName: string, testObjective: string): string {
    const testCode = `import { test, expect } from '@playwright/test';

test.describe('${pageName} Tests', () => {
  test('${testObjective}', async ({ page }) => {
    // Navigate to the page
    await page.goto('/');
    
    // Generated test steps
${steps.map(step => `    ${step}`).join('\n')}
  });
});`;
    
    return testCode;
  }
}

export async function createAIClient(preferredProvider?: AIProvider): Promise<UnifiedAIClient> {
  const provider = preferredProvider || (process.env.AI_PROVIDER as AIProvider) || 'ollama';
  
  console.log(`Attempting to create AI client with provider: ${provider}`);
  
  if (provider === 'ollama') {
    const ollamaClient = createOllamaClient();
    
    // Check if Ollama is available
    const isOllamaAvailable = await ollamaClient.isAvailable();
    if (isOllamaAvailable) {
      console.log('✅ Ollama is available and ready');
      return new UnifiedAIClient(ollamaClient, 'ollama');
    } else {
      console.log('❌ Ollama is not available, falling back to LM Studio');
      const lmStudioClient = createLMStudioClient();
      return new UnifiedAIClient(lmStudioClient, 'lmstudio');
    }
  } else {
    console.log('Using LM Studio as specified');
    const lmStudioClient = createLMStudioClient();
    return new UnifiedAIClient(lmStudioClient, 'lmstudio');
  }
}

// Convenience functions for backward compatibility
export async function createDefaultAIClient(): Promise<UnifiedAIClient> {
  return createAIClient('ollama');
}

export async function createOllamaAIClient(): Promise<UnifiedAIClient> {
  return createAIClient('ollama');
}

export async function createLMStudioAIClient(): Promise<UnifiedAIClient> {
  return createAIClient('lmstudio');
}

// Health check function
export async function checkAIProviders(): Promise<{ ollama: boolean; lmstudio: boolean }> {
  const ollamaClient = createOllamaClient();
  const lmStudioClient = createLMStudioClient();
  
  const [ollamaAvailable, lmStudioAvailable] = await Promise.all([
    ollamaClient.isAvailable().catch(() => false),
    // LM Studio doesn't have isAvailable, so we'll assume it's available
    Promise.resolve(true)
  ]);
  
  return {
    ollama: ollamaAvailable,
    lmstudio: lmStudioAvailable
  };
}
