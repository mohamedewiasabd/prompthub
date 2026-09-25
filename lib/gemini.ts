import { GoogleGenAI, Type } from "@google/genai";

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 5);
}

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!isGeminiConfigured()) {
    return null;
  }
  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
        timeout: 15000
      }
    });
  }
  return geminiClientInstance;
}

// Curated backup categories in case of network or rate-limit issues
const FALLBACK_CATEGORIES_POOL = [
  {
    name: "برمجة وبناء التطبيقات",
    nameEn: "Coding & Web Architecture",
    slug: "coding-and-web-architecture",
    description: "أوامر برمجية فائقة الدقة لهندسة الأنظمة وتطوير الواجهات وتصحيح الأخطاء عبر نماذج الذكاء الاصطناعي.",
    icon: "Code"
  },
  {
    name: "صناعة الفيديو والمؤثرات",
    nameEn: "AI Video & Motion",
    slug: "ai-video-and-motion",
    description: "برومبتات إخراج المشاهد السينمائية وتوليد الفيديوهات الاحترافية لنماذج Sora و Runway و Kling و Pika.",
    icon: "Video"
  },
  {
    name: "استراتيجيات التسويق والنمو",
    nameEn: "Growth & Marketing Strategy",
    slug: "growth-and-marketing-strategy",
    description: "أوامر تسويقية استراتيجية لكتابة الإعلانات وحملات البريد الإلكتروني وخطة استهداف الجماهير.",
    icon: "TrendingUp"
  },
  {
    name: "تحليل البيانات والأعمال",
    nameEn: "Business & Data Intelligence",
    slug: "business-and-data-intelligence",
    description: "أوامر متخصصة في تحليل القوائم المالية، دراسات الجدوى، استخراج الأنماط، وبناء تقارير الأداء.",
    icon: "Database"
  },
  {
    name: "توليد الصور والفنون الرقمية",
    nameEn: "Digital Art & Prompt Crafting",
    slug: "digital-art-and-prompt-crafting",
    description: "برومبتات فنية دقيقة للتحكم بالإضاءة والعدسات والتفاصيل الواقعية في Midjourney و FLUX.",
    icon: "Image"
  },
  {
    name: "إدارة المشاريع والإنتاجية",
    nameEn: "Productivity & Operations",
    slug: "productivity-and-operations",
    description: "أوامر لأتمتة المهام اليومية، تنظيم جداول العمل، وكتابة ملخصات الاجتماعات التنفيذية.",
    icon: "Briefcase"
  },
  {
    name: "التعليم والبحث الأكاديمي",
    nameEn: "Academic Research & Learning",
    slug: "academic-research-and-learning",
    description: "أوامر متقدمة لتبسيط المفاهيم المعقدة، مراجعة الأوراق العلمية، وتصميم المناهج التفاعلية.",
    icon: "GraduationCap"
  },
  {
    name: "الأمن السيبراني والبنية التحتية",
    nameEn: "Cybersecurity & DevOps",
    slug: "cybersecurity-and-devops",
    description: "أوامر متخصصة لتدقيق الأمان البرمجي، ضبط إعدادات الخوادم، وإدارة الحاويات السحابية.",
    icon: "Shield"
  }
];

