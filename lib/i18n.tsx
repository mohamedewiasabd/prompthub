'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Locale = 'ar' | 'en';

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.shortcuts': 'الأوامر السريعة',
    'nav.models': 'تطبيقات الذكاء الاصطناعي',
    'nav.compare': 'المقارنات',
    'nav.learn': 'تعلم',
    'nav.skills': 'المهارات',
    'nav.trending': 'الرائج',
    'nav.blog': 'المدونة',
    'nav.resources': 'القوالب',
    'nav.cases': 'دراسات',
    'nav.myLibrary': 'مكتبتي',
    'nav.help': 'مساعدة',
    // Mobile
    'mobile.shortcutsTitle': 'الأوامر السريعة والاختصارات الذكية',
    'mobile.modelsTitle': 'تصفح التطبيقات وال Compare',
    'mobile.learnTitle': 'تعلم تقنيات البرمبت المتقدمة',
    'mobile.skillsTitle': 'مهارات جاهزة حسب المجال',
    'mobile.trendingTitle': 'الرائج والإحصائيات',
    'mobile.blogTitle': 'المدونة والمقالات',
    'mobile.resourcesTitle': 'حزم القوالب القابلة للتحميل',
    'mobile.casesTitle': 'دراسات حالة عملية',
    'mobile.myTitle': 'مكتبتي (المفضلة وسجل النسخ)',
    'mobile.helpTitle': 'المساعدة والأسئلة الشائعة',
    'mobile.navShortcuts': 'الأوامر',
    'mobile.navModels': 'النماذج',
    'mobile.navMy': 'مكتبتي',
    'mobile.navHelp': 'المساعدة',
    // Help page
    'help.badge': 'مركز المساعدة',
    'help.title': 'كيف نساعدك اليوم؟',
    'help.subtitle': 'إجابات مفصلة عن الاستخدام والبحث والمزامنة والجودة. اختر تصنيفاً وافتح الأسئلة التي تهمك.',
    'help.faqCount': '{count} أسئلة',
    'help.quickLinks': 'روابط سريعة مفيدة',
    'help.notFoundTitle': 'لم تجد إجابتك؟',
    'help.notFoundDesc': 'اقترح برومبتات جديدة أو راسلنا بملاحظاتك وسنعمل على تحديث مركز المساعدة.',
    'help.notFoundBilingual': 'المكتبة بالعربية والإنجليزية',
    'help.notFoundExport': 'تصدير مفضلتك بضغطة واحدة',
    'help.notFoundSync': 'مفضلة مزامنة عبر الأجهزة',
    // Blog
    'blog.badge': 'مدونة المكتبة',
    'blog.title': 'مقالات وأدلة عملية',
    'blog.subtitle': 'دليل عربي متكامل لمهارات الذكاء الاصطناعي: أساسيات البرومبتات، أطر العمل، والتطبيقات العملية.',
    'blog.readMore': 'اقرأ المزيد',
    'blog.backToBlog': 'العودة إلى المدونة',
    'blog.practicalTitle': 'جرّب التعلم العملي',
    'blog.practicalDesc': 'أفكار المقال قابلة للتطبيق فوراً عبر برومبتات المكتبة الجاهزة.',
    'blog.btnLearn': 'تصفح أدلة التعلم',
    'blog.btnTrending': 'الأكثر رواجاً الآن',
    // Resources
    'resources.badge': 'موارد قابلة للتحميل',
    'resources.title': 'حزم قوالب جاهزة للاستخدام',
    'resources.subtitle': 'ثلاثون قالباً احترافياً مجمّعة في حزم حسب المجال. نزّل أي حزمة بصيغة TXT أو JSON واستخدمها في أي أداة ذكاء اصطناعي فوراً.',
    'resources.downloadAll': 'تحميل جميع الحزم (ملف واحد)',
    'resources.downloadTxt': 'تحميل TXT',
    'resources.downloadJson': 'تحميل JSON',
    'resources.preview': 'معاينة القوالب',
    'resources.hidePreview': 'إخفاء معاينة القوالب',
    'resources.note': 'جميع القوالب متاحة أصلاً داخل المكتبة مع متغيرات قابلة للتعبئة. ننصح بالنسخ من صفحة البرومبت مباشرة لتجربة النسخة المخصصة؛ ملفات التحميل مفيدة للاستخدام دون اتصال أو في فرق العمل.',
    // Case studies
    'cases.badge': 'دراسات حالة حقيقية',
    'cases.title': 'كيف يستخدم الناس البرومبتات فعلاً؟',
    'cases.subtitle': 'نماذج قصصية واقعية توضح طريقة توظيف برومبتات المكتبة لحل مشكلات ملموسة: المشكلة، البرومبت المستخدم، والنتيجة المُقاسة.',
    'cases.problem': 'المشكلة',
    'cases.goal': 'الهدف والنهج',
    'cases.promptUsed': 'البرومبت المستخدم (مختصر)',
    'cases.result': 'النتيجة',
    'cases.tryIt': 'جرّب بنفسك عبر حزم القوالب الجاهزة',
    'cases.disclaimer': 'هذه القصص صيغت من ممارسات شائعة وموثقة في استعمال البرومبتات؛ النتائج تختلف حسب المجال وجودة التخصيص.',
    // Footer
    'footer.prompts': 'البرومبتات والقوالب',
    'footer.categories': 'التصنيفات والمكتبات',
    'footer.resources': 'الموارد والأدوات',
    'footer.promptsLabel': 'برومبتات حسب التصنيف',
    'footer.compareLabel': 'مقارنة نماذج الذكاء الاصطناعي',
    'footer.learnLabel': 'تعلم هندسة البرومبت',
    'footer.skillsLabel': 'مهارات الذكاء الاصطناعي',
    'footer.trendingLabel': 'الإحصائيات والأكثر رواجاً',
    'footer.shortcutsLabel': 'الأوامر السريعة والاختصارات',
    'footer.docsLabel': 'وثائق واجهة (API) للمطورين',
    'footer.helpLabel': 'المساعدة والأسئلة الشائعة',
    'footer.blogLabel': 'المدونة والمقالات',
    'footer.resourcesLabel': 'حزم القوالب القابلة للتحميل',
    'footer.casesLabel': 'دراسات حالة عملية',
    'footer.aiLabel': 'أدوات الذكاء الاصطناعي',
    'footer.promptsApi': 'API البرومبتات',
    'footer.fullApi': 'API الكامل',
    'footer.directApi': 'API البرومبتات المباشر',
    'footer.sitemap': 'خريطة الموقع',
    'footer.copy': '© PromptHub — جميع الحقوق محفوظة',
    // Help FAQ categories
    'help.catBasics': 'أساسيات المنصة',
    'help.catUsage': 'كيف أستخدم البرومبت؟',
    'help.catLibrary': 'المكتبة والمفضلة والثبات',
    'help.catSearch': 'البحث والتصفية',
    'help.catAccount': 'الحساب والمزامنة',
    'help.catAi': 'الذكاء الاصطناعي والجودة',
    // Help FAQ questions
    'help.q1': 'ما هي منصة PromptHub؟',
    'help.a1': 'مكتبة عربية متخصصة في البرومبتات (أوامر الذكاء الاصطناعي) الاحترافية. نوفر مئات القوالب الجاهزة والمجرّبة عبر أكثر من 30 تصنيفاً تغطي التسويق، البرمجة، توليد الصور، الأعمال، التعليم والمزيد.',
    'help.q2': 'هل استخدام المنصة مجاني بالكامل؟',
    'help.a2': 'نعم. التصفح والبحث ونسخ البرومبتات مجاني بالكامل، ولا يتطلب إنشاء حساب. الحساب المجاني يخدم أغراض المزامنة بين أجهزتك وحفظ مفضلتك وسجل النسخ بشكل آمن.',
    'help.q3': 'هل أنشأ الإنسان هذه البرومبتات؟',
    'help.a3': 'جميع البرومبتات في المكتبة صُممت واختبرت بواسطة خبراء ثم تولد إضافات جديدة آلياً وتُعرض في سنتر الإضافة بعد المراجعة.',
    'help.q4': 'هل يمكنني استخدام البرومبتات تجارياً؟',
    'help.a4': 'نعم، البرومبتات متاحة للاستخدام الشخصي والتجاري. البعض منها مخصص لحالات استخدام محددة، لذلك اقرأ الوصف والنصائح قبل الاستخدام للحصول على أفضل نتيجة.',
    'help.q5': 'كيف أنسخ برومبتاً لاستخدامه؟',
    'help.a5': 'افتح صفحة البرومبت واضغط زر "نسخ البرومبت" أو "نسخ البرومبت المخصص" بعد تعبئة المتغيرات بين الأقواس المربعة []. يمكنك أيضاً فتحه مباشرة في ChatGPT أو Claude أو Gemini بزر واحد.',
    'help.q6': 'ما هي المتغيرات بين الأقواس المربعة؟',
    'help.a6': 'المتغيرات مثل [الموضوع] أو [الجمهور] هي حقول تخصيص. املأها بتفاصيل حالتك، وسيولد لك البرومبت نسخة مخصصة جاهزة.',
    'help.q7': 'ماذا تعني إطارات العمل مثل PAS و CoT؟',
    'help.a7': 'إطار العمل هو المنهجية التي يتبعها البرومبت (مثل Role-Task-Format أو Chain of Thought). معرفتها تساعدك على توقع أسلوب الإجابة وتعديله عند الحاجة.',
    'help.q8': 'ما الفرق بين "النسخة الإنجليزية" و النسخة العربية؟',
    'help.a8': 'العديد من البرومبتات متوفرة في نسختين عبر زر التبديل عربي/English. النماذج الأجنبية غالباً تتفوق في بعض المهام بلغة إنجليزية أوضح، والنسخة الإنجليزية مصممة خصيصاً لذلك.',
    'help.q9': 'هل يمكنني التعديل على البرومبت؟',
    'help.a9': 'نعم. صفحة التفاصيل تتيح لك تعبئة المتغيرات مع معاينة مباشرة للنسخة النهائية قبل النسخ.',
    'help.q10': 'ما هي صفحة "مكتبتي"؟',
    'help.a10': 'صفحة مكتبتي تجمع مفضلتك (Star) وسجل النسخ بدقة، مع إمكانية تصديرها إلى ملفات JSON أو TXT.',
    'help.q11': 'كيف أحفظ برومبتاً في المفضلة؟',
    'help.a11': 'اضغط على أيقونة المفضلة (نجمة) الموجودة على بطاقة البرومبت أو في صفحة تفاصيله.',
    'help.q12': 'ماذا يحدث عند تسجيل الدخول؟',
    'help.a12': 'عند تسجيل الدخول بحساب مجاني، يتم دمج مفضلتك وسجل نسخك مع النسخة السحابية تلقائياً، فتحصل على نفس البيانات على أي جهاز.',
    'help.q13': 'هل سجل النسخ محدود؟',
    'help.a13': 'نعم، نحتفظ بآخر 50 نسخة حديثاً لضمان سلاسة الأداء. يمكنك دائماً تصدير السجل قبل تجاوزه.',
    'help.q14': 'ما طريقة البحث المتقدمة؟',
    'help.a14': 'استخدم شريط البحث مع تصفية حسب التصنيف، النموذج، المستوى، الوسوم، أو البرومبتات المميزة. كل الفلاتر تظهر في رابط قابل للمشاركة.',
    'help.q15': 'هل الفلاتر قابلة للمشاركة؟',
    'help.a15': 'نعم. زر "مشاركة النتائج" ينسخ رابطاً يحمل جميع الفلاتر الحالية، وعند فتحه يعيد تطبيقها تلقائياً.',
    'help.q16': 'كيف أجد برومبتاً يناسب نموذجاً معيناً؟',
    'help.a16': 'اختر النموذج (ChatGPT، Claude، Gemini، DeepSeek، Midjourney...) من قائمة التصفية، وستظهر فقط البرومبتات المتوافقة معه.',
    'help.q17': 'هل أحتاج حساباً للتصفح أو النسخ؟',
    'help.a17': 'لا. التصفح والبحث والنسخ متاحة للجميع دون تسجيل. الحساب اختياري ويستخدم فقط لمزامنة مفضلتك وسجل النسخ بين الأجهزة.',
    'help.q18': 'كيف أحمي بياناتي؟',
    'help.a18': 'كلمة المرور تُخزن بشكل مشفر (scrypt + salt) ولا نشارك أي بيانات مع أطراف ثالثة.',
    'help.q19': 'نسيت كلمة المرور، ماذا أفعل؟',
    'help.a19': 'حالياً تُدار كلمة المرور عبر التوثيق الآمن المسجل. إذا نسيتها يمكنك إنشاء حساب جديد ببريدك نفسه — بيانات مفضلتك وسجل النسخ غير مرتبطة بكلمة المرور.',
    'help.q20': 'ما أفضل نموذج لاستخدام كل برومبت؟',
    'help.a20': 'نحدد دائماً النماذج الأنسب أعلى كل برومبت. القاعدة العامة: جرب نفس البرومبت مع أكثر من نموذج واحتفظ بالأداء الأفضل.',
    'help.q21': 'كيف أطلب المزيد من البرومبتات؟',
    'help.a21': 'يمكنك اقتراح برومبتات جديدة من خلال قسم الاقتراحات في صفحة المساعدة، أو عبر قنوات التواصل.',
    'help.q22': 'هل توجد موارد للتعلّم؟',
    'help.a22': 'نعم! تفضل بزيارة صفحة "المهارات" و"التعلم" للحصول على شروحات وتقنيات صياغة البرومبت خطوة بخطوة.',
    // Locale toggle
    'locale.switchToEn': 'English',
    'locale.switchToAr': 'العربية',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.shortcuts': 'Shortcuts',
    'nav.models': 'AI Models',
    'nav.compare': 'Compare',
    'nav.learn': 'Learn',
    'nav.skills': 'Skills',
    'nav.trending': 'Trending',
    'nav.blog': 'Blog',
    'nav.resources': 'Templates',
    'nav.cases': 'Case Studies',
    'nav.myLibrary': 'My Library',
    'nav.help': 'Help',
    // Mobile
    'mobile.shortcutsTitle': 'AI Shortcuts & Commands',
    'mobile.modelsTitle': 'Browse AI Models & Compare',
    'mobile.learnTitle': 'Learn Advanced Prompting',
    'mobile.skillsTitle': 'Domain-Specific AI Skills',
    'mobile.trendingTitle': 'Trending & Statistics',
    'mobile.blogTitle': 'Blog & Articles',
    'mobile.resourcesTitle': 'Downloadable Template Packs',
    'mobile.casesTitle': 'Real-World Case Studies',
    'mobile.myTitle': 'My Library (Favorites & History)',
    'mobile.helpTitle': 'Help & FAQ',
    'mobile.navShortcuts': 'Commands',
    'mobile.navModels': 'Models',
    'mobile.navMy': 'Library',
    'mobile.navHelp': 'Help',
    // Help page
    'help.badge': 'Help Center',
    'help.title': 'How can we help you today?',
    'help.subtitle': 'Detailed answers about search, sync, quality and usage. Choose a category and explore the questions that matter to you.',
    'help.faqCount': '{count} questions',
    'help.quickLinks': 'Quick Links',
    'help.notFoundTitle': "Can't find your answer?",
    'help.notFoundDesc': 'Suggest new prompts or contact us — we keep the help center updated based on user feedback.',
    'help.notFoundBilingual': 'Bilingual EN/AR library',
    'help.notFoundExport': 'One-click favorites export',
    'help.notFoundSync': 'Sync favorites across devices',
    // Blog
    'blog.badge': 'PromptHub Blog',
    'blog.title': 'Articles & Practical Guides',
    'blog.subtitle': 'A comprehensive Arabic guide to prompt engineering: frameworks, marketing, image generation, summarization, and common mistakes.',
    'blog.readMore': 'Read More',
    'blog.backToBlog': 'Back to Blog',
    'blog.practicalTitle': 'Try it Hands-On',
    'blog.practicalDesc': 'Every article maps directly to ready-made prompts in the library.',
    'blog.btnLearn': 'Browse Learning Guides',
    'blog.btnTrending': 'See Trending Now',
    // Resources
    'resources.badge': 'Downloadable Resources',
    'resources.title': 'Ready-Made Prompt Template Packs',
    'resources.subtitle': '30+ professional prompt templates organized by domain. Download any pack as TXT or JSON and use it in any AI tool instantly.',
    'resources.downloadAll': 'Download All Packs (Single File)',
    'resources.downloadTxt': 'Download TXT',
    'resources.downloadJson': 'Download JSON',
    'resources.preview': 'Preview Templates',
    'resources.hidePreview': 'Hide Template Preview',
    'resources.note': 'All templates also exist in the library with live variable substitution. We recommend copying directly from the prompt page for the best custom experience; downloaded files are great for offline use and team collaboration.',
    // Case studies
    'cases.badge': 'Real Case Studies',
    'cases.title': 'How People Actually Use Prompts',
    'cases.subtitle': 'Practical stories showing how the library prompts solve real problems: the challenge, the prompt used, and the measured outcome.',
    'cases.problem': 'Problem',
    'cases.goal': 'Goal & Approach',
    'cases.promptUsed': 'Prompt Used (Summary)',
    'cases.result': 'Result',
    'cases.tryIt': 'Try it yourself with template packs',
    'cases.disclaimer': 'These stories are synthesized from real, documented prompt engineering practices; results vary by domain and customization quality.',
    // Footer
    'footer.prompts': 'Prompts & Templates',
    'footer.categories': 'Categories & Library',
    'footer.resources': 'Resources & Tools',
    'footer.promptsLabel': 'Prompts by Category',
    'footer.compareLabel': 'AI Model Comparison',
    'footer.learnLabel': 'Learn Prompt Engineering',
    'footer.skillsLabel': 'AI Skills',
    'footer.trendingLabel': 'Statistics & Trending',
    'footer.shortcutsLabel': 'AI Shortcuts & Commands',
    'footer.docsLabel': 'Developer API Docs',
    'footer.helpLabel': 'Help & FAQ',
    'footer.blogLabel': 'Blog & Articles',
    'footer.resourcesLabel': 'Downloadable Template Packs',
    'footer.casesLabel': 'Real-World Case Studies',
    'footer.aiLabel': 'AI Tools',
    'footer.promptsApi': 'Prompts API',
    'footer.fullApi': 'Full API',
    'footer.directApi': 'Direct Prompts API',
    'footer.sitemap': 'Sitemap',
    'footer.copy': '© PromptHub — All rights reserved',
    // Help FAQ categories
    'help.catBasics': 'Platform Basics',
    'help.catUsage': 'How to Use Prompts',
    'help.catLibrary': 'Library, Favorites & Persistence',
    'help.catSearch': 'Search & Filtering',
    'help.catAccount': 'Account & Sync',
    'help.catAi': 'AI & Quality',
    // Help FAQ questions
    'help.q1': 'What is PromptHub?',
    'help.a1': 'A specialized Arabic library of professional AI prompts. We offer hundreds of ready-to-use templates across 30+ categories covering marketing, coding, image generation, business, education and more.',
    'help.q2': 'Is the platform completely free?',
    'help.a2': 'Yes. Browsing, searching, and copying prompts are completely free with no account required. A free account is optional and only used to sync your favorites and copy history across devices.',
    'help.q3': 'Are these prompts made by humans?',
    'help.a3': 'All prompts in the library are designed and tested by experts, then new additions are generated automatically and reviewed before publication.',
    'help.q4': 'Can I use the prompts commercially?',
    'help.a4': 'Yes, prompts are available for personal and commercial use. Some are designed for specific use cases, so read the description and tips before using for best results.',
    'help.q5': 'How do I copy a prompt for use?',
    'help.a5': 'Open the prompt page and click "Copy Prompt" or "Copy Custom Prompt" after filling in the variables. You can also open it directly in ChatGPT, Claude, or Gemini with one click.',
    'help.q6': 'What are the square bracket variables?',
    'help.a6': 'Variables like [Topic] or [Audience] are customization fields. Fill them with your specific details and the prompt will generate a ready-to-use customized version.',
    'help.q7': 'What do frameworks like PAS and CoT mean?',
    'help.a7': 'A framework is the methodology a prompt follows (like Role-Task-Format or Chain of Thought). Knowing them helps you predict and customize the response style.',
    'help.q8': 'What is the difference between the English and Arabic versions?',
    'help.a8': 'Many prompts are available in two versions via the Arabic/English toggle. Foreign models often perform better with clearer English, and the English version is designed for that.',
    'help.q9': 'Can I modify the prompt?',
    'help.a9': 'Yes. The detail page lets you fill in variables with a live preview of the final version before copying.',
    'help.q10': 'What is "My Library"?',
    'help.a10': 'My Library collects your favorites (Star) and copy history with export to JSON or TXT files.',
    'help.q11': 'How do I save a prompt to favorites?',
    'help.a11': 'Click the favorite icon (star) on the prompt card or its detail page.',
    'help.q12': 'What happens when I log in?',
    'help.a12': 'When you log in with a free account, your favorites and copy history are automatically merged with the cloud version, giving you the same data on any device.',
    'help.q13': 'Is the copy history limited?',
    'help.a13': 'Yes, we keep the last 50 recent copies to ensure smooth performance. You can always export the history before it overflows.',
    'help.q14': 'What is the advanced search?',
    'help.a14': 'Use the search bar with filters by category, model, difficulty level, tags, or featured prompts. All filters appear in a shareable link.',
    'help.q15': 'Are filters shareable?',
    'help.a15': 'Yes. The "Share Results" button copies a link containing all current filters, and opening it automatically reapplies them.',
    'help.q16': 'How do I find prompts for a specific model?',
    'help.a16': 'Select the model (ChatGPT, Claude, Gemini, DeepSeek, Midjourney...) from the filter menu, and only compatible prompts will appear.',
    'help.q17': 'Do I need an account to browse or copy?',
    'help.a17': 'No. Browsing, searching, and copying are available to everyone without registration. An account is optional, used only to sync favorites and copy history across devices.',
    'help.q18': 'How is my data protected?',
    'help.a18': 'Passwords are stored with encryption (scrypt + salt) and we never share data with third parties.',
    'help.q19': 'I forgot my password, what should I do?',
    'help.a19': 'Currently passwords are managed via secure registration. If you forgot it, you can create a new account with the same email — your favorites and history are not tied to the password.',
    'help.q20': 'What is the best model for each prompt?',
    'help.a20': 'We always specify the best-suited models above each prompt. The general rule: try the same prompt with multiple models and keep the best performer.',
    'help.q21': 'How do I request more prompts?',
    'help.a21': 'You can suggest new prompts through the help page suggestions section or via our communication channels.',
    'help.q22': 'Are there learning resources?',
    'help.a22': 'Yes! Visit the "Skills" and "Learn" pages for step-by-step prompt engineering guides and techniques.',
    // Locale toggle
    'locale.switchToEn': 'English',
    'locale.switchToAr': 'العربية',
  }
};

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, count?: number) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

function resolveCount(template: string, count?: number): string {
  if (count === undefined) return template;
  return template.replace('{count}', String(count));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ph_locale');
      if (stored === 'ar' || stored === 'en') setLocaleState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
    try { localStorage.setItem('ph_locale', locale); } catch {}
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: string, count?: number) => {
      const val = TRANSLATIONS[locale]?.[key] || TRANSLATIONS.ar[key] || key;
      return resolveCount(val, count);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}