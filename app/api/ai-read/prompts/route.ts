import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts, getAllCategories } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'markdown'; // markdown or json
  const prompts = getAllPrompts();
  const categories = getAllCategories();

  if (format === 'json') {
    return NextResponse.json({
      metadata: {
        title: "PromptHub AI Semantic Dataset",
        count: prompts.length,
        updatedAt: new Date().toISOString()
      },
      categories,
      prompts
    });
  }

  // Markdown output
  let md = `# PromptHub AI Prompt Repository\n\n`;
  for (const p of prompts) {
    md += `## ${p.title}\n`;
    md += `**Category:** ${p.categorySlug} | **Models:** ${p.models.join(", ")} | **Framework:** ${p.framework || 'N/A'}\n\n`;
    md += `**Description:** ${p.description}\n\n`;
    md += `### Prompt Content:\n\`\`\`\n${p.promptText}\n\`\`\`\n\n`;
    md += `---\n\n`;
  }

  return new NextResponse(md, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}