// Generate new categories with AI
export async function generateAICategories(count: number = 3, existingCategories: Array<string | { name: string; nameEn?: string; slug?: string }> = []): Promise<Array<{
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  icon: string;
}>> {
  const ai = getGeminiClient();
  const existingNamesList: string[] = existingCategories
    .map(c => (typeof c === 'string' ? c : c.name))
    .filter((n): n is string => Boolean(n));
  const existingSlugsList: string[] = existingCategories
    .map(c => (typeof c === 'string' ? '' : c.slug))
    .filter((s): s is string => Boolean(s));

  if (ai) {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const modelName of candidateModels) {
      try {
        const prompt = `أنت خبير ومصمم تصنيفات منصات الذكاء الاصطناعي وهندسة البرومبتات.
المطلوب: توليد عدد (${count}) أقسام جديدة ومبتكرة وذات طلب عالٍ جداً في سوق العمل وصناع المحتوى والبرمجة والتصميم بالذكاء الاصطناعي لعام 2026.

الأقسام الموجودة حالياً (تجنب تكرارها أو تكرار أي معنى مشابه لها نهائياً):
${existingNamesList.map(n => `- ${n}`).join('\n')}

المعايير الإلزامية:
1. الأسماء عربية جذابة ومعاصرة + اسم إنجليزي دقيق + slug فريد بالإنجليزية بدون مسافات أو رموز خاصة.
2. الوصف يجب أن يكون شاملاً، تسويقياً ومحسناً لمحركات البحث (SEO).
3. اختيار أيقونة صالحة من مكتبة Lucide Icons (مثل: Brain, Sparkles, Code, Cpu, Film, Terminal, PenTool, Database, MessageSquare, Shield, Rocket, Globe).

أعد النتيجة بصيغة JSON مطابقة للمخطط.`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "اسم القسم بالعربية، احترافي وجذاب"
                  },
                  nameEn: {
                    type: Type.STRING,
                    description: "English category name"
                  },
                  slug: {
                    type: Type.STRING,
                    description: "URL-friendly slug, e.g. ai-video-generation"
                  },
                  description: {
                    type: Type.STRING,
                    description: "وصف تسويقي وسيو دقيق للقسم بالعربية (25-45 كلمة)"
                  },
                  icon: {
                    type: Type.STRING,
                    description: "Valid Lucide icon name (e.g. Video, Sparkles, Database, etc.)"
                  }
                },
                required: ["name", "nameEn", "slug", "description", "icon"]
              }
            }
          }
        });

        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 12000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err: any) {
        // If candidate model is busy/unavailable, seamlessly try the next model
        continue;
      }
    }
  }

  // Fallback to intelligent generation from pool if AI call fails or is not configured
  const existingSet = new Set([...existingNamesList.map(c => c.toLowerCase().trim()), ...existingSlugsList.map(s => s.toLowerCase().trim())]);
  const available = FALLBACK_CATEGORIES_POOL.filter(c => !existingSet.has(c.name.toLowerCase().trim()) && !existingSet.has(c.slug.toLowerCase().trim()));
  const selected = available.length >= count ? available.slice(0, count) : [
    ...available,
    ...FALLBACK_CATEGORIES_POOL.slice(0, count - available.length).map((c, i) => ({
      ...c,
      name: `${c.name} ${i + 2}`,
      slug: `${c.slug}-${Date.now().toString().slice(-4)}-${i + 2}`
    }))
  ].slice(0, count);

  return selected;
}

// Generate new AI shortcuts / slash commands with AI
const FALLBACK_SHORTCUTS_POOL = [
  { command: "brainstorm", name: "العصف الذهني (Brainstorm)", nameEn: "Brainstorm Ideas", description: "يولّد عدداً كبيراً من الأفكار والحلول الإبداعية حول أي موضوع دون نقد مبكر، ثم يصنفها حسب الجدوى.", category: "الإبداع والفكر", icon: "Lightbulb", example: "استخدمه لإطلاق أفكار لاسم منتج أو حملة تسويقية." },
  { command: "summarize", name: "التلخيص الدقيق (Summarize)", nameEn: "Precise Summary", description: "يلخّص أي نص أو مقال أو محادثة طويلة في نقاط مركزة مع الحفاظ على النتائج والأفكار الأهم.", category: "التبسيط والشرح", icon: "FileText", example: "الصق نصاً طويلاً ثم اكتب /summarize في 5 نقاط." },
  { command: "translate", name: "الترجمة الاحترافية (Translate)", nameEn: "Professional Translate", description: "يترجم نصوصاً بين اللغات مع الحفاظ على النبرة والسياق والمصطلحات، واختيارياً يقدم نسختين رسمية وعامية.", category: "التحرير والصياغة", icon: "Languages", example: "/translate هذا النص إلى الإنجليزية بنبرة مهنية" },
  { command: "plan", name: "مخطط التنفيذ (Plan)", nameEn: "Action Plan", description: "يحوّل أي هدف إلى خطة خطوات جاهزة بالتنفيذ مع مواعيد تقديرية ومسؤوليات وفحوصات جودة.", category: "التنظيم والإنتاجية", icon: "ClipboardList", example: "/plan أطلق متجراً إلكترونياً خلال شهر" },
  { command: "elaborate", name: "التوسيع والتفصيل (Elaborate)", nameEn: "Elaborate Further", description: "يوسّع أي نقطة أو فكرة مختصرة إلى شرح مفصل بالأمثلة والأدلة والسيناريوهات.", category: "التحليل والفهم", icon: "Maximize2", example: "/elaborate النقطة الثالثة في الرد السابق" },
  { command: "critique", name: "النقد البنّاء (Critique)", nameEn: "Constructive Critique", description: "يقيّم أي عمل (نص، كود، خطة) من زوايا متعددة ويقدم توجيهات قابلة للتطبيق خطوة بخطوة.", category: "التدقيق والمراجعة", icon: "MessageSquareWarning", example: "/critique هذه الصفحة التسويقية بمعايير التحويل" },
  { command: "analogy", name: "القياس والتشبيه (Analogy)", nameEn: "Explain With Analogy", description: "يشرح أي مفهوم معقد عبر تشبيهات من الحياة اليومية تجعله سهلاً وممتعاً للفهم.", category: "التبسيط والشرح", icon: "Puzzle", example: "/analogy اشرح لي blockchain بمثال بسيط" },
  { command: "outline", name: "الهيكل والمسودة (Outline)", nameEn: "Structured Outline", description: "يبني هيكلاً متسلسلاً لأي مقال أو عرض تقديمي أو دورة تعليمية بعناوين وعناصر فرعية واضحة.", category: "التحرير والصياغة", icon: "ListTree", example: "/outline مقالاً عن الذكاء الاصطناعي التوليدي" },
  { command: "rewrite", name: "إعادة الصياغة (Rewrite)", nameEn: "Rewrite Better", description: "يعيد صياغة أي نص بمستوى إتقان أعلى: أوضح، أقوى، وأكثر إقناعاً مع تثبيت المعنى.", category: "التحرير والصياغة", icon: "RefreshCw", example: "/rewrite هذه الفقرة بأسلوب أكثر تأثيراً" },
  { command: "code-review", name: "مراجعة الكود (Code Review)", nameEn: "Code Review", description: "يفحص مقتطفات الكود عن الأخطاء والثغرات الأمنية ومشاكل الأداء ويقترح تحسينات جاهزة.", category: "البرمجة", icon: "Code2", example: "/code-review الإدخال التالي ولاحظ المخاطر الأمنية" }
];

