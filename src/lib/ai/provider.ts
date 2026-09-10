import { ComplaintAnalysis, GeneratedComplaint } from '../../types/complaint';
import { getDemoAnalysis, getDemoGenerated } from '../demo';

export interface AIProvider {
  transcribeAudio(audioBlob: Blob): Promise<string>;
  analyzeComplaint(transcript: string): Promise<ComplaintAnalysis>;
  generateComplaint(analysis: ComplaintAnalysis, additionalInfo?: Record<string, string>): Promise<GeneratedComplaint>;
}

class DemoAIProvider implements AIProvider {
  async transcribeAudio(_audioBlob: Blob): Promise<string> {
    // In demo mode, return a sample transcript
    await new Promise(r => setTimeout(r, 800));
    return 'Hamari gali mein teen hafton se street light kharab hai. University Town ke qareeb hai aur raat ko bohat andhera hota hai.';
  }

  async analyzeComplaint(_transcript: string): Promise<ComplaintAnalysis> {
    await new Promise(r => setTimeout(r, 600));
    return getDemoAnalysis();
  }

  async generateComplaint(_analysis: ComplaintAnalysis, _additionalInfo?: Record<string, string>): Promise<GeneratedComplaint> {
    await new Promise(r => setTimeout(r, 500));
    return getDemoGenerated();
  }
}

class QwenAIProvider implements AIProvider {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(apiKey: string, apiUrl: string, model: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.model = model;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const base64Audio = await this.blobToBase64(audioBlob);
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'input_audio', input_audio: { data: base64Audio, format: 'webm' } },
              { type: 'text', text: 'Transcribe this audio. Return only the transcription text.' },
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error('TRANSCRIPTION_FAILED');
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async analyzeComplaint(transcript: string): Promise<ComplaintAnalysis> {
    const systemPrompt = `You are Awaaz, a civic complaint assistant. Analyze the citizen's complaint and return structured JSON with these fields:
- language: "ur" or "en"
- transcript: the original transcript
- category: one of [water, electricity, road, pothole, streetlight, sanitation, sewerage, traffic-infrastructure, public-space, other]
- department: suggested department name
- departmentConfidence: 0-1
- departmentReason: why this department
- location: extracted location (empty string if not mentioned)
- duration: how long the issue has persisted (empty if not mentioned)
- severity: low/medium/high/critical
- publicSafetyImpact: boolean
- summary: brief summary
- missingInformation: array of missing critical info like ["location", "duration"]

Return ONLY valid JSON. Never fabricate facts not present in the complaint.`;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: transcript },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error('ANALYSIS_FAILED');
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  }

  async generateComplaint(analysis: ComplaintAnalysis, additionalInfo?: Record<string, string>): Promise<GeneratedComplaint> {
    const systemPrompt = `You are Awaaz, a civic complaint assistant. Generate two versions of a complaint based on the structured analysis:
1. A formal complaint (subject + body) - respectful, factual, no fabricated details
2. A WhatsApp-ready message - concise, natural, copy-ready

Return JSON with: { "subject": string, "formalBody": string, "whatsappMessage": string }
Never invent facts, addresses, phone numbers, or deadlines not provided.`;

    const userContent = JSON.stringify({ analysis, additionalInfo });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error('GENERATION_FAILED');
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

let providerInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (providerInstance) return providerInstance;

  const apiKey = import.meta.env.VITE_QWEN_API_KEY;
  const apiUrl = import.meta.env.VITE_QWEN_API_URL;
  const model = import.meta.env.VITE_QWEN_MODEL || 'qwen-omni-turbo';

  if (apiKey && apiUrl) {
    providerInstance = new QwenAIProvider(apiKey, apiUrl, model);
  } else {
    providerInstance = new DemoAIProvider();
  }

  return providerInstance;
}

export function isDemoMode(): boolean {
  return !import.meta.env.VITE_QWEN_API_KEY;
}
