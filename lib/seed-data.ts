import { Category, Prompt, PromptReview } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-marketing",
    slug: "marketing-content",
    name: "التسويق وصناعة المحتوى",
    nameEn: "Marketing & Content Creation",
    description: "أقوى برومبتات كتابة الإعلانات التسويقية، خطط المحتوى لمنصات التواصل، واستراتيجيات زيادة المبيعات.",
    icon: "Megaphone",
    color: "from-amber-500 to-orange-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-coding",
    slug: "coding-development",
    name: "البرمجة وتطوير البرمجيات",
    nameEn: "Coding & Software Development",
    description: "برومبتات متقدمة لهندسة الأكواد، اكتشاف الثغرات وتصحيح الأخطاء، معمارية الأنظمة، وشرح الخوارزميات.",
    icon: "Code",
    color: "from-blue-500 to-cyan-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-image-gen",
    slug: "image-prompts-midjourney",
    name: "توليد الصور والتصميم (Midjourney / FLUX)",
    nameEn: "AI Image Generation & Midjourney",
    description: "أوامر دقيقة لتوليد صور سينمائية فائقة الدقة، تصاميم هوية بصرية، لوجوهات، وشخصيات ثلاثية الأبعاد.",
    icon: "Image",
    color: "from-purple-500 to-pink-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-business",
    slug: "business-productivity",
    name: "ريادة الأعمال والإنتاجية",
    nameEn: "Business & Productivity",
    description: "صياغة خطط الأعمال، دراسات الجدوى، أتمتة المهام اليومية، وتحليل المنافسين باحترافية.",
    icon: "Briefcase",
    color: "from-emerald-500 to-teal-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-seo",
    slug: "seo-growth",
    name: "السيو والنمو العضوي (SEO & GEO)",
    nameEn: "SEO & Search Engine Growth",
    description: "برومبتات استخراج الكلمات المفتاحية، بناء مقالات متوافقة مع محركات البحث ومحركات الذكاء الاصطناعي (GEO).",
    icon: "TrendingUp",
    color: "from-indigo-500 to-violet-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-academic",
    slug: "academic-research",
    name: "البحث الأكاديمي والتعليم",
    nameEn: "Academic Research & Learning",
    description: "تلخيص الأوراق العلمية، صياغة الفرضيات، تحليل المراجع، وشرح المفاهيم المعقدة بأسلوب مبسط.",
    icon: "GraduationCap",
    color: "from-rose-500 to-red-600",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "cat-prompt-eng",
    slug: "prompt-engineering-agents",
    name: "هندسة البرومبت وبناء الوكلاء",
    nameEn: "Prompt Engineering & Agents",
    description: "قوالب لبناء وكلاء ذكاء اصطناعي مخصصين، برومبتات ميتا لتوليد وتحسين البرومبتات، ومنهجيات التفكير المتسلسل.",
    icon: "Cpu",
    color: "from-cyan-500 to-blue-700",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

