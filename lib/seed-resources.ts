export type PromptTemplate = {
  title: string;
  text: string;
};

export type ResourcePack = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  templates: PromptTemplate[];
};

export const RESOURCE_PACKS: ResourcePack[] = [
  {
    id: 'marketing-pack',
    name: 'حزمة التسويق والمحتوى',
    nameEn: 'Marketing & Content Pack',
    description: '10 قوالب جاهزة لكتابة الإعلانات، خطة المحتوى، حملات البريد الإلكتروني، والنسخ البيعية.',
    icon: '🚀',
    color: 'from-amber-500 to-orange-600',
    templates: [
      {
        title: '1. كاتب إعلانات بمبدأ PAS',
        text: 'تصرف كخبير كتابة إعلانات مباشرة (Senior Direct-Response Copywriter) بخبرة 15 عاماً. اكتب إعلاناً للمنتج [اسم_المنتج] موجه إلى [الجمهور_المستهدف] يتبع إطار PAS: الحديث عن المشكلة، ثم تفاقمها، ثم تقديم الحل مع دليل سريع. اختم بدعوة واضحة للشراء. لا تتجاوز 130 كلمة وبأسلوب [نبرة_الحديث].'
      },
      {
        title: '2. خطة محتوى شهرية',
        text: 'تصرف كمدير محتوى رقمي. ضع خطة محتوى شهرية لصفحة [اسم_المنصة] الخاصة بـ [النشاط_التجاري]، تتضمن 20 فكرة منشور مقسمة بين تعليمية وتفاعلية وبيعية، مع أفضل أوقات النشر وأقترح هاشتاجات مناسبة. أعد النتيجة كجدول: اليوم، الفكرة، النوع، الهدف.'
      },
      {
        title: '3. سطر موضوع بريد إلكتروني',
        text: 'تصرف كخبير بريد إلكتروني (Email Marketing). اقترح 10 أسطر موضوع للبريد المرسل إلى [الجمهور] بخصوص [العرض/المناسبة]، اجعلها مثيرة للفضول وتجنب الكلمات الإغراقية المبالغ فيها. نسّقها من الأكثر فضولاً إلى الأقل، مع سبب نجاح كل سطر في سطر قصير بعده.'
      },
      {
        title: '4. نصوص سوشيال ميديا',
        text: 'تصرف ككاتب محتوى سوشيال ميديا. اكتب منشوراً لـ [المنصة] يتحدث عن [الموضوع]، يحتوي: مقدمة توقّف السحب، فقرة تشرح الفائدة، سؤال تفاعلي في النهاية، وهاشتاجات مقترحة. بأسلوب بسيط لا يتجاوز 180 كلمة.'
      },
      {
        title: '5. صفحة هبوط بيعية',
        text: 'تصرف كخبير تحسين تحويل (CRO). اكتب محتوى صفحة هبوط كاملة قصيرة وشديدة الإقناع لمنتج [اسم_المنتج] تتضمن: عنواناً رئيسياً قوياً، 3 فوائد بجمل قصيرة، إثبات اجتماعي، سؤال للتغلب على الاعتراض، ودعوة واضحة [زر_الإجراء]. النبرة: [نبرة_الحديث].'
      },
      {
        title: '6. وصف منتج غني',
        text: 'تصرف ككاتب أوصاف منتجات تجارية. اكتب وصفاً للمنتج [اسم_المنتج] بطول 200 كلمة يركز على: فائدة [الفائدة_الرئيسية]، حل مشكلة [المشكلة_التي_يحلها]، وميزة التميز [ميزة_التميز]. اختم بأسئلة شائعة من 3 أسئلة وأجوبة. أسلوب مقنع ومباشر.'
      },
      {
        title: '7. حملة إعلانات ممولة',
        text: 'تصرف كمدير حملات إعلانية. أنشئ حملة إعلانية لـ [المنتج/الخدمة] على منصة [المنصة] تستهدف [الجمهور] بهدف [الهدف_من_الحملة]. اقترح 3 مجموعات نصوص إعلانية مختلفة (مفيدة، مثيرة للفضول، اجتماعية)، وأفضل ميزانيتين للاختبار، ومؤشرات نجاح يجب متابعتها.'
      },
      {
        title: '8. إعادة صياغة للسيو (GEO)',
        text: 'تصرف كخبير تحسين ظهور في محركات الذكاء الاصطناعي (GEO) وسيو دلالي. أعد صياغة النص التالي ليكون واضحاً ومقتبساً في إجابات محركات البحث ومساعدات الذكاء الاصطناعي، ببنية سؤال/جواب مباشرة وقسم إجابات سريعة وقسم تفصيلي، مع 5 أسئلة شائعة ذات صلة.'
      },
      {
        title: '9. بريد تعريفي للمستثمرين',
        text: 'تصرف كمسؤول علاقات مستثمرين. اكتب بريداً تعريفياً قصيراً وقوياً لمستثمر حول [المشروع] يشرح: الفجوة السوقية، الحل المقترح، النموذج التجاري، أبرز أرقام النمو، والمبلغ المطلوب واستخدامه. طول لا يتجاوز 350 كلمة، بلغة [لغة_الخطاب].'
      },
      {
        title: '10. رسالة رد على مراجعة سلبية',
        text: 'تصرف كمدير تجربة عملاء محترف. اكتب رداً مهنياً على مراجعة سلبية من عميل عن [الخدمة/المنتج] يتضمن: الاعتذار الصادق عن التجربة، محاولة فهم المشكلة بدقة، وعرض حل ملموس أو تعويض، مع نهاية إيجابية تفتح باب استعادة الثقة. النبرة: دافية ومهنية دون دفاع.'
      }
    ]
  },
  {
    id: 'coding-pack',
    name: 'حزمة البرمجة والتطوير',
    nameEn: 'Coding & Development Pack',
    description: 'قوالب لمراجعة الكود، كتابة الدوال، إنشاء الاختبارات، وتصحيح الأخطاء بأسلوب المهندس المحترف.',
    icon: '💻',
    color: 'from-blue-500 to-cyan-600',
    templates: [
      {
        title: '1. مراجعة كود شاملة',
        text: 'تصرف كمراجع كود رئيسي (Principal Code Reviewer). راجع المقتطف التالي من منظور [الأهداف: الأداء، الأمان، القابلية للقراءة]. اذكر: نقاط القوة، المخاطر الأمنية، مشاكل الأداء، اقتراحات تحسين محددة شفرة بذاتها. أعد النتيجة كقائمة مرتبة أولوياتها واضحة.'
      },
      {
        title: '2. كاتب دوال ومنطق نظيف',
        text: 'تصرف كمهندس برمجيات خبير بلغة [لغة_البرمجة]. اكتب دالة تحقق الوظيفة الآتية: [وصف_الوظيفة], مع معالجة الحالات الحدية، وأنماط تسمية واضحة، وتعليقات توضح الهدف فقط. احرص على تبسيط المنطق وتجنب التعقيد غير الضروري. أعد الكود كاملاً مع مثالين للاستخدام.'
      },
      {
        title: '3. كاتب اختبارات وحدات',
        text: 'تصرف كمختص اختبارات (Testing Engineer). اكتب اختبارات وحدات بإطار [الإطار_مثل_jest_pytest] للدالة الآتية: [الكود]. غطّ الحالات السعيدة والحالات الحدية وأخطاء المدخلات، مع اسم اختبار واضح لكل حالة. أعد كود الاختبارات كاملاً جاهزاً للتشغيل.'
      },
      {
        title: '4. مصحح أخطاء (Debugger)',
        text: 'تصرف كخبير تصحيح أخطاء (Senior Debugger). أعد إنتاج الكود التالي [كود_المشكلة] مع شرح السبب الجذري للخطأ بناءً على [الخطأ_المعروض]. اشرح أولاً سبب المشكلة في سطرين، ثم قدّم الكود المُصحح كاملاً، ثم اذكر اختباراً لمنع تكراره.'
      },
      {
        title: '5. موثق API',
        text: 'تصرف ككاتب توثيق تقني (Technical Writer). اكتب توثيقاً كاملاً لنقطة النهاية الآتية: [الرابط_والطريقة] تتضمن: غرضها، القواعد والتطبيقات النموذجية، بنية الطلب والاستجابة، حالات الخطأ، وأمثلة بلغتي [لغة1] و [لغة2]. أسلوب موجز ودقيق مع جدول معاملات.'
      }
    ]
  },
  {
    id: 'image-pack',
    name: 'حزمة توليد الصور',
    nameEn: 'AI Image Generation Pack',
    description: 'قوالب إنجليزية وعربية لتوليد بورتريهات، منتجات، خلفيات، وهوية بصرية في Midjourney و FLUX.',
    icon: '🎨',
    color: 'from-purple-500 to-pink-600',
    templates: [
      {
        title: '1. بورتريه سينمائي (Midjourney)',
        text: 'Cinematic hyper-realistic portrait of [وصف_الشخصية/الموضوع], [تفاصيل_البيئة_والمكان], captured on 35mm Arri Alexa LF camera, 85mm prime lens, f/1.4 aperture, dramatic volumetric cinematic lighting with subtle rim light, intricate skin texture, authentic natural reflections in the eyes, color graded in [لوحة_الألوان_والأسلوب], photorealistic, 8k resolution, award-winning cinematography --ar 16:9 --style raw --v 6.1'
      },
      {
        title: '2. صورة منتج تجارية (FLUX)',
        text: 'Professional product photography of [اسم_المنتج] on a [نوع_الخلفية] studio background, soft diffused lighting, gentle shadows, high detail textures, centered composition, minimalist aesthetic, warm color palette, e-commerce hero image, ultra sharp, color graded, 200mm lens, f/8, photorealistic 4k'
      },
      {
        title: '3. هوية بصرية وخلق لوجو',
        text: 'Modern minimal logo design for [اسم_العلامة_التجارية], concept: [الفكرة_المجردة], flat vector silhouette, geometric composition, [الألوان_المصاحبة] color scheme, clean negative space, white background, professional branding, scaleable emblem, no text'
      },
      {
        title: '4. خلفية ريلز وقصص سينمائية',
        text: '9:16 vertical cinematic background, [وصف_المشهد] with deep depth of field, atmospheric haze, dramatic golden-hour lighting, film grain, cinematic color grade, moody shadows, photorealistic, high detail, no people, no text --ar 9:16 --v 6.1'
      },
      {
        title: '5. شخصية ثلاثية الأبعاد',
        text: '3D character concept art, stylized low-poly character, [وصف_الشخصية], Pixar-inspired facial expression, soft studio lighting, saturated colors, Blender Octane render, high detail texture, clean background, character design sheet, front view'
      }
    ]
  },
  {
    id: 'productivity-pack',
    name: 'حزمة الإنتاجية والبحث',
    nameEn: 'Productivity & Research Pack',
    description: 'التلخيص، التفكير، تنظيم المهام، ودراسات الحالة — قوالب عملية لسير عمل يومي أسرع.',
    icon: '⚡',
    color: 'from-emerald-500 to-teal-600',
    templates: [
      {
        title: '1. تلخيص دقيق ثلاثي الخطوات',
        text: 'تصرف كخبير معلومات (Information Architect). لخّص النص الآتي بثلاث خطوات: 1) استخرج النقاط الرئيسية والأسماء والأرقام حرفياً. 2) ادمج المتشابه. 3) لخّص كل فئة بجملة مركزة. أعد النتيجة نقاطاً ثم فقرة ختامية لا تتجاوز [الكلمات_المطلوبة].'
      },
      {
        title: '2. مخطط تنفيذ مشروع',
        text: 'تصرف كمدير مشروع (Project Manager). حوّل الهدف الآتي إلى خطة تنفيذ: [الهدف]. وزّعها على 4 مراحل كل مرحلة فيها: المهام، المدة، المسؤول، مؤشر الإنجاز، والمخاطرة المحتملة مع خطة تخفيف. أعد النتيجة كجدول.'
      },
      {
        title: '3. العصف الذهني المصنف',
        text: 'تصرف كمحفز أفكار (Idea Catalyst). ولّد 25 فكرة حول [الموضوع]. لا تنتقد أي فكرة أولاً؛ صنّفها بعدها حسب: الجدوى، التكلفة، والتأثير، واختر أفضل 3 أفكار وبرر اختيارك.'
      },
      {
        title: '4. تحليل قرار متعدد المعايير',
        text: 'تصرف كمستشار قرارات (Decision Analyst). قيّم الخيارات الآتية [الخيارات] وفق المعايير [المعايير]. أنشئ مصفوفة قرار بوزن لكل معيار، واحسب النتائج، وقدم توصية مبينة بالأرقام، مع ذكر افتراضاتك صراحةً.'
      },
      {
        title: '5. تبسيط مفهوم معقد',
        text: 'تصرف كمدرس متمكن (Expert Teacher). اشرح مفهوم [المفهوم] بالعربية لمبتدئ دون خبرته. استخدم تشبيهاً من الحياة اليومية، ثم مثالاً خطوة بخطوة، ثم أصلح المفاهيم الخاطئة الثلاثة الأشهر عنه. أسلوب بسيط وممتع.'
      },
      {
        title: '6. دراسة حالة (Case Study)',
        text: 'تصرف كمحلل أعمال (Business Analyst). اكتب دراسة حالة عن [الموضوع/الشركة]: السياق والتحدي، البيانات المتاحة عن النهج المتبع، النتائج التي تحققت، الدروس المستفادة، والتطبيق العملي على حالة أخرى مشابهة. أعد النتيجة ببنية عناوين واضحة بأسلوب مهني.'
      }
    ]
  }
];

function escapeJsonText(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

export function buildPackTxt(pack: ResourcePack): string {
  const header = `========================================\n${pack.name}\n${pack.nameEn}\n${pack.templates.length} قوالب جاهزة | PromptHub\n========================================\n\n`;
  const body = pack.templates
    .map(t => `${t.title}\n${'-'.repeat(t.title.length)}\n${t.text}\n`)
    .join('\n\n');
  const footer = `\n\n----------------------------------------\nالمصدر: PromptHub — مشروع حزمة ${pack.name}\nتم النسخ: ${new Date().toISOString().split('T')[0]}\n`;
  return header + body + footer;
}

export function buildPackJson(pack: ResourcePack): string {
  const payload = {
    source: 'PromptHub',
    pack: pack.name,
    packEn: pack.nameEn,
    exportedAt: new Date().toISOString(),
    templates: pack.templates
  };
  return JSON.stringify(payload, null, 2);
}

export function buildAllTxt(): string {
  const packs = RESOURCE_PACKS.map(p => buildPackTxt(p)).join('\n');
  return `مكتبة قوالب PromptHub العام\n${'='.repeat(40)}\n\n${packs}`;
}