export async function generateAIShortcuts(
  count: number = 5,
  existingShortcuts: Array<string | { command: string; name?: string }> = [],
  options?: {
    adminIdea?: string;
    category?: string;
    keyword?: string;
  }
): Promise<Array<{
  command: string;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  example?: string;
  icon: string;
}>> {
  const ai = getGeminiClient();
  const existingCommandsList: string[] = existingShortcuts
    .map(s => (typeof s === 'string' ? s.replace(/^\//, '') : (s.command || '').replace(/^\//, '')))
    .filter((v): v is string => Boolean(v))
    .map(c => c.toLowerCase().trim());
  const existingSet = new Set(existingCommandsList);

  const adminIdea = (options?.adminIdea || '').trim();
  const targetCategory = (options?.category || '').trim();
  const keyword = (options?.keyword || '').trim();
  const hasGuidance = Boolean(adminIdea || targetCategory || keyword);

  if (ai) {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const modelName of candidateModels) {
      try {
        const prompt = `أنت خبير في أوامر واختصارات الذكاء الاصطناعي (AI shortcuts / slash commands) داخل أنظمة مثل ChatGPT و Claude و Gemini.
المطلوب: توليد عدد (${count}) أوامر اختصار جديدة (slash commands) مفيدة ومبتكرة، كل أمر يبدأ بشرطة مائلة.

الأوامر الموجودة حالياً (تجنب تكرارها أو تكرار معناها نهائياً):
${existingCommandsList.map(c => `- /${c}`).join('\n')}

${hasGuidance
  ? `توجيهات المستخدم (الالتزام بها إلزامي — لا تولد أوامر عشوائية خارج نطاقها):
${adminIdea ? `1. أفكار محددة يريد أوامر/اختصارات تخدمها مباشرة: ${adminIdea}` : ''}
${targetCategory ? `2. اسم القسم/التصنيف المستهدف: ${targetCategory} — ركّز كل الأوامر في هذا المجال.` : ''}
${keyword ? `3. كلمة دليلية / مجال محوري يجب أن تدور الأوامر حوله: ${keyword}` : ''}
- اشتق كل أمر من هذه التوجيهات وتأكد أنه يحل مشكلة عملية واضحة ضمنها.
- إن وُجد قسم مستهدف (البند 2)، اجعل حقل category لكل الأوامر باسم ذلك القسم حرفياً.`
  : 'لا توجيهات محددة — ابتكر أوامر متنوعة ومفيدة تغطي مجالات مختلفة مثل الإنتاجية، التحرير، الإبداع، التحليل، البرمجة.'}

المعايير الإلزامية لكل أمر:
1. command: الاسم بالإنجليزية بدون شرطة مائلة وبأحرف صغيرة وبلا مسافات (مثل together, satellite).
2. name: عنوان عربي جذاب يشرح وظيفة الأمر.
3. nameEn: اسم إنجليزي مختصر.
4. description: وصف عربي دقيق لما يفعله الأمر ومتى يُستخدم (20-45 كلمة).
5. category: تصنيف عربي مثل (الإنتاجية، التحليل، التحرير، الإبداع، التدقيق، البرمجة).
6. example: مثال استخدام عربي قصير يبدأ بالأمر، مثل "استخدمه ل...".
7. icon: اسم أيقونة صالحة من مكتبة Lucide Icons (مثل Command, Sparkles, Wand2, Layers, Filter, PenTool).

أعد النتيجة بصيغة JSON مطابقة للمخطط.`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  command: { type: Type.STRING, description: "command name in english lowercase, no slashes/spaces" },
                  name: { type: Type.STRING, description: "عنوان عربي جذاب للأمر" },
                  nameEn: { type: Type.STRING, description: "English short name" },
                  description: { type: Type.STRING, description: "وصف عربي دقيق لما يفعله الأمر" },
                  category: { type: Type.STRING, description: "تصنيف عربي (الإنتاجية، التحليل...) " },
                  example: { type: Type.STRING, description: "مثال استخدام عربي قصير" },
                  icon: { type: Type.STRING, description: "Valid Lucide icon name" }
                },
                required: ["command", "name", "nameEn", "description", "category", "icon"]
              }
            }
          }
        });

        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 12000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => {
              const clean = String(item.command || '').replace(/^\//, '').toLowerCase().replace(/\s+/g, '');
              return { ...item, command: clean };
            }).filter((item: any) => item.command && !existingSet.has(item.command.toLowerCase()));
          }
        }
      } catch (err: any) {
        continue;
      }
    }
  }

  const available = FALLBACK_SHORTCUTS_POOL.filter(s => !existingSet.has(s.command.toLowerCase()));
  const selected = available.slice(0, count);
  return selected.length >= count ? selected : [
    ...selected,
    ...FALLBACK_SHORTCUTS_POOL.slice(0, count - selected.length).map((s, i) => ({
      ...s,
      command: `${s.command}-${Date.now().toString().slice(-4)}-${i + 1}`
    }))
  ].slice(0, count);
}