export const INITIAL_PROMPTS: Prompt[] = [
  {
    id: "p-copywriting-hero",
    categoryId: "cat-marketing",
    categorySlug: "marketing-content",
    title: "خبير كتابة النصوص الإعلانية بصيغة PAS (مشكلة - تفاقم - حل)",
    titleEn: "PAS High-Converting Copywriting Specialist",
    slug: "pas-high-converting-copywriting",
    description: "برومبت متكامل لتحويل أي منتج أو خدمة إلى نص إعلاني ساحر يعالج الألم الحقيقي للعميل ويحفزه على الشراء الفوري.",
    promptText: `تصرف كخبير كتابة إعلانية (Senior Direct-Response Copywriter) مع خبرة 15 عاماً في صياغة حملات إعلانية عالية التحويل.

مهمتك هي كتابة إعلان مقنع جداً لـ [اسم المنتج/الخدمة] الموجه إلى [الجمهور المستهدف].

اتبع بدقة إطار العمل PAS (Problem, Agitation, Solution):
1. المشكلة (Problem): افتتح بخطاف (Hook) غير متوقع يسلط الضوء على المعاناة اليومية أو التحدي الأكبر لـ [الجمهور المستهدف].
2. التفاقم (Agitation): عمّق المشاعر المرتبطة بالمشكلة وتكلفة تجاهلها دون حل سريع.
3. الحل (Solution): قدّم [اسم المنتج/الخدمة] كالحل الحصري والذكي، مع ذكر 3 مزايا فريدة مبنية على الفوائد وليس فقط المواصفات.
4. الدعوة لاتخاذ إجراء (Call to Action): صغ دعوة لاتخاذ إجراء حاسمة وعاجلة تناسب منصة [المنصة الإعلانية].

النبرة المطلوبة: [نبرة الصوت - مثلاً: احترافية، حماسية، ودودة].
اللغة: عربية فصحى معاصرة وسلسة.`,
    models: ["ChatGPT (GPT-4o)", "Claude 3.7", "Gemini 2.0", "DeepSeek R1"],
    targetLanguage: "ar",
    framework: "PAS Framework (Problem - Agitate - Solve)",
    tags: ["كتابة إعلانية", "تسويق", "إعلانات", "زيادة المبيعات", "Copywriting"],
    variables: [
      { key: "اسم المنتج/الخدمة", label: "اسم المنتج أو الخدمة", placeholder: "مثال: تطبيق لإدارة المهام اليومية بالذكاء الاصطناعي", defaultValue: "تطبيق تنظيم الوقت والمشاريع" },
      { key: "الجمهور المستهدف", label: "الجمهور المستهدف", placeholder: "مثال: أصحاب الأعمال الحرة ورواد الأعمال المستقلين", defaultValue: "أصحاب الأعمال الحرة" },
      { key: "المنصة الإعلانية", label: "المنصة الإعلانية", placeholder: "مثال: إنستغرام، لينكد إن، تويتر", defaultValue: "إنستغرام ولينكد إن" },
      { key: "نبرة الصوت - مثلاً: احترافية، حماسية، ودودة", label: "نبرة الصوت", placeholder: "مثال: احترافية وحماسية", defaultValue: "حماسية وملهمة" }
    ],
    sampleOutput: "«هل تشعر أن الـ 24 ساعة لا تكفيك لإنجاز نصف مهامك؟ المشكلة ليست في عدد الساعات، بل في الفوضى الرقمية التي تلتهم طاقتك...»",
    tips: [
      "حدد جمهورك المستهدف بأكبر قدر من الدقة لتحصل على خطاف إعلاني ملفت.",
      "اطلب من الذكاء الاصطناعي تقديم 3 تنويعات مختلفة على العنوان الرئيسي (Headline variations)."
    ],
    difficulty: "مبتدئ",
    featured: true,
    views: 1420,
    copies: 685,
    likes: 194,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "p-code-refactor-security",
    categoryId: "cat-coding",
    categorySlug: "coding-development",
    title: "مدقق الأمان وتحسين الأداء لمعمارية الكود البرمجي (Senior Code Reviewer)",
    titleEn: "Senior Security & Performance Code Reviewer",
    slug: "senior-security-performance-code-reviewer",
    description: "برومبت تدقيق برمجي شامل لفحص الثغرات الأمنية، مشاكل الذاكرة، تعقيد الوقت (Time Complexity)، وإعادة هيكلة الكود وفق مبادئ Clean Code.",
    promptText: `You are a Principal Software Architect and Cybersecurity Specialist.

Review the following [لغة البرمجة] code for:
1. Security vulnerabilities (OWASP Top 10, SQL Injection, XSS, insecure deserialization, race conditions).
2. Performance bottlenecks and algorithmic efficiency (Big O analysis).
3. Clean Code principles, readability, and modern idiomatic patterns.
4. Edge cases, error handling, and memory leakage risks.

Target Framework/Environment: [بيئة العمل أو الإطار].

Provide your response in structured markdown:
- 🚨 Critical Vulnerabilities (if any, with exact line/block and exploit scenario)
- ⚡ Performance & Resource Optimizations
- 🛠️ Refactored, Production-Ready Code with clear comments
- 🧪 Unit Test Recommendations (including boundary & malicious edge cases)

Here is the code to review:
\`\`\`
[الكود المراد تدقيقه]
\`\`\``,
    models: ["Claude 3.7", "ChatGPT (GPT-4o)", "DeepSeek R1", "Cursor / Copilot"],
    targetLanguage: "both",
    framework: "Principal Architect Code Review Protocol",
    tags: ["برمجة", "أمان برمجيات", "Clean Code", "Refactoring", "Python", "TypeScript"],
    variables: [
      { key: "لغة البرمجة", label: "لغة البرمجة", placeholder: "مثال: TypeScript / Python / Go", defaultValue: "TypeScript (Next.js)" },
      { key: "بيئة العمل أو الإطار", label: "بيئة العمل / الإطار", placeholder: "مثال: Next.js 15 App Router / Node.js Express / FastAPI", defaultValue: "Next.js 15 Server Actions" },
      { key: "الكود المراد تدقيقه", label: "الكود المراد تدقيقه", placeholder: "الصق الكود البرمجي هنا...", defaultValue: "// Paste your function or component code here" }
    ],
    sampleOutput: "Analysis of SQL injection vector in auth handler, followed by secure parameterized query and typed TypeScript interface.",
    tips: [
      "يوصى بتقديم الكود كاملاً مع دوال التحقق من المدخلات لتقييم شامل.",
      "اطلب من النموذج كتابة اختبارات Jest أو Vitest تلقائياً للكود المحسّن."
    ],
    difficulty: "متقدم",
    featured: true,
    views: 2150,
    copies: 940,
    likes: 310,
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z"
  },
  {
    id: "p-midjourney-cinematic-portrait",
    categoryId: "cat-image-gen",
    categorySlug: "image-prompts-midjourney",
    title: "مولد بورتريهات سينمائية واقعية فائقة الدقة (Midjourney v6 & FLUX.1)",
    titleEn: "Cinematic Photorealistic Portrait Prompt Generator",
    slug: "cinematic-photorealistic-portrait-midjourney-flux",
    description: "صيغة متقدمة لتوليد صور وبورتريهات سينمائية واقعية تحاكي كاميرات 35mm وتوزيع الإضاءة الهوليوودي الحائز على جوائز.",
    promptText: `Cinematic hyper-realistic portrait of [وصف الشخصية/الموضوع], [تفاصيل البيئة والمكان المحيط], captured on 35mm Arri Alexa LF camera, 85mm prime lens, f/1.4 aperture, dramatic volumetric cinematic lighting with subtle rim light, intricate skin texture, authentic natural reflections in the eyes, color graded in [لوحة الألوان والأسلوب السينمائي], photorealistic, 8k resolution, award-winning cinematography --ar 16:9 --style raw --v 6.1`,
    models: ["Midjourney v6.1", "FLUX.1 Schnell/Dev", "Stable Diffusion 3", "DALL-E 3"],
    targetLanguage: "en",
    framework: "Director of Photography Lighting & Optics Formula",
    tags: ["توليد صور", "Midjourney", "FLUX", "بورتريه", "تصميم", "سينمائي"],
    variables: [
      { key: "وصف الشخصية/الموضوع", label: "وصف الشخصية أو الموضوع", placeholder: "e.g. an elderly Arabian artisan craftsman with weathered hands", defaultValue: "a visionary futurist architect examining a holographic blueprint" },
      { key: "تفاصيل البيئة والمكان المحيط", label: "البيئة والمكان", placeholder: "e.g. inside a dimly lit ancient stone workshop with dust motes", defaultValue: "inside a minimalist glass studio overlooking a twilight neon metropolis" },
      { key: "لوحة الألوان والأسلوب السينمائي", label: "لوحة الألوان والأسلوب", placeholder: "e.g. Blade Runner 2049 teal and amber tones", defaultValue: "warm golden hour tones with deep subtle shadows" }
    ],
    sampleOutput: "Cinematic hyper-realistic portrait of a visionary futurist architect examining a holographic blueprint, inside a minimalist glass studio overlooking a twilight neon metropolis, captured on 35mm Arri Alexa LF camera...",
    tips: [
      "في Midjourney، استخدم المعامل \`--style raw\` لتقليل المظهر الكرتوني وجعل البشرة واقعية بنسبة 100%.",
      "يمكنك تغيير النسبة العرضية عبر تغيير \`--ar 16:9\` إلى \`--ar 9:16\` للستوريات أو \`--ar 4:5\` لمنشورات إنستغرام."
    ],
    difficulty: "متوسط",
    featured: true,
    views: 3410,
    copies: 1820,
    likes: 540,
    createdAt: "2026-01-04T00:00:00.000Z",
    updatedAt: "2026-01-04T00:00:00.000Z"
  },
  {
    id: "p-geo-seo-article-writer",
    categoryId: "cat-seo",
    categorySlug: "seo-growth",
    title: "كاتب المقالات المتوافقة مع محركات الذكاء الاصطناعي والسيو (GEO & Semantic SEO)",
    titleEn: "Generative Engine Optimization (GEO) & Semantic SEO Article Master",
    slug: "geo-semantic-seo-article-master",
    description: "بناء مقالات تتصدر نتائج البحث وتظهر في إجابات الذكاء الاصطناعي (ChatGPT Search, Perplexity, Google AI Overviews) باستخدام بنية المعرفة الدلالية.",
    promptText: `تصرف كخبير في تحسين الظهور في محركات الذكاء الاصطناعي (GEO - Generative Engine Optimization) وخبير سيو دلالي (Semantic SEO).

المهمة: كتابة دليل شامل ومتعمق حول [موضوع المقال] مستهدفاً الكلمة المفتاحية الرئيسية: "[الكلمة المفتاحية الرئيسية]".

المتطلبات الهيكلية لضمان اقتباس المقال في محركات الذكاء الاصطناعي:
1. ملخص تنفيذي مباشر (Direct Answer Box): فقرة مركزة من 40-50 كلمة تجيب عن السؤال الأساسي مباشرة.
2. جدول مقارنة أو بيانات سريعة (Data Table): لتسهيل استخراج البيانات عبر روبوتات الـ LLM.
3. عناوين H2 و H3 متسلسلة منطقياً وفق نية البحث (Search Intent).
4. قسم أسئلة شائعة (FAQ) مع إجابات دقيقة ومقتضبة مهيأة لمخطط Schema.org.
5. تضمين مصطلحات دلالية ومترادفات LSI ذات صلة بـ [المجال العام].

اللغة: عربية فصيحة، واضحة، وغنية بالمعلومات الحصرية دون حشو إنشائي.`,
    models: ["Gemini 2.0", "ChatGPT (GPT-4o)", "Claude 3.7", "DeepSeek R1"],
    targetLanguage: "ar",
    framework: "Information Gain & GEO Citation Structure",
    tags: ["سيو", "GEO", "تحسين محركات البحث", "كتابة مقالات", "Google AI"],
    variables: [
      { key: "موضوع المقال", label: "موضوع المقال", placeholder: "مثال: كيفية بناء متجر إلكتروني متكامل في 2026", defaultValue: "أفضل استراتيجيات التسويق بالذكاء الاصطناعي للمشاريع الصغيرة" },
      { key: "الكلمة المفتاحية الرئيسية", label: "الكلمة المفتاحية الرئيسية", placeholder: "مثال: أدوات الذكاء الاصطناعي للتسويق", defaultValue: "التسويق بالذكاء الاصطناعي" },
      { key: "المجال العام", label: "المجال / القطاع", placeholder: "مثال: التجارة الإلكترونية والتقنية", defaultValue: "التجارة الرقمية وريادة الأعمال" }
    ],
    sampleOutput: "مقال متكامل يشمل Direct Answer Paragraph، جدول مقارنة لأهم 5 أدوات، عناوين فرعية مستهدفة لنية الباحث، وقسم FAQ منظم.",
    tips: [
      "محركات الذكاء الاصطناعي تعشق الجداول والبيانات الرقمية الواضحة لأنها تسهل عملية الاستخراج والاقتباس.",
      "تجنب الكلمات الرنانة مثل 'في عصرنا الحالي' وابدأ بالإجابة العملية مباشرة."
    ],
    difficulty: "متوسط",
    featured: true,
    views: 1890,
    copies: 760,
    likes: 245,
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z"
  },
  {
    id: "p-startup-pitch-validator",
    categoryId: "cat-business",
    categorySlug: "business-productivity",
    title: "محلل الأفكار الريادية ونموذج العمل (Venture Capital Idea Stress-Tester)",
    titleEn: "VC Pitch & Business Model Stress-Tester",
    slug: "vc-pitch-business-model-stress-tester",
    description: "محاكاة لاجتماع استثماري حقيقي يقوم بتشريح فكرة مشروعك الناشئ، وتحديد الثغرات التنافسية، وحساب قابلية التوسع (Scalability).",
    promptText: `You are a tough, data-driven Venture Capital Partner and Lean Startup Advisor with investments in 50+ unicorns.

I will pitch you my startup idea:
"[فكرة المشروع الناشئ]"
Target Market & Geography: [السوق المستهدف والدولة]
Current Business Model & Monetization: [نموذج الإيرادات]

Perform a ruthless stress-test of this concept:
1. 💡 Value Proposition Clarity: Rate from 1 to 10 with direct critique.
2. 🎯 Customer Acquisition Cost vs LTV Trap: What is the biggest CAC risk?
3. 🛡️ Moat & Defensibility: Why won't Google, an incumbent, or a copycat kill this in 6 months?
4. 💣 The 3 Fatal Assumptions: Identify the 3 most dangerous assumptions that could sink this venture.
5. 🚀 7-Day MVP Validation Plan: Provide a concrete, low-cost experiment to test demand before writing code.

Deliver your analysis in clear, brutally honest, actionable Arabic or English.`,
    models: ["Claude 3.7", "ChatGPT (GPT-4o)", "DeepSeek R1", "Gemini 2.0"],
    targetLanguage: "both",
    framework: "VC Stress-Test & Lean Validation Framework",
    tags: ["ريادة أعمال", "شركات ناشئة", "نموذج عمل", "استثمار", "Business Model"],
    variables: [
      { key: "فكرة المشروع الناشئ", label: "فكرة المشروع الناشئ", placeholder: "مثال: منصة تربط العيادات الطبية بالمترجمين الفوريين المعتمدين بالذكاء الاصطناعي", defaultValue: "منصة B2B لإدارة سلاسل الإمداد للمطاعم السحابية" },
      { key: "السوق المستهدف والدولة", label: "السوق المستهدف والمنطقة", placeholder: "مثال: السوق السعودي والخليجي", defaultValue: "السعودية والإمارات" },
      { key: "نموذج الإيرادات", label: "نموذج الإيرادات (Monetization)", placeholder: "مثال: اشتراك شهري SaaS + عمولة على المعاملات", defaultValue: "اشتراك شهري SaaS متدرج" }
    ],
    sampleOutput: "تحليل معمق يكشف نقاط الضعف في تكلفة الاستحواذ، واقتراح تجربة اختبارية بصفحة هبوط (Landing Page) لاختبار الطلب المسبق.",
    tips: [
      "كن صادقاً ومفصلاً في نقاط ضعفك الحالية لتحصل على أنجع استراتيجيات الحماية.",
      "اطلب منه صياغة أسئلة المقابلات الاستكشافية مع العملاء الأوائل (Customer Discovery)."
    ],
    difficulty: "متقدم",
    featured: true,
    views: 1640,
    copies: 810,
    likes: 280,
    createdAt: "2026-01-06T00:00:00.000Z",
    updatedAt: "2026-01-06T00:00:00.000Z"
  },
  {
    id: "p-system-prompt-meta-builder",
    categoryId: "cat-prompt-eng",
    categorySlug: "prompt-engineering-agents",
    title: "صانع برومبتات النظام والوكلاء الذكية (Master System Prompt Architect)",
    titleEn: "Master System Prompt & AI Agent Architect",
    slug: "master-system-prompt-ai-agent-architect",
    description: "برومبت ميتا لبناء وتوليد تعليمات نظام (System Instructions) احترافية تمنع الهلوسة وتضبط سلوك روبوتات الدردشة والوكلاء المستقلين.",
    promptText: `Act as a Senior Prompt Engineer specialized in LLM Agent Architecture and System Prompt Design.

Create a robust, production-grade System Prompt for an AI Agent with the following specifications:
- Agent Role & Persona: [دور الوكيل وشخصيته]
- Core Objective & Tasks: [المهمة الأساسية للوكيل]
- Input Constraints: [المدخلات المسموحة والمحظورة]
- Output Formatting Rules: [شكل المخرجات المطلوب - JSON / Markdown / Steps]
- Safety & Anti-Jailbreak Directives: [القيود وموانع الخروج عن السياق]

Structure the resulting System Prompt into:
1. IDENTITY & PERSONA DEFINITION
2. OPERATING PRINCIPLES & HEURISTICS
3. STEP-BY-STEP REASONING PROTOCOL (Chain of Thought guidelines)
4. OUTPUT STRUCTURE & EXAMPLES (Few-shot formatting)
5. HARD BOUNDARIES & FALLBACK RESPONSES`,
    models: ["Claude 3.7", "Gemini 2.0", "ChatGPT (GPT-4o)", "DeepSeek R1"],
    targetLanguage: "both",
    framework: "Enterprise AI Agent System Prompt Standard",
    tags: ["هندسة البرومبت", "وكلاء الذكاء الاصطناعي", "System Prompt", "AI Agents", "LLM"],
    variables: [
      { key: "دور الوكيل وشخصيته", label: "دور الوكيل وشخصيته", placeholder: "مثال: مستشار دعم فني ودود وخبير لمنصة تجارة إلكترونية", defaultValue: "مساعد قانوني رقمي يقدم تلخيصاً أولياً للعقود التجارية" },
      { key: "المهمة الأساسية للوكيل", label: "المهمة الأساسية للوكيل", placeholder: "مثال: قراءة العقود واستخراج الالتزامات والبنود الجزائية", defaultValue: "قراءة نصوص العقود واستخراج الالتزامات والبنود الجزائية وتواريخ التجديد" },
      { key: "المدخلات المسموحة والمحظورة", label: "المدخلات المسموحة والقيود", placeholder: "مثال: نصوص العقود فقط، لا يقدم استشارات طبية أو سياسية", defaultValue: "نصوص العقود التجارية فقط، ويجب أن يوضح أنه لا يقدم استشارة قانونية نهائية" },
      { key: "شكل المخرجات المطلوب - JSON / Markdown / Steps", label: "صيغة المخرجات المطلوبة", placeholder: "مثال: جدول Markdown ملخص متبوعاً بقائمة تنبيهات", defaultValue: "جدول Markdown مع قائمة بالبنود عالية الخطورة" },
      { key: "القيود وموانع الخروج عن السياق", label: "حدود الأمان وموانع الهلوسة", placeholder: "مثال: عدم تأكيد أي بند غير مذكور صراحة", defaultValue: "الالتزام الحرفي بالنص المعطى وعدم افتراض أي شروط خارجية" }
    ],
    sampleOutput: "نص System Prompt متكامل مقسم بوضوح إلى أقسام مع أمثلة Few-Shot وقواعد إخلاء مسؤولية قانونية.",
    tips: [
      "استخدم هذا البرومبت لتجهيز Custom GPTs أو بناء وكلاء في LangChain / CrewAI.",
      "تحديد شكل المخرجات (Output Schema) يقلل الأخطاء العشوائية بنسبة تفوق 80%."
    ],
    difficulty: "متقدم",
    featured: true,
    views: 2900,
    copies: 1450,
    likes: 470,
    ratingAverage: 4.9,
    ratingCount: 38,
    createdAt: "2026-01-07T00:00:00.000Z",
    updatedAt: "2026-01-07T00:00:00.000Z"
  }
];

