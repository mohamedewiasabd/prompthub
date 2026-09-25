import { NextResponse } from 'next/server';
import { getAllCategories, getAllPrompts, getAllShortcuts } from '@/lib/db';
import { AI_MODELS, MODEL_COMPARISONS } from '@/lib/seed-ai-models';
import { TECHNIQUES, SKILL_DOMAINS } from '@/lib/seed-techniques';

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://live-stream-sport.com';
  const categories = getAllCategories();
  const prompts = getAllPrompts();
  const shortcuts = getAllShortcuts();

  let text = `# PromptHub | مكتبة البرومبتات الذكية
> The premier open, 100% free repository of advanced AI prompts, engineered templates, and LLM instructions in Arabic and English.

## Website Overview
- **Name**: مكتبة البرومبتات الذكية (PromptHub)
- **Primary Language**: Arabic (العربية) with English support
- **Pricing**: 100% Free, no login required for public browsing & usage
- **Base URL**: ${baseUrl}
- **Categories Count**: ${categories.length}
- **Total Prompts**: ${prompts.length}
- **Shortcuts / Slash Commands**: ${shortcuts.length}
`;

  for (const cat of categories) {
    text += `### ${cat.name} (${cat.nameEn})
- **URL**: ${baseUrl}/category/${cat.slug}
- **Description**: ${cat.description}
- **Prompts in this category**: ${cat.promptCount || 0}
- **AI Agent Endpoint**: ${baseUrl}/api/ai-read/category/${cat.slug}

`;
  }

  text += `## Featured High-Impact Prompts
`;

  for (const p of prompts.slice(0, 15)) {
    text += `- [${p.title}](${baseUrl}/p/${p.id}): ${p.description.slice(0, 120)}... (Models: ${p.models.join(", ")})
`;
  }

  text += `
## Direct Data Feeds for LLMs & AI Agents
- **Full AI-Readable Dump**: ${baseUrl}/llms-full.txt
- **JSON API Feed**: ${baseUrl}/api/prompts
- **Shortcuts API Feed**: ${baseUrl}/api/shortcuts
- **Sitemap XML**: ${baseUrl}/sitemap.xml

## AI Models Directory
- **Overview**: ${baseUrl}/models
- **Model Count**: ${AI_MODELS.length}
`;
  for (const model of AI_MODELS) {
    text += `- **${model.name}** (${model.company}): ${baseUrl}/models/${model.slug} — ${model.description}
`;
  }

  text += `
## Model Comparisons
`;
  for (const comp of MODEL_COMPARISONS) {
    text += `- **${comp.title}**: ${baseUrl}/compare/${comp.slug} — ${comp.verdict}
`;
  }

  text += `
## Prompt Engineering Techniques
`;
  for (const tech of TECHNIQUES) {
    text += `- **${tech.name}** (${tech.nameEn}): ${baseUrl}/learn/${tech.slug} — ${tech.description}
`;
  }

  text += `
## Skill Domains
`;
  for (const domain of SKILL_DOMAINS) {
    text += `- **${domain.name}** (${domain.nameEn}): ${baseUrl}/skills — ${domain.description}
`;
  }

  if (shortcuts.length > 0) {
    text += `
## Shortcuts / Slash Commands
`;
    shortcuts.slice(0, 25).forEach((s) => {
      text += `- **${s.slash}** — ${s.description}
`;
    });
    text += `
- **Full Shortcuts URL**: ${baseUrl}/shortcuts
`;
  }

  return new NextResponse(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}