// Generate high quality structured prompts with AI with full awareness of existing prompts in the category
export async function generateAIPrompts(params: {
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  count: number;
  adminIdea?: string;
  customNotes?: string;
  existingPrompts?: Array<{
    id?: string;
    title: string;
    titleEn?: string;
    slug?: string;
    description?: string;
    framework?: string;
  }>;
}): Promise<Array<{
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  promptText: string;
  models: string[];
  targetLanguage: "ar" | "en" | "both";
  framework: string;
  tags: string[];
  variables: Array<{
    key: string;
    label: string;
    placeholder: string;
    defaultValue: string;
  }>;
  sampleOutput: string;
  tips: string[];
  difficulty: "مبتدئ" | "متوسط" | "متقدم";
}>> {
  const { categoryName, categorySlug, count, adminIdea, customNotes, existingPrompts = [] } = params;
  const ai = getGeminiClient();

  const existingTitles = existingPrompts.map(p => p.title);
  const existingSlugs = new Set(existingPrompts.map(p => p.slug?.toLowerCase() || ''));

  if (ai) {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const modelName of candidateModels) {
      try {
        const existingPromptsContext = existingPrompts.length > 0
          ? `\n⚠️ البرومبتات الموجودة مسبقاً في هذا القسم (ممنوع منعاً باتاً تكرار أي منها، أو توليد نفس الفكرة أو استخدام عناوين متشابهة. ابتكر أفكاراً جديدة ومختلفة كلياً تغطي زوايا واحتياجات أخرى غير مغطاة):\n` +
            existingPrompts.map((p, idx) => `${idx + 1}. عنوان: "${p.title}" ${p.titleEn ? `(${p.titleEn})` : ''} - نبذة: ${p.description?.slice(0, 70) || ''}`).join('\n') + '\n'
          : '';

        const prompt = `أنت كبير مهندسي البرومبتات (Principal Prompt Engineer) ومبتكر أوامر الذكاء الاصطناعي الاحترافية.
المهمة: قم بتوليد (${count}) برومبتات استثنائية وعالية القيمة ومبتكرة لقسم: "${categoryName}" (${params.categoryDescription}).

${existingPromptsContext}
${adminIdea ? `فكرة المشرف/المدير الخاصة بالبرومبت المراد توليده:\n"${adminIdea}"\n` : ''}
${customNotes ? `ملاحظات إضافية وتوجيهات من المشرف:\n"${customNotes}"\n` : ''}

معايير الجودة ومنع التكرار:
1. عدم تكرار أي برومبت موجود مسبقاً في هذا القسم مطلقاً، وتقديم أفكار ومجالات فرعية مبتكرة.
2. يجب أن يحتوي نص البرومبت (promptText) على متغيرات واضحة محاطة بأقواس مربعة مثل [الموضوع]، [الجمهور]، [الهدف] لتسهيل استبدالها على المستخدم.
3. استخدام إطارات عمل هندسة أوامر معتمدة ومتنوعة (مثل: Role-Task-Format, Chain of Thought, Few-Shot, PAS, APE, CREATE, CARE Frameworks).
4. تحديد أفضل نماذج الذكاء الاصطناعي المتوافقة (ChatGPT (GPT-4o), Claude 3.7 Sonnet, Gemini 2.0 / 2.5 Flash, DeepSeek R1, Midjourney v6.1, FLUX.1).
5. كتابة slug بالإنجليزية فريد تماماً وغير مكرر، مثل: ${categorySlug}-advanced-strategy-builder.
6. وصف غني وواضح للبرومبت مع نصائح عملية وأمثلة على المخرجات المتوقعة وكلمات دلالية للـ SEO.

أعد المخرجات كـ JSON منظم وصالح يطابق المخطط بدقة.`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "عنوان البرومبت بالعربية، جذاب ومحدد وغير مكرر"
                  },
                  titleEn: {
                    type: Type.STRING,
                    description: "English prompt title, unique"
                  },
                  slug: {
                    type: Type.STRING,
                    description: "Unique url slug in english, e.g. viral-tiktok-script-architect"
                  },
                  description: {
                    type: Type.STRING,
                    description: "شرح تفصيلي وشامل للبرومبت ولماذا هو فعال ومتى يُستخدم"
                  },
                  promptText: {
                    type: Type.STRING,
                    description: "نص البرومبت الكامل مع المتغيرات بين أقواس مربعة [متغير]"
                  },
                  models: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "قائمة نماذج الذكاء الاصطناعي الأنسب مثل ChatGPT (GPT-4o), Claude 3.7, DeepSeek R1"
                  },
                  targetLanguage: {
                    type: Type.STRING,
                    description: "ar or en or both"
                  },
                  framework: {
                    type: Type.STRING,
                    description: "إطار عمل هندسة البرومبت المستخدم"
                  },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-6 كلمات مفتاحية وسيو"
                  },
                  variables: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING, description: "نفس النص المكتوب داخل [ ] في البرومبت" },
                        label: { type: Type.STRING, description: "اسم الحقل بالعربية" },
                        placeholder: { type: Type.STRING, description: "مثال توضيحي للمدخل" },
                        defaultValue: { type: Type.STRING, description: "قيمة افتراضية جاهزة" }
                      },
                      required: ["key", "label", "placeholder", "defaultValue"]
                    }
                  },
                  sampleOutput: {
                    type: Type.STRING,
                    description: "مثال واقعي ومختصر على إجابة الذكاء الاصطناعي المتوقعة"
                  },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 نصائح للحصول على أفضل نتيجة ممكنة من هذا الأمر"
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: "مبتدئ or متوسط or متقدم"
                  }
                },
                required: [
                  "title",
                  "titleEn",
                  "slug",
                  "description",
                  "promptText",
                  "models",
                  "targetLanguage",
                  "framework",
                  "tags",
                  "variables",
                  "sampleOutput",
                  "tips",
                  "difficulty"
                ]
              }
            }
          }
        });

        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 14000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Double verify slugs don't collide with existing slugs
            const validated = parsed.map((item, idx) => {
              let slug = item.slug || `${categorySlug}-prompt-${Date.now().toString().slice(-4)}-${idx+1}`;
              if (existingSlugs.has(slug.toLowerCase())) {
                slug = `${slug}-${Date.now().toString().slice(-4)}`;
              }
              return {
                ...item,
                slug
              };
            });
            return validated;
          }
        }
      } catch (err: any) {
        // If candidate model is busy/unavailable, seamlessly try the next model
        continue;
      }
    }
  }

  // Diverse topics pool for fallbacks to avoid repeating topics in category
  const TOPIC_ANGLES = [
    { titleAr: "الاستراتيجي الشامل ومحلل الأداء المتقدم", framework: "CARE Framework", descSuffix: "لإعداد خطة متكاملة وتحليل المؤشرات الرئيسية بدقة متناهية." },
    { titleAr: "خبير الأتمتة وصياغة سير العمل الذكي", framework: "RTF (Role-Task-Format)", descSuffix: "لأتمتة العمليات الروتينية ورفع الإنتاجية بنسبة تفوق 300%." },
    { titleAr: "مدقق الجودة ومعايير الاحتراف العالمية", framework: "Chain of Thought (CoT)", descSuffix: "لمراجعة وتدقيق المخرجات والتأكد من مطابقتها لأعلى المعايير." },
    { titleAr: "مبتكر الحلول الإبداعية والخطط التنافسية", framework: "CREATE Framework", descSuffix: "لاقتناص الفرص التنافسية وبناء حلول غير تقليدية تحقق نتائج فورية." },
    { titleAr: "مستشار حل المشكلات المعقدة والتشخيص السريع", framework: "Few-Shot Engineering", descSuffix: "لتشخيص العقبات وتقديم خطوات علاجية دقيقة ومثبتة." },
    { titleAr: "مصمم السيناريوهات وصياغة دراسات الحالة الواقعية", framework: "APE Framework", descSuffix: "لبناء دراسات حالة وسيناريوهات محاكاة لاختبار الأفكار قبل تطبيقها." }
  ];

  // High quality fallback prompt generation if API times out
  const fallbackList = [];
  const existingCount = existingPrompts.length;

  for (let i = 1; i <= count; i++) {
    const angle = TOPIC_ANGLES[(existingCount + i - 1) % TOPIC_ANGLES.length];
    const uniqueSuffix = `${Date.now().toString().slice(-4)}-${i}`;
    const titleIdea = adminIdea 
      ? `${adminIdea} (${i > 1 ? i : 'النسخة الاحترافية'})` 
      : `${categoryName}: ${angle.titleAr}`;

    const slug = `${categorySlug}-${angle.framework.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uniqueSuffix}`;

    fallbackList.push({
      title: titleIdea,
      titleEn: `Master ${categoryName} ${angle.framework.split(' ')[0]} Specialist`,
      slug: slug,
      description: `برومبت استثنائي وموجه لقسم ${categoryName} ${angle.descSuffix}`,
      promptText: `تصرف كخبير واستشاري رائد في [مجال_التطبيق_الدقيق].

السياق والهدف المطلوب منك:
أنت مكلف بـ [الهدف_المحدد_والنتيجة_المرجوة] الموجه لصالح [الجمهور_أو_الفريق_المستفيد].

خطوات التنفيذ والإرشادات الإلزامية:
1. ابدأ بتقديم ملخص تنفيذي يحدد خطة العمل بدقة.
2. طبق إطار العمل [${angle.framework}] للوصول إلى أدق النتائج وأكثرها فاعلية.
3. قدم جداول ونقاط واضحة مع أمثلة عملية قابلة للتطبيق دون تعقيد.
4. اذكر أهم 3 أخطاء شائعة يجب تجنبها في هذا السياق مع البديل الأمثل.

نبرة الحديث المطلوبة: [نبرة_الحديث_المفضلة].
اللغة: عربية فصحى احترافية ومباشرة.`,
      models: ["ChatGPT (GPT-4o)", "Claude 3.7 Sonnet", "Gemini 2.0 Flash", "DeepSeek R1"],
      targetLanguage: "ar" as const,
      framework: angle.framework,
      tags: [categoryName, "هندسة برومبت", "أوامر ذكاء اصطناعي", "2026", "إنتاجية"],
      variables: [
        {
          key: "مجال_التطبيق_الدقيق",
          label: "المجال أو التخصص الدقيق",
          placeholder: `مثال: ${categoryName}`,
          defaultValue: categoryName
        },
        {
          key: "الهدف_المحدد_والنتيجة_المرجوة",
          label: "الهدف والنتيجة المرجوة",
          placeholder: "مثال: مضاعفة المبيعات أو كتابة كود خالي من الثغرات",
          defaultValue: "تنفيذ الخطة الاستراتيجية وتحقيق أعلى عائد وأداء"
        },
        {
          key: "الجمهور_أو_الفريق_المستفيد",
          label: "الجمهور أو الفريق المستهدف",
          placeholder: "مثال: العملاء المحتملين أو فريق التطوير",
          defaultValue: "الفريق والعملاء المستهدفين"
        },
        {
          key: "نبرة_الحديث_المفضلة",
          label: "نبرة الصوت والأسلوب",
          placeholder: "مثال: احترافية، تحليلية، حماسية",
          defaultValue: "احترافية، دقيقة وملهمة"
        }
      ],
      sampleOutput: `«بناءً على المعطيات المدخلة، إليك المخطط التنفيذي الشامل لتحقيق الهدف بأعلى كفاءة وفق منهجية ${angle.framework}...»`,
      tips: [
        "حدد المتغيرات بأدق التفاصيل لتخصيص النتيجة لعملك بالتحديد.",
        "يمكنك طلب تحويل المخرجات إلى جدول عمل تنفيذي بمهام أسبوعية محددة."
      ],
      difficulty: (i % 3 === 1 ? "متوسط" : i % 3 === 2 ? "متقدم" : "مبتدئ") as "مبتدئ" | "متوسط" | "متقدم"
    });
  }

  return fallbackList;
}