export const INITIAL_REVIEWS: PromptReview[] = [
  {
    id: "rev-1",
    promptId: "p-copywriting-hero",
    promptTitle: "خبير كتابة النصوص الإعلانية بصيغة PAS",
    userName: "أحمد الشمري",
    rating: 5,
    comment: "برومبت استثنائي جداً! استخدمته لحملة سناب شات وإنستغرام وحققنا أعلى معدل نقر للظهور (CTR) منذ 6 أشهر.",
    createdAt: "2026-02-15T14:30:00.000Z"
  },
  {
    id: "rev-2",
    promptId: "p-copywriting-hero",
    promptTitle: "خبير كتابة النصوص الإعلانية بصيغة PAS",
    userName: "سارة المهدي",
    rating: 5,
    comment: "تنسيق الـ PAS مع محرر المتغيرات وفر عليّ ساعات من التفكير والتعديل. شكراً لكم!",
    createdAt: "2026-02-20T09:15:00.000Z"
  },
  {
    id: "rev-3",
    promptId: "p-code-refactor-security",
    promptTitle: "مدقق الأمان وتحسين الأداء لمعمارية الكود البرمجي",
    userName: "م. طارق العلي",
    rating: 5,
    comment: "اكتشف ثغرة SQL Injection مخفية وسباق بيانات (Race Condition) في الـ Backend قبل مرحلة الـ Production!",
    createdAt: "2026-02-18T18:45:00.000Z"
  },
  {
    id: "rev-4",
    promptId: "p-image-photoreal-cinema",
    promptTitle: "المخرج البصري للصور السينمائية فائقة الواقعية 8K",
    userName: "عبدالله مصطفى",
    rating: 5,
    comment: "النتائج مع Midjourney v6.1 مذهلة للغاية، الإضاءة الحجمية وتوزيع الظلال كان احترافياً بدرجة سينمائية.",
    createdAt: "2026-02-22T21:00:00.000Z"
  },
  {
    id: "rev-5",
    promptId: "p-agent-autonomous-builder",
    promptTitle: "مهندس المعمارية لوكلاء الذكاء الاصطناعي المستقلين (AI Agents)",
    userName: "ريم القحطاني",
    rating: 5,
    comment: "أفضل قالب لبناء وكلاء ذكاء اصطناعي بنظام ReAct وتحديد الصلاحيات والـ Safety Rails.",
    createdAt: "2026-02-25T11:20:00.000Z"
  }
];


