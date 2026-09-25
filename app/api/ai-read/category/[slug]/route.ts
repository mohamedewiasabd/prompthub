import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, getAllPrompts } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return new NextResponse("# Category Not Found", { status: 404 });
  }

  const prompts = getAllPrompts({ categorySlug: slug });

  let md = `# Category: ${category.name} (${category.nameEn})\n`;
  md += `**Description:** ${category.description}\n`;
  md += `**Total Prompts:** ${prompts.length}\n\n`;

  for (const p of prompts) {
    md += `## ${p.title}\n`;
    md += `*Difficulty:* ${p.difficulty} | *Models:* ${p.models.join(", ")}\n\n`;
    md += `${p.description}\n\n`;
    md += `### Prompt:\n\`\`\`\n${p.promptText}\n\`\`\`\n\n`;
    if (p.tips && p.tips.length > 0) {
      md += `### Tips:\n`;
      p.tips.forEach(t => md += `- ${t}\n`);
      md += `\n`;
    }
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