// Translate a prompt (description + promptText + variables) into English
export async function translatePromptToEnglish(params: {
  title: string;
  titleEn?: string;
  description: string;
  promptText: string;
  variables?: Array<{ key: string; label: string; placeholder: string; defaultValue?: string }>;
}): Promise<{ descriptionEn: string; promptTextEn: string }> {
  const ai = getGeminiClient();

  if (ai) {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const modelName of candidateModels) {
      try {
        const prompt = `You are a professional bilingual prompt translation specialist.

Translate the following Arabic AI prompt into natural, professional English while:
1. Preserving placeholders wrapped in square brackets [like-this] EXACTLY as-is (do not translate the content inside them, only keep the same bracket syntax).
2. Keeping the structure, tone, and meaning faithful to the original.
3. Writing fluent, high-quality English suitable for an international audience.

Original prompt title: ${params.title}${params.titleEn ? ` (English title: ${params.titleEn})` : ''}

Original Arabic description:
${params.description}

Original Arabic prompt text:
${params.promptText}

${params.variables && params.variables.length > 0 ? `Variables reference (keys must be kept exactly as they appear inside the brackets in the translated prompt text):
${params.variables.map(v => `- key: [${v.key}] (label: ${v.label}, placeholder: ${v.placeholder})`).join('\n')}` : ''}

Return the result as JSON matching the schema exactly.`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                descriptionEn: {
                  type: Type.STRING,
                  description: "English translation of the original Arabic description"
                },
                promptTextEn: {
                  type: Type.STRING,
                  description: "English translation of the prompt text, preserving [placeholders] exactly"
                }
              },
              required: ["descriptionEn", "promptTextEn"]
            }
          }
        });

        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 20000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed && parsed.descriptionEn && parsed.promptTextEn) {
            return {
              descriptionEn: String(parsed.descriptionEn).trim(),
              promptTextEn: String(parsed.promptTextEn).trim()
            };
          }
        }
      } catch (err: any) {
        continue;
      }
    }
  }

  // Fallback: mirror the Arabic text when AI is unavailable
  return {
    descriptionEn: params.description,
    promptTextEn: params.promptText
  };
}

