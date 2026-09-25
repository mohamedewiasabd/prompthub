export interface Technique {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: string;
  description: string;
  fullDescription: string;
  whenToUse: string[];
  howItWorks: string;
  examples: TechniqueExample[];
  tips: string[];
  relatedSlugs: string[];
}

export interface TechniqueExample {
  title: string;
  before: string;
  after: string;
  explanation: string;
}

export interface SkillDomain {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  promptTemplate: string;
  example: string;
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'cot',
    slug: 'chain-of-thought',
    name: 'سلسلة التفكير (Chain of Thought)',
    nameEn: 'Chain of Thought (CoT)',
    icon: 'Brain',
    difficulty: 'مبتدئ',
    category: 'الأساسيات',
    description: 'تقنية تجعل النموذج يفكر خطوة بخطوة قبل تقديم الإجابة النهائية. تزيد الدقة بشكل كبير في المسائل المنطقية والرياضية.',
    fullDescription: 'سلسلة التفكير (Chain of Thought) هي من أقوى تقنيات البرمجة. بدلاً من طلب الإجابة مباشرة، تطلب من النموذج أن يشرح عملية تفكيره خطوة بخطوة. هذه التقنية تعتمد على مبدأ أن النماذج اللغوية أفضل في التفكير التدريجي بدلاً من القفز المباشر للنتيجة.',
    whenToUse: ['المسائل الرياضية والحسابية', 'المسائل المنطقية', 'تحليل المشاكل المعقدة', 'المهام التي تحتاج تبريراً', ' puzzles والألعاب المنطقية'],
    howItWorks: 'أضف عبارة مثل "Let us think step by step" أو "فكّر خطوة بخطوة" في نهاية البرومبت. النموذج سيقوم بتحليل كل خطوة بشكل منفصل قبل الوصول للنتيجة النهائية.',
    examples: [
      {
        title: 'مسألة حسابية بسيطة',
        before: 'كم عدد أقدام 7 دجاجات و 3 أرانب؟',
        after: 'كم عدد أقدام 7 دجاجات و 3 أرانب؟ فكّر خطوة بخطوة.',
        explanation: 'بدون CoT: قد يُخطئ في الجمع. مع CoT: الدجاج = 7 × 2 = 14 قدم، الأرانب = 3 × 4 = 12 قدم، المجموع = 26'
      }
    ],
    tips: [
      'استخدمها مع "think step by step" أو "let\'s think through this"',
      'ممتازة للتحليلات والأبحاث',
      'أضف "show your work" لرؤية خطوات التفكير بالتفصيل',
      'تعمل مع جميع النماذج لكن Claude و o3 الأفضل فيها'
    ],
    relatedSlugs: ['tree-of-thought', 'self-consistency']
  },
  {
    id: 'few-shot',
    slug: 'few-shot-learning',
    name: 'التعلم بالأمثلة القليلة (Few-Shot)',
    nameEn: 'Few-Shot Learning',
    icon: 'GraduationCap',
    difficulty: 'مبتدئ',
    category: 'الأساسيات',
    description: 'إعطاء النموذج 2-5 أمثلة قبل السؤال الفعلي لتعليم النمط المطلوب. من أكثر التقنيات فاعلية في التحكم بالنتيجة.',
    fullDescription: 'التعلم بالأمثلة القليلة (Few-Shot Learning) تقنية تعتمد على إعطاء النموذج أمثلة محدودة (عادة 2-5) تُظهر النمط والشكل المطلوب قبل طلب الإنجاز الفعلي. هذه التقنية تُعلّم النموذج "ماذا تريد بالضبط" بدلاً من الوصف النصي الطويل.',
    whenToUse: ['عندما تريد شكل إخراج محدد', 'التصنيف والتصنيف', 'التحويل بين الصيغ', 'الترجمة بأنماط محددة', 'الكتابة بلغة محددة'],
    howItWorks: 'اكتب 2-5 أمثلة كاملة تُظهر الإدخال والمخرج المطلوب، ثم أضف الإدخال الفعلي في النهاية. النموذج سيكتشف النمط ويطبقه.',
    examples: [
      {
        title: 'تصنيف المشاعر',
        before: 'صنّف المشاعر في هذه الجملة: "الportun جميل جداً اليوم"',
        after: 'صنّف المشاعر:\n\nالجملة: "الportun جميل جداً اليوم" → إيجابي\nالجملة: "هذا أسوأ يوم في حياتي" → سلبي\nالجملة: "الأمطار تهطل بغزارة" → محايد\n\nالجملة: "لم أ期待 هذا المستوى من الجودة" →',
        explanation: 'النموذج يتعلم النمط من 3 أمثلة ثم يصنّف الجملة الرابعة بشكل صحيح'
      }
    ],
    tips: [
      'ابدأ بـ 3 أمثلة — كافية لمعظم المهام',
      'تأكد أن الأمثلة متنوعة لكنها تتبع نفس النمط',
      'ضع الأمثلة الأصعب في النهاية',
      'استخدمها مع "Here are some examples:" ثم "Now do the same for:"'
    ],
    relatedSlugs: ['zero-shot', 'meta-prompting']
  },
  {
    id: 'zero-shot',
    slug: 'zero-shot-prompting',
    name: 'السؤال بدون أمثلة (Zero-Shot)',
    nameEn: 'Zero-Shot Prompting',
    icon: 'Zap',
    difficulty: 'مبتدئ',
    category: 'الأساسيات',
    description: 'السؤال مباشرة بدون أي أمثلة. الأسرع والأسهل لكنه أقل دقة في المهام المحددة الشكل.',
    fullDescription: 'السؤال بدون أمثلة (Zero-Shot) هو أكثر أنماط البرمجة شيوعاً — سؤال النموذج مباشرة بدون تقديم أي أمثلة أو سياق إضافي. هذه الطريقة سريعة ومريحة لكنها تعتمد على فهم النموذج للتعليمات بدون توضيح.',
    whenToUse: ['الأسئلة البسيطة والمباشرة', 'عندما تكون الثقة في فهم النموذج عالية', 'المحادثات العادية', 'الترجمة البسيطة', 'الأسئلة المعرفية العامة'],
    howItWorks: 'اكتب سؤالك أو تعليماتك مباشرة بدون أي أمثلة سابقة. اجعل التعليمات واضحة ومحددة قدر الإمكان.',
    examples: [
      {
        title: 'ترجمة بسيطة',
        before: 'ترجم هذا النص للإنجليزية: "الذكاء الاصطناعي يغير العالم"',
        after: 'Translate the following Arabic text to English, maintaining the formal tone:\n\n"الذكاء الاصطناعي يغير العالم"',
        explanation: 'إضافة تعليمات إضافية (naintenance formal tone) تحسن جودة الترجمة حتى بدون أمثلة'
      }
    ],
    tips: [
      'استخدم Zero-Shot للأسئلة البسيطة فقط',
      'أضف تعليماتضافية مثل " respond in a specific format" لتحسين النتيجة',
      'عندما تفشل، انتقل لـ Few-Shot',
      'ممتاز للأسئلة المعرفية العامة والترجمة البسيطة'
    ],
    relatedSlugs: ['few-shot', 'role-task-format']
  },
  {
    id: 'role-task-format',
    slug: 'role-task-format',
    name: 'الدور-المهمة-الشكل (RTF)',
    nameEn: 'Role-Task-Format (RTF)',
    icon: 'User',
    difficulty: 'مبتدئ',
    category: 'الأساسيات',
    description: 'إعطاء النموذج دوراً محدداً + مهمة واضحة + شكل الإخراج المطلوب. أكثر أنماط البرمجة استخداماً عملياً.',
    fullDescription: 'نمط الدور-المهمة-الشكل (Role-Task-Format) هو أكثر أنماط البرمجة استخداماً في العالم العملي. تعطي النموذج شخصية (دور)، ثم مهمة محددة، ثم شكل الإخراج الذي تريده. هذا النمط يحسن النتائج بشكل كبير لأن النموذج يفهم السياق والמטרة والشكل المطلوب.',
    whenToUse: ['كتابة المحتوى', 'التحليل والتقرير', 'الردود الرسمية', 'الترجمة الاحترافية', 'أي مهمة تحتاج شكل إخراج محدد'],
    howItWorks: 'اكتب: 1) أنت [دور]، 2) قم بـ [مهمة محددة]، 3) بالشكل/الصيغة [شكل الإخراج]',
    examples: [
      {
        title: 'كتابة تقرير',
        before: 'اكتب تقريراً عن الذكاء الاصطناعي',
        after: 'أنت خبير تكنولوجيا متخصص في الذكاء الاصطناعي بخبرة 10 سنوات.\n\nاكتب تقريراً تحليلياً عن تأثير الذكاء الاصطناعي على سوق العمل في 2025.\n\nالشكل المطلوب:\n- ملخص تنفيذي (3 جمل)\n- 3 تحديات رئيسية مع حلول\n- خلاصة وتوصيات\n- اكتب بالعربية الفصحى المبسطة',
        explanation: 'الدور (خبير تكنولوجيا) + المهمة (تقرير عن التأثير) + الشكل (ملخص + تحديات + خلاصة)'
      }
    ],
    tips: [
      'اكتب الدور بوضوح: "أنت محرر في جريدة عالمية" ليس كافياً، استبدل بـ "أنت محرر تقني في مجلة Wired بخبرة 15 سنة"',
      'حدد المهمة بعدد الجمل أو الكلمات',
      'حدد شكل الإخراج بالتفصيل (عناوين، نقاط، جداول...)',
      'هذه هي البذرة الأساسية — ابدأ بها دائماً ثم أضف'
    ],
    relatedSlugs: ['race', 'few-shot']
  },
  {
    id: 'race',
    slug: 'race-framework',
    name: 'إطار RACE',
    nameEn: 'RACE Framework',
    icon: 'Target',
    difficulty: 'متوسط',
    category: 'الإطارات المتقدمة',
    description: 'إطار شامل: Request (طلب) + Action (إجراء) + Context (سياق) + Expectation (نتيجة متوقعة). أكثر دقة من RTF.',
    fullDescription: 'إطار RACE هو تطوير متقدم لنمط RTF — يضيف Context (السياق والخلفية) و Expectation (النتيجة المتوقعة والمعايير). هذا الإطار يقلل سوء الفهم بشكل كبير لأنه يوفر معلومات كاملة للنموذج.',
    whenToUse: ['المهام المعقدة التي تحتاج سياقاً', 'المشاريع الاحترافية', 'عندما تكون النتائج غير متوقعة', 'العمل الجماعي مع النماذج', 'المهام التي تحتاج معايير تقييم'],
    howItWorks: 'R = Request (ما الذي تريده تحديداً؟) | A = Action (ما الذي يجب أن يفعله النموذج؟) | C = Context (ما السياق والخلفية؟) | E = Expectation (ما النتيجة المتوقعة والمعايير؟)',
    examples: [
      {
        title: 'تحليل بيانات',
        before: 'حلل بيانات مبيعاتي',
        after: 'R: أحتاج تقريراً تحليلياً لمبيعاتي الشهرية\nA: حلل البيانات واكتشف الأنماط والاتجاهات وقدم توصيات\nC: أنا صاحب متجر إلكتروني أونلاين، المبيعات الشهرية تتراوح بين 500-2000 طلب، المنتجات الرئيسية هي الملابس والإلكترونيات\nE: تقرير من 3 أقسام: (1) ملخص أرقام الشهر بجدول، (2) 3 أنماط رئيسية مكتشفة، (3) 5 توصيات عملية لزيادة المبيعات. الصيغة: نقاط واضحة مع أرقام محددة.',
        explanation: 'RACE يوفر كل المعلومات للنموذج: الطلب، الإجراء، السياق، والنتيجة المتوقعة مع المعايير'
      }
    ],
    tips: [
      'اكتب كل عنصر في سطر أو فقرة منفصلة',
      'في Context: كلما زاد التفاصيل زادت جودة النتيجة',
      'في Expectation: حدد عدد النقاط أو الكلمات أو الجداول',
      'استخدمها خاصة في المشاريع الاحترافية'
    ],
    relatedSlugs: ['role-task-format', 'meta-prompting']
  },
  {
    id: 'tree-of-thought',
    slug: 'tree-of-thought',
    name: 'شجرة التفكير (Tree of Thought)',
    nameEn: 'Tree of Thought',
    icon: 'GitBranch',
    difficulty: 'متقدم',
    category: 'الإطارات المتقدمة',
    description: '窍思路 متفرعة — تطلب من النموذج استكشاف عدة حلول بديلة ثم اختيار الأفضل. ممتاز للمسائل المعقدة.',
    fullDescription: 'شجرة التفكير (Tree of Thought) تقنية متقدمة تطلب من النموذج思索 بدلاً من التفكير الخطي. بدلاً من خط واحد من الأفكار، ينقسم التفكير لفروع متعددة ثم يُقيَّم كل فرع ويُختار الأفضل.',
    whenToUse: ['المسائل التي لها عدة حلول ممكنة', 'التحسين والتخطيط', 'التحليل المقارن', 'الجدل وتقديم الحجج', 'allasات الأفكار الإبداعية'],
    howItWorks: 'اطلب من النموذج: (1) توليد 3-5 أفكار أو حلول مختلفة، (2) تقييم كل فكرة من حيث القوة والضعف، (3) اختيار الأفضل مع التبرير.',
    examples: [
      {
        title: 'تحسين استراتيجية تسويق',
        before: 'اقترح استراتيجية تسويق لمتجري',
        after: 'لدي متجر إلكتروني للملابس. فكّر كشجرة تفكير:\n\n1. اقترح 3 استراتيجيات مختلفة (محتوى، إعلانات، شراكات)\n2. قيّم كل استراتيجية: القوة (2 نقاط)، الضعف (2 نقطة)، التكلفة، الوقت المطلوب\n3. اختر الأفضل ووضح لماذا',
        explanation: 'Tree of Thought يجبر النموذج على استكشاف عدة بدائل قبل الاختيار'
      }
    ],
    tips: [
      'حدد عدد الفروع (3-5 كافية)',
      'اطلب تقييم كل فرع بنفس المعايير',
      'ممتازة للمقارنات واتخاذ القرارات',
      'تعمل بشكل رائع مع Claude و GPT-4o'
    ],
    relatedSlugs: ['chain-of-thought', 'self-consistency']
  },
  {
    id: 'self-consistency',
    slug: 'self-consistency',
    name: 'الاتساق الذاتي (Self-Consistency)',
    nameEn: 'Self-Consistency',
    icon: 'CheckCircle',
    difficulty: 'متقدم',
    category: 'الإطارات المتقدمة',
    description: 'توليد عدة إجابات للسؤال نفسه ثم أخذ الأكثر تكراراً. تزيد الدقة بشكل كبير في المهام المنطقية.',
    fullDescription: 'الاتساق الذاتي (Self-Consistency) تقنية تعتمد على مبدأ أن الإجابة الصحيحة ستظهر أكثر من مرة عند توليد عدة استجابات. بدلاً من الاعتماد على إجابة واحدة، تولّد 3-5 إجابات وتختار الأكثر تكراراً.',
    whenToUse: ['المسائل الرياضية والعلمية', 'المسائل المنطقية', 'عندما تكون الإجابة غير واضحة', 'التحقق من صحة النتائج', 'أي مهمة تحتاج دقة عالية'],
    howItWorks: '1) اكتب البرومبت عادة واحدة على الأقل، 2) أعد البرومبت 3-5 مرات، 3) قارن النتائج واكثر إجابة تكراراً.',
    examples: [
      {
        title: 'مسألة رياضية',
        before: 'إذا كان لدينا 12 تفاحة وأخذنا 3، ثم أضفنا 5، كم تفاحة لدينا؟',
        after: 'أجب على هذا السؤال 3 مرات بشكل مستقل، ثم قارن الإجابات وأظهر الأكثر تكراراً:\n\nإذا كان لدينا 12 تفاحة وأخذنا 3، ثم أضفنا 5، كم تفاحة لدينا؟',
        explanation: 'النموذج يُ鞠 3 إجابات مستقلة ويتحقق من الاتساق — زيادة كبيرة في الدقة'
      }
    ],
    tips: [
      'استخدمها معemperature منخفضة (0.2-0.5) لنتائج أكثر اتساقاً',
      '3 مرات كافية في معظم الحالات',
      'ممتازة للتحقق من صحة أكواد Python القصيرة',
      'لا تستخدمها للمهام الإبداعية (التنويع مرغوب فيها)'
    ],
    relatedSlugs: ['chain-of-thought', 'tree-of-thought']
  },
  {
    id: 'react',
    slug: 'react-pattern',
    name: 'نمط ReAct (Reasoning + Acting)',
    nameEn: 'ReAct Pattern (Reasoning + Acting)',
    icon: 'RotateCcw',
    difficulty: 'متقدم',
    category: 'الإطارات المتقدمة',
    description: 'يجمع بين التفكير (Reasoning) والفعل (Acting) — النموذج يفكر ثم ي QAction ثم ينظر للنتيجة ويكرر.',
    fullDescription: 'نمط ReAct هو أحد أقوى إطارات البرمجة المتقدمة — يجمع بين التفكير المنطقي (Reasoning) والتفاعل مع البيئة (Acting). النموذج يفكر في المشكلة، يتخذ إجراءً، ينظر للنتيجة، ثم يكرر حتى يصل للحل.',
    whenToUse: ['المهام التي تحتاج تفاعلاً مع أدوات خارجية', 'مسائل البحث والاستعلام', 'الأتمتة المعقدة', 'DevOps و IT automation', 'المهام متعددة الخطوات'],
    howItWorks: 'Thought (التفكير) → Action (الإجراء) → Observation (الملاحظة) → Thought → Action → ... → Final Answer (الإجابة النهائية)',
    examples: [
      {
        title: 'بحث واستعلام',
        before: 'اعثر على أفضل مطعم إيطالي في القاهرة',
        after: 'استخدم نمط ReAct للبحث:\n\nThought: أحتاج البحث عن مطاعم إيطالية في القاهرة\nAction: Search: "أفضل مطعم إيطالي القاهرة 2025"\nObservation: [نتائج البحث]\n\nThought: الآن أحتاج تصفية النتائج حسب التقييمات\nAction: Filter: التقييم 4+ نجوم، السعر متوسط\nObservation: [النتيجة المصفاة]\n\nFinal Answer: أفضل 3 مطاعم إيطالية في القاهرة هي...',
        explanation: 'النموذج يفكر ويتفاعل مع بيئة البحث خطوة بخطوة'
      }
    ],
    tips: [
      'هذه التقنية أساس عمل MCP و AI Agents',
      'افصل كل خطوة بعنوان: Thought/Action/Observation',
      'استخدمها مع Claude Code أو Cursor للأتمتة البرمجية',
      'ممتازة ل DevOps و IT automation'
    ],
    relatedSlugs: ['chain-of-thought', 'meta-prompting']
  },
  {
    id: 'chain-of-verification',
    slug: 'chain-of-verification',
    name: 'سلسلة التحقق (Chain of Verification)',
    nameEn: 'Chain of Verification',
    icon: 'ShieldCheck',
    difficulty: 'متقدم',
    category: 'الإطارات المتقدمة',
    description: 'يطلب من النموذج التحقق من إجابته بنفسه — يتحقق من الأرقام، الحقائق، والمنطق قبل تقديم الإجابة.',
    fullDescription: 'سلسلة التحقق (Chain of Verification) تقنية تقلل الأخطاء بشكل كبير — تطلب من النموذج أولاً تقديم إجابة مبدئية، ثم التحقق من كل ادعاء فيها (هل هذه الأرقام صحيحة؟ هل هذه المعلومة محدثة؟) ثم تقديم الإجابة النهائية بعد التحقق.',
    whenToUse: ['المعلومات التاريخية والأرقام', 'الحقائق العلمية', 'أرقام المبيعات والإحصائيات', 'المعلومات التي قد تكون قديمة', 'أي مهمة تحتاج دقة عالية'],
    howItWorks: '1) أجب بشكل مبدئي، 2) تحقق من كل ادعاء على حدة، 3) صلح الأخطاء، 4) قدّم الإجابة النهائية.',
    examples: [
      {
        title: 'تحقق من إحصائيات',
        before: 'ما عدد سكان القاهرة؟',
        after: 'ما عدد سكان القاهرة؟\n\n1. أجب بشكل مبدئي أولاً\n2. ثم تحقق من كل رقم: هل هذا الرقم محدث؟ ما مصدره؟\n3. إذا وجدت تضارباً، اذكره\n4. قدّم الإجابة النهائية مع مصدرها',
        explanation: 'النموذج يتحقق من إجابته قبل تقديمها — تقليل كبير للأخطاء'
      }
    ],
    tips: [
      'استخدمها دائماً عندما تحتاج معلومات دقيقة',
      'اطلب ذكر المصادر أو mức الثقة (90%? 70%?)',
      'ممتازة للتحقق من أكواد Python قبل التشغيل',
      'أضف "If unsure, say you don\'t know"'
    ],
    relatedSlugs: ['chain-of-thought', 'self-consistency']
  },
  {
    id: 'meta-prompting',
    slug: 'meta-prompting',
    name: 'البرمجة التعريفية (Meta Prompting)',
    nameEn: 'Meta Prompting',
    icon: 'Sparkles',
    difficulty: 'متقدم',
    category: 'الإطارات المتقدمة',
    description: 'إعطاء النموذج تعليمات حول كيفية تحسين برومبتاتك — يُعلّمك كيف تكتب برومبتات أفضل.',
    fullDescription: 'البرمجة التعريفية (Meta Prompting) هي تقنية متطورة — تطلب من النموذج تحليل برومبتاتك وتحسينها. بدلاً من كتابة برومبت واحد، تطلب من النموذج كتابة 3 نسخ محسّنة مع شرح التحسينات.',
    whenToUse: ['عندما تريد تحسين برومبت معين', 'لتعلم تقنيات البرمجة', 'عندما تكون النتائج غير مرضية', 'لتحسين برومبتاتك المتكررة', 'لإنشاء قوالب برومبت قابلة لإعادة الاستخدام'],
    howItWorks: 'اكتب برومبتك الحالي ثم اطلب: "حسّن هذا البرومبت وقدم 3 نسخ مختلفة مع شرح التحسينات في كل نسخة."',
    examples: [
      {
        title: 'تحسين برومبت تسويقي',
        before: 'اكتب لي إعلاناً لمنتجي',
        after: 'هذا هو البرومبت الذي أستخدمه حالياً:\n"اكتب لي إعلاناً لمنتجي"\n\nحسّن هذا البرومبت وقدم 3 نسخ مختلفة مع شرح التحسينات في كل نسخة. ركّز على:\n1. وضوح الطلب\n2. السياق المضافة\n3. شكل الإخراج\n4. الكلمات المفتاحية المستهدفة',
        explanation: 'النموذج يحلل برومبتك ويحسّنه — تتعلم كيف تكتب برومبتات أفضل'
      }
    ],
    tips: [
      'استخدمها كأداة تعليمية — تتعلم من التحسينات',
      'اعمل بها مرة كل أسبوع لتحسين برومبتاتك المتكررة',
      'اطلب "casual style" أو "professional style" حسب الحاجة',
      'احفظ أفضل نسخة محسّنة كقالب قابل لإعادة الاستخدام'
    ],
    relatedSlugs: ['role-task-format', 'race']
  }
];

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: 'writing',
    slug: 'creative-writing',
    name: 'الكتابة الإبداعية',
    nameEn: 'Creative Writing',
    icon: 'PenTool',
    description: 'مهارات الكتابة الإبداعية: الرواية، القصص، المقالات، النصوص الإعلانية، السيناريوهات.',
    skills: [
      { id: 'character-voice', name: 'صوت الشخصية', nameEn: 'Character Voice', description: 'إنشاء شخصيات ذات صوت فريد ومتسق', difficulty: 'متوسط', promptTemplate: 'أنت كاتب خبرة في [Genre]. أنشئ شخصية اسمها [Name] بصفات: [Traits]. اكتب 3 فقرات بصوت هذه الشخصية.', example: 'أنت كاتب خبرة في الخيال العلمي. أنشئ شخصية اسمها "نور" بصفات: ممرضة، خائفة من الظلام، تحب الفضاء. اكتب 3 فقرات بصوت هذه الشخصية.' },
      { id: 'story-arc', name: 'القوس السردي', nameEn: 'Story Arc', description: 'بناء قوس سردي كامل: بداية، صعود، ذروة، هبوط، نهاية', difficulty: 'متقدم', promptTemplate: 'اكتب قصة قصيرة (300 كلمة) بقوس سردي كامل: [Premise]. استخدم تقنية [Technique].', example: 'اكتب قصة قصيرة (300 كلمة) بقوس سردي كامل: شاب يكتشف أنه يرى الأرواح. استخدم تقنية البداية المتأخرة (In Medias Res).' },
      { id: 'dialogue', name: 'الحوار', nameEn: 'Dialogue', description: 'كتابة حوار واقعي بين شخصيات', difficulty: 'متوسط', promptTemplate: 'اكتب حواراً بين [Character A] و [Character B] حول [Topic]. الوضع: [Setting]. نبرة: [Tone].', example: 'اكتب حواراً بين "أحمد" (طبيب متعب) و "سارة" (ممرضته) حول نقص الموظفين. الوضع: قسم الطوارئ الساعة 3 صباحاً. نبرة: توتر مع لمسة فكاهة.' },
      { id: 'copywriting', name: 'الكتابة الإعلانية', nameEn: 'Copywriting', description: 'كتابة نصوص إعلانية تجذب وتحول', difficulty: 'متوسط', promptTemplate: 'اكتب نصاً إعلانياً لـ [Product] يستخدم نمط [Framework]. الجمهور المستهدف: [Audience].', example: 'اكتب نصاً إعلانياً لتطبيق "مذاكرتي" (تطبيق حفظ القرآن) يستخدم نمط AIDA. الجمهور المستهدف: طلاب الجامعات المسلمين في أمريكا.' },
    ]
  },
  {
    id: 'coding',
    slug: 'ai-coding',
    name: 'البرمجة بالذكاء الاصطناعي',
    nameEn: 'AI-Assisted Coding',
    icon: 'Code',
    description: 'مهارات البرمجة مع Claude Code و Cursor: مراجعة الكود، إعادة الهيكلة، التصحيح، التحسين.',
    skills: [
      { id: 'code-review', name: 'مراجعة الكود', nameEn: 'Code Review', description: 'مراجعة شاملة للكود مع اقتراحات التحسين', difficulty: 'متوسط', promptTemplate: 'راجع هذا الكود وقدم تقييماً من 5 معايير: الأداء، الأمان، القراءة، التوثيق، أفضل الممارسات.\n\n```[Language]\n[Code]\n```', example: 'راجع هذا الكود وقدم تقييماً من 5 معايير: الأداء، الأمان، القراءة، التوثيق، أفضل الممارسات.\n\n```python\ndef get_user(id):\n  user = db.execute(f"SELECT * FROM users WHERE id = {id}")\n  return user\n```' },
      { id: 'refactor', name: 'إعادة الهيكلة', nameEn: 'Refactoring', description: 'تحسين هيكل الكود بدون تغيير الوظيفة', difficulty: 'متقدم', promptTemplate: 'أعد هيكلة هذا الكود لـ [Goal]. اشرح كل تغيير.\n\n```[Language]\n[Code]\n```', example: 'أعد هيكلة هذا الكود ليكون أكثر اختباراً (testable) وقراءة (readable). اشرح كل تغيير.\n\n```python\n[Original Code]\n```' },
      { id: 'debug', name: 'تصحيح الأخطاء', nameEn: 'Debugging', description: 'إيجاد وتصحيح الأخطاء البرمجية', difficulty: 'متوسط', promptTemplate: 'لدي هذا الخطأ: [Error Message]. الكود: [Code]. حول ماذا يدور الخطأ وكيف أصلحه؟', example: 'لدي هذا الخطأ: "TypeError: Cannot read property \'name\' of undefined". الكود: user.profile.name. حول ماذا يدور الخطأ وكيف أصلحه؟' },
      { id: 'architecture', name: 'تصميم الهيكلية', nameEn: 'Architecture Design', description: 'تصميم هيكل المشروع والأنظمة', difficulty: 'متقدم', promptTemplate: 'صمم هيكل مشروع [Type] باستخدام [Tech Stack]. الميزات: [Features]. الجودة المطلوبة: [Non-functional Requirements].', example: 'صمم هيكل مشروع واجهة ويب للتجارة الإلكترونية باستخدام Next.js + TypeScript + Prisma + PostgreSQL. الميزات: تسجيل دخول، سلة مشتريات، الدفع. الجودة: SEO، أداء، أمان.' },
    ]
  },
  {
    id: 'data-analysis',
    slug: 'data-analysis',
    name: 'تحليل البيانات',
    nameEn: 'Data Analysis',
    icon: 'BarChart3',
    description: 'مهارات تحليل البيانات: استخراج الأنماط، التصنيف، التنبؤ، التصور البياني.',
    skills: [
      { id: 'pattern-recognition', name: 'استخراج الأنماط', nameEn: 'Pattern Recognition', description: 'اكتشاف الأنماط والاتجاهات في البيانات', difficulty: 'متوسط', promptTemplate: 'حلل هذه البيانات واكتشف 3 أنماط رئيسية:\n[Data]\nقدم كل نمط مع: الوصف، الأرقام الداعمة، التنبؤ للمستقبل.', example: 'حلل هذه بيانات مبيعاتي الشهرية واكتشف 3 أنماط رئيسية:\nيناير: 1000 طلب، فبراير: 1200، مارس: 1100، أبريل: 1500\nقدم كل نمط مع: الوصف، الأرقام الداعمة، التنبؤ لشهري مايو ويونيو.' },
      { id: 'data-cleaning', name: 'تنظيف البيانات', nameEn: 'Data Cleaning', description: 'تنظيف وتحضير البيانات للتحليل', difficulty: 'مبتدئ', promptTemplate: 'نظّف هذه البيانات: [Raw Data]. الأخطاء المتوقعة: [Expected Issues]. أخرج جدولاً نظيفاً مع تقرير بالتغييرات.', example: 'نظّف قائمة بيانات الزبائن: "أحمد/ahmed@email.com، س/، محمد 01012345678، non@, فاطمة f@ex.com". الأخطاء المتوقعة: إيميلات خاطئة، أرقام ناقصة، تكرار.' },
      { id: 'visualization', name: 'التصور البياني', nameEn: 'Data Visualization', description: 'اقتراح أفضل أنواع الرسوم البيانية للبيانات', difficulty: 'مبتدئ', promptTemplate: 'لدي بيانات: [Data]. اقترح 3 أنواع رسوم بيانية مناسبة مع السبب واكتب كود [Tool] لتوليد كل واحد.', example: 'لدي بيانات مبيعات شهرية: 12 شهراً، مبيعات + أرباح. اقترح 3 أنواع رسوم بيانية مناسبة مع السبب واكتب كود Python (matplotlib) لتوليد كل واحد.' },
    ]
  },
  {
    id: 'marketing',
    slug: 'marketing-skills',
    name: 'التسويق والمحتوى',
    nameEn: 'Marketing & Content',
    icon: 'TrendingUp',
    description: 'مهارات التسويق الرقمي: AIDA، PAS، A/B Testing، половина المحتوى، камWithEmailات.',
    skills: [
      { id: 'aida', name: 'إطار AIDA', nameEn: 'AIDA Framework', description: 'Attention → Interest → Desire → Action', difficulty: 'مبتدئ', promptTemplate: 'اكتب نصاً إعلانياً بأسلوب AIDA لـ [Product]. الجمهور: [Audience]. الهدف: [Goal].', example: 'اكتب نصاً إعلانياً بأسلوب AIDA لـ دورة "ecome a Prompt Engineer" (دورة برومبتينج). الجمهور: مبرمجين عرب. الهدف: التسجيل في الدورة.' },
      { id: 'pas', name: 'إطار PAS', nameEn: 'PAS Framework', description: 'Problem → Agitate → Solve', difficulty: 'مبتدئ', promptTemplate: 'اكتب نصاً بأسلوب PAS: المشكلة [Problem]، التصعيد [Agitation]، الحل [Solution]. للمنتج: [Product].', example: 'اكتب نصاً بأسلوب PAS: المشكلة "الموارد تسويقية ضعيفة"، التصعيد "منافسون يحققون 10 أضعافك"، الحل "دورة التسويق بالذكاء الاصطناعي". للمنتج: منصة تدريبية أونلاين.' },
      { id: 'persona', name: 'الشخصية المستهدفة', nameEn: 'Customer Persona', description: 'إنشاء شخصية مفصلة للزبون المستهدف', difficulty: 'متوسط', promptTemplate: 'أنشئ شخصية زبون مفصلة لـ [Product/Service]: الاسم، العمر، الاهتمامات، التحديات، الن Platforms المفضلة، صوت المشتري.', example: 'أنشئ شخصية زبون مفصلة لـ منصة PromptHub: الاسم، العمر، الاهتمامات، التحديات، المنصات المفضلة، صوت المشتري الداخلي.' },
    ]
  },
  {
    id: 'image-generation',
    slug: 'image-generation',
    name: 'توليد الصور',
    nameEn: 'Image Generation',
    icon: 'Image',
    description: 'مهارات توليد الصور: التكوين، الإضاءة، زوايا الكاميرا، نظرية الألوان، المراجع الأسلوبية.',
    skills: [
      { id: 'composition', name: 'التكوين', nameEn: 'Composition', description: 'تنظيم العناصر في الصورة', difficulty: 'مبتدئ', promptTemplate: '[Subject], [composition style], [lighting], [mood], [color palette], [technical specs]', example: 'A woman reading in a cozy coffee shop, rule of thirds composition, warm golden hour lighting, nostalgic mood, earth tones color palette, shot on 35mm film, 8k resolution' },
      { id: 'lighting', name: 'الإضاءة', nameEn: 'Lighting', description: 'التحكم بأنواع الإضاءة المختلفة', difficulty: 'متوسط', promptTemplate: 'Add to your prompt: [Lighting Type]. Examples: "soft diffused lighting", "dramatic rim lighting", "neon cyberpunk glow", "natural window light".', example: 'A portrait of a chef, dramatic rim lighting from behind, warm kitchen background, shallow depth of field, commercial photography style' },
      { id: 'camera-angles', name: 'زوايا الكاميرا', nameEn: 'Camera Angles', description: 'وصف زوايا التصوير بدقة', difficulty: 'متوسط', promptTemplate: 'Specify camera angle: [Angle]. Low angle (heroic), high angle (vulnerable), dutch angle (tension), bird\'s eye (overview), close-up (intimacy).', example: 'A superhero standing on a rooftop at sunset, extreme low angle shot, dramatic perspective, cinematic composition, 8k ultra detailed' },
    ]
  },
  {
    id: 'business',
    slug: 'business-skills',
    name: 'الأعمال والاستراتيجية',
    nameEn: 'Business & Strategy',
    icon: 'Briefcase',
    description: 'مهارات الأعمال: خطة العمل، عرض المستثمرين، تحليل SWOT، النمذجة المالية، خطة التسويق.',
    skills: [
      { id: 'business-plan', name: 'خطة العمل', nameEn: 'Business Plan', description: 'كتابة خطة عمل شاملة ومفصلة', difficulty: 'متقدم', promptTemplate: 'اكتب خطة عمل لـ [Business Idea]: الملخص التنفيذي، التحليل السوق، المنافسون، نموذج الإيرادات، التوقعات المالية (3 سنوات)، الفريق المطلوب.', example: 'اكتب خطة عمل لـ PromptHub (مكتبة برومبتات ذكاء اصطناعي مجانية بالعربي): الملخص التنفيذي، التحليل السوق، المنافسون، نموذج الإيرادات (إعلانات + اشتراكات)، التوقعات المالية (3 سنوات).' },
      { id: 'swot', name: 'تحليل SWOT', nameEn: 'SWOT Analysis', description: 'تحليل نقاط القوة والضعف والفرص والتهديدات', difficulty: 'متوسط', promptTemplate: 'قم بتحليل SWOT لـ [Business/Product]: نقاط القوة (Strengths)، نقاط الضعف (Weak opportunities)، الفرص (Opportunities)، التهديدات (Threats).', example: 'قم بتحليل SWOT لـ منصة PromptHub: النقاط القوة (مجاني، عربي، SEO قوي)، الضعف (内容 يعتمد على إضافة يدوية)، الفرص (سوق عرب ضخم)، التهديدات (منصات مشابهة).' },
      { id: 'pitch-deck', name: 'عرض المستثمرين', nameEn: 'Pitch Deck', description: 'تصميم عرض تقديمي لجذب المستثمرين', difficulty: 'متقدم', promptTemplate: 'صمم عرض مستثمرين (10 شرائح) لـ [Startup]: المشكلة، الحل، الحجم السوق، النموذج، التraction، الفريق، المطلوب.', example: 'صمم عرض مستثمرين (10 شرائح) لـ PromptHub: المشكلة (العربية لا يوجد مرجع موحد للـ AI)، الحل (منصة شاملة)، الحجم السوق (400 مليون عربي).' },
    ]
  },
  {
    id: 'academic',
    slug: 'academic-research',
    name: 'البحث الأكاديمي',
    nameEn: 'Academic Research',
    icon: 'BookOpen',
    description: 'مهارات البحث الأكاديمي: مراجعة الأدبيات، بناء الأطروحة، المناقشة العلمية، التوثيق.',
    skills: [
      { id: 'literature-review', name: 'مراجعة الأدبيات', nameEn: 'Literature Review', description: 'كتابة مراجعة شاملة للأدبيات العلمية', difficulty: 'متقدم', promptTemplate: 'اكتب مراجعة أدبيات عن [Topic] تشمل: 1) الدراسات الرئيسية، 2) الفجوات البحثية، 3) الاتجاهات الحديثة، 4) القيود المنهجية.', example: 'اكتب مراجعة أدبيات عن "تأثير الذكاء الاصطناعي على تعليم اللغة الإنجليزية" تشمل: 1) الدراسات الرئيسية، 2) الفجوات البحثية، 3) الاتجاهات الحديثة، 4) القيود المنهجية.' },
      { id: 'thesis-structure', name: 'بنية الأطروحة', nameEn: 'Thesis Structure', description: 'تنظيم أطروحة علمية بشكل منهجي', difficulty: 'متقدم', promptTemplate: 'أعد تنظيم هذا المحتوى في بنية أطروحة علمية: [Content]. الأقسام: المقدمة، المراجعة، المنهجية، النتائج، المناقشة، الخاتمة.', example: 'أعد تنظيم هذا المحتوى في بنية أطروحة ماجستير عن "استخدام ChatGPT في تعليم الرياضيات": المقدمة، المراجعة، المنهجية، النتائج، المناقشة، الخاتمة.' },
    ]
  }
];
