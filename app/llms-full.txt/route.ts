import { NextResponse } from 'next/server';
import { getAllCategories, getAllPrompts, getAllShortcuts } from '@/lib/db';
import { AI_MODELS, MODEL_COMPARISONS } from '@/lib/seed-ai-models';
import { TECHNIQUES, SKILL_DOMAINS } from '@/lib/seed-techniques';

export async function GET() {
  const baseUrl = process.env.APP_URL || 'https://live-stream-sport.com';
  const categories = getAllCategories();
  const prompts = getAllPrompts();
  const shortcuts = getAllShortcuts();

  let text = `# PromptHub Full Knowledge Base | قاعدة بيانات البرومبتات الذكية الكاملة
# Language: Arabic & English
# Source: ${baseUrl}
# License: Open & 100% Free

`;

  for (const cat of categories) {
    const catPrompts = prompts.filter(p => p.categoryId === cat.id || p.categorySlug === cat.slug);
    text += `\n=======================================================\n`;
    text += `CATEGORY: ${cat.name} (${cat.nameEn})\n`;
    text += `SLUG: ${cat.slug}\n`;
    text += `URL: ${baseUrl}/category/${cat.slug}\n`;
    text += `DESCRIPTION: ${cat.description}\n`;
    text += `=======================================================\n\n`;

    for (const p of catPrompts) {
      text += `### Prompt: ${p.title} (${p.titleEn || ''})\n`;
      text += `- **URL**: ${baseUrl}/p/${p.id}\n`;
      text += `- **Difficulty**: ${p.difficulty}\n`;
      text += `- **Target Models**: ${p.models.join(", ")}\n`;
      text += `- **Framework**: ${p.framework || 'Standard'}\n`;
      text += `- **Tags**: ${p.tags.join(", ")}\n`;
      text += `- **Description**: ${p.description}\n\n`;
      text += `#### Prompt Template:\n\`\`\`\n${p.promptText}\n\`\`\`\n\n`;
      if (p.variables && p.variables.length > 0) {
        text += `#### Variables to Fill:\n`;
        p.variables.forEach(v => {
          text += `- **[${v.key}]**: ${v.label} (Default: "${v.defaultValue || v.placeholder}")\n`;
        });
        text += `\n`;
      }
      if (p.tips && p.tips.length > 0) {
        text += `#### Pro Tips:\n`;
        p.tips.forEach(t => text += `- ${t}\n`);
        text += `\n`;
      }
      text += `---\n\n`;
    }
  }

  if (shortcuts.length > 0) {
    text += `\n=======================================================\n`;
    text += `SECTION: Shortcuts / Slash Commands (أوامر الاختصار الذكية)\n`;
    text += `URL: ${baseUrl}/shortcuts\n`;
    text += `=======================================================\n\n`;

    for (const s of shortcuts) {
      text += `### Shortcut: ${s.slash} — ${s.name} (${s.nameEn})\n`;
      text += `- **Category**: ${s.category}\n`;
      text += `- **URL**: ${baseUrl}/shortcuts\n`;
      text += `- **Icon**: ${s.icon}\n`;
      text += `- **Description**: ${s.description}\n`;
      if (s.example) text += `- **Example**: ${s.example}\n`;
      text += `\n---\n\n`;
    }
  }

  text += `\n=======================================================\n`;
  text += `SECTION: AI Models Directory (دليل نماذج الذكاء الاصطناعي)\n`;
  text += `URL: ${baseUrl}/models\n`;
  text += `=======================================================\n\n`;

  for (const model of AI_MODELS) {
    text += `### Model: ${model.name} (${model.company})\n`;
    text += `- **URL**: ${baseUrl}/models/${model.slug}\n`;
    text += `- **Category**: ${model.category}\n`;
    text += `- **Pricing**: ${model.pricing}\n`;
    text += `- **Description**: ${model.description}\n`;
    text += `- **Strengths**: ${model.strengths.join("; ")}\n`;
    text += `- **Weaknesses**: ${model.weaknesses.join("; ")}\n`;
    text += `- **Best For**: ${model.bestFor.join("; ")}\n`;
    if (model.contextWindow) text += `- **Context Window**: ${model.contextWindow}\n`;
    text += `\n---\n\n`;
  }

  text += `\n=======================================================\n`;
  text += `SECTION: Model Comparisons (مقارنة النماذج)\n`;
  text += `URL: ${baseUrl}/compare\n`;
  text += `=======================================================\n\n`;

  for (const comp of MODEL_COMPARISONS) {
    text += `### Comparison: ${comp.title}\n`;
    text += `- **URL**: ${baseUrl}/compare/${comp.slug}\n`;
    text += `- **Verdict**: ${comp.verdict}\n`;
    text += `\n---\n\n`;
  }

  text += `\n=======================================================\n`;
  text += `SECTION: Prompt Engineering Techniques (تقنيات هندسة البرومبتات)\n`;
  text += `URL: ${baseUrl}/learn\n`;
  text += `=======================================================\n\n`;

  for (const tech of TECHNIQUES) {
    text += `### Technique: ${tech.name} (${tech.nameEn})\n`;
    text += `- **URL**: ${baseUrl}/learn/${tech.slug}\n`;
    text += `- **Difficulty**: ${tech.difficulty}\n`;
    text += `- **Description**: ${tech.description}\n`;
    text += `- **How It Works**: ${tech.howItWorks}\n`;
    text += `\n---\n\n`;
  }

  text += `\n=======================================================\n`;
  text += `SECTION: Skill Domains (مهارات الذكاء الاصطناعي حسب المجال)\n`;
  text += `URL: ${baseUrl}/skills\n`;
  text += `=======================================================\n\n`;

  for (const domain of SKILL_DOMAINS) {
    text += `### Domain: ${domain.name} (${domain.nameEn})\n`;
    text += `- **Description**: ${domain.description}\n`;
    for (const skill of domain.skills) {
      text += `- **Skill**: ${skill.name} (${skill.nameEn}) — ${skill.description}\n`;
    }
    text += `\n---\n\n`;
  }

  return new NextResponse(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}