export type GeneratedBlogPost = {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  category: string;
  categoryEn: string;
  author: string;
  date: string;
  readingTime: string;
  cover: string;
  color: string;
  tags: string[];
  sections: Array<{
    heading?: string;
    paragraphs: string[];
    list?: string[];
    prompt?: { title: string; english?: boolean; text: string };
    tips?: string[];
  }>;
};

const FALLBACK_BLOG_CATEGORIES = [
  { cat: 'أساسيات', catEn: 'Basics', color: 'from-blue-600 to-indigo-700', cover: '📘' },
  { cat: 'التسويق', catEn: 'Marketing', color: 'from-rose-500 to-orange-500', cover: '📈' },
  { cat: 'البرمجة', catEn: 'Coding', color: 'from-emerald-500 to-teal-600', cover: '💻' },
  { cat: 'الإنتاجية', catEn: 'Productivity', color: 'from-violet-600 to-purple-700', cover: '⚡' }
];

export async function generateAIArticles(
  count: number = 1,
  options?: {
    topic?: string;
    category?: string;
    keyword?: string;
    existingTitles?: Array<string>;
  }
): Promise<GeneratedBlogPost[]> {
  const ai = getGeminiClient();
  const topic = (options?.topic || '').trim();
  const category = (options?.category || '').trim();
  const keyword = (options?.keyword || '').trim();
  const existingTitles = (options?.existingTitles || []).map(t => t.toLowerCase());

  if (ai) {
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    for (const modelName of candidateModels) {
      try {
        const prompt = `أنت كاتب محتوى عربي خبير في الذكاء الاصطناعي وهندسة البرومبتات (Prompt Engineering) بأسلوب عملي مباشر.

المطلوب: توليد (${count}) مقالات عربية جديدة عن [الموضوع المقترح: ${topic || '(ابدأ بنفسك موضوعاً قيماً)'}]${category ? `، أن يكون كل مقال ضمن التصنيف: ${category}` : ''}${keyword ? `، وترتبط المقالات بمجال: ${keyword}` : ''}.

العناوين الموجودة حالياً (تجنب تكرارها أو تكرار معناها): ${existingTitles.length ? existingTitles.join('، ') : 'لا توجد'}.

لكل مقال:
1. slug: معرف إنجليزي صغير بحروف وشرطات (مثل ai-copywriting-hooks).
2. title: عنوان عربي جذاب مباشر (من 6-15 كلمة).
3. titleEn: عنوان إنجليزي مختصر.
4. excerpt: ملخص عربي (30-55 كلمة) يوضح ماذا سيستفيد القارئ.
5. category: تصنيف عربي قصير (أساسيات/تسويق/برمجة/إنتاجية/تعليم...).
6. categoryEn: التصنيف بالإنجليزية.
7. author: "فريق PromptHub".
8. date: تاريخ اليوم بصيغة YYYY-MM-DD.
9. readingTime: زمن القراءة مع كلمة "دقائق" مثل "6 دقائق".
10. cover: إيموجي واحد معبّر.
11. color: تدرج Tailwind يبدأ بـ from وينتهي بـ to (مثل from-blue-600 to-indigo-700).
12. tags: 3-5 وسوم عربية قصيرة.
13. sections: من 4 إلى 6 أقسام؛ كل قسم يحتوي:
    - heading (اختياري): عنوان عربي للقسم.
    - paragraphs: 1-3 فقرات عربية عملية (كل فقرة 40-100 كلمة) بأسلوب خطوات وأمثلة تطبيقية.
    - list (اختياري): قائمة نقطية.
    - prompt (اختياري): برومبت جاهز بتنسيق { title, english: false, text } يكون نصه بالعربية ويمثل مثالاً يطبقه القارئ فوراً.
    - tips (اختياري): نصائح سريعة.

اكتب بأسلوب عربي سلس وواضح وموثوق، مع تركيز على التطبيق العملي. أعد النتيجة بصيغة JSON (مصفوفة من المقالات).`;

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slug: { type: Type.STRING },
                  title: { type: Type.STRING },
                  titleEn: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  category: { type: Type.STRING },
                  categoryEn: { type: Type.STRING },
                  author: { type: Type.STRING },
                  date: { type: Type.STRING },
                  readingTime: { type: Type.STRING },
                  cover: { type: Type.STRING },
                  color: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  sections: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        heading: { type: Type.STRING },
                        paragraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                        list: { type: Type.ARRAY, items: { type: Type.STRING } },
                        tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                        prompt: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            english: { type: Type.BOOLEAN },
                            text: { type: Type.STRING }
                          },
                          required: ["title", "text"]
                        }
                      },
                      required: ["paragraphs"]
                    }
                  }
                },
                required: ["slug", "title", "titleEn", "excerpt", "category", "categoryEn", "date", "readingTime", "sections"]
              }
            }
          }
        });

        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 30000)
        );

        const response = await Promise.race([generatePromise, timeoutPromise]);
        if (response && response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            const today = new Date().toISOString().slice(0, 10);
            const cleaned = parsed.map((item: any) => ({
              ...item,
              slug: String(item.slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || `article-${Date.now()}`,
              title: String(item.title || ''),
              titleEn: String(item.titleEn || item.title || ''),
              excerpt: String(item.excerpt || ''),
              category: String(item.category || 'عام'),
              categoryEn: String(item.categoryEn || 'General'),
              author: 'فريق PromptHub',
              date: String(item.date || today),
              readingTime: String(item.readingTime || '5 دقائق'),
              cover: String(item.cover || '📄'),
              color: String(item.color || 'from-blue-600 to-indigo-700'),
              tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
              sections: Array.isArray(item.sections) ? item.sections : []
            })).filter((a: any) => a.title && !existingTitles.includes(a.title.toLowerCase()));

            if (cleaned.length > 0) return cleaned;
          }
        }
      } catch (err: any) {
        continue;
      }
    }
  }

  // Fallback: build simple articles from the requested topic/keyword
  const slot = FALLBACK_BLOG_CATEGORIES[Math.floor(Math.random() * FALLBACK_BLOG_CATEGORIES.length)];
  const label = topic || keyword || 'البرومبتات العملية';
  const slugBase = (label.split(/\s+/)[0] || 'ai').replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, '').toLowerCase();
  const articles: GeneratedBlogPost[] = [];
  for (let i = 0; i < count && i < 6; i++) {
    articles.push({
      slug: `${slugBase}-guide-${i + 1}`,
      title: `دليل عملي: ${label} — خطوة بخطوة (${i + 1})`,
      titleEn: `Practical Guide: ${label} Step by Step`,
      excerpt: `دليل عملي شامل يشرح كيفية استخدام ${label} في مهامك اليومية مع أمثلة وبرومبتات جاهزة للتطبيق الفوري مع نماذج الذكاء الاصطناعي.`,
      category: slot.cat,
      categoryEn: slot.catEn,
      author: 'فريق PromptHub',
      date: new Date().toISOString().slice(0, 10),
      readingTime: '5 دقائق',
      cover: slot.cover,
      color: slot.color,
      tags: [label.split(/\s+/)[0] || 'عملي', slot.cat, 'برومبتات', 'ذكاء اصطناعي'],
      sections: [
        {
          heading: 'لماذا تهمك هذه المهارة؟',
          paragraphs: [`توفّر أدوات الذكاء الاصطناعي الحديثة إمكانيات هائلة، لكن جودة النتائج تعتمد على كيفية صياغتك للأوامر. ${label} واحدة من المجالات التي يلاحظ فيها المستخدمون فرقاً كبيراً عند تطبيق المبادئ الصحيحة.`],
          tips: ['ابدأ بجملة واضحة من جملة إلى جملتين', 'حدد الناتج المتوقع بدقة']
        },
        {
          heading: 'برومبت جاهز للتطبيق',
          paragraphs: ['انسخ البرومبت التالي وجرّبه مع ChatGPT أو Claude أو Gemini، ثم عدّل المتغيرات لتلائم حالتك.'],
          prompt: { title: 'برومبت عملي', english: false, text: `اعمل كخبير متمكن في ${label}. اشرح لي الخطوات الأساسية مطلوبة خطوة بخطوة مع أمثلة واقعية، وقدم لي نموذجاً جاهزاً للتطبيق الفوري.` }
        },
        {
          heading: 'نصائح للنتائج الأفضل',
          paragraphs: ['أعد المحاولة بزوايا مختلفة، واجمع بين أكثر من برومبت لتحصل على إجابات شاملة، واحفظ أفضل النتائج في مكتبتك.'],
          list: ['جرّب لغة أدق وأكثر تحديداً', 'أضف سياقاً عن جمهورك', 'اطلب صيغاً متعددة للمحتوى نفسه']
        }
      ]
    });
  }
  return articles;
}
