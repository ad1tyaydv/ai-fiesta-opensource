export interface ModelDef {
  id: string;
  label: string;
  model: string;
}

export const MODELS: ModelDef[] = [
  {
    id: "deepseek-r1",
    label: "DeepSeek R1 (free)",
    model: "deepseek/deepseek-r1:free",
  },
  {
    id: "llama-33-70b",
    label: "Llama 3.3 70B Instruct (free)",
    model: "meta-llama/llama-3.3-70b-instruct:free",
  },
  {
    id: "qwen3-coder",
    label: "Qwen3 Coder (free)",
    model: "qwen/qwen3-coder:free",
  },
  {
    id: "deepseek-chat",
    label: "DeepSeek Chat v3 (free)",
    model: "deepseek/deepseek-chat-v3-0324:free",
  },
  {
    id: "gemini-flash",
    label: "Gemini 1.5 Flash",
    model: "gemini-1.5-flash",
  },
];