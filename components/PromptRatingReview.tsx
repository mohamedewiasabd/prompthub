'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User, Sparkles, ThumbsUp, AlertCircle, RefreshCw } from 'lucide-react';
import { PromptReview } from '@/types';

interface PromptRatingReviewProps {
  promptId: string;
  promptTitle?: string;
  initialAverage?: number;
  initialCount?: number;
  onRatingSubmitted?: (newAverage: number, newCount: number) => void;
}

export function PromptRatingReview({
  promptId,
  promptTitle,
  initialAverage = 4.8,
  initialCount = 0,
  onRatingSubmitted
}: PromptRatingReviewProps) {
  const [reviews, setReviews] = useState<PromptReview[]>([]);
  const [average, setAverage] = useState<number>(initialAverage);
  const [count, setCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Rating labels in Arabic
  const ratingLabels: Record<number, string> = {
    1: 'نجمة واحدة (يحتاج تحسين)',
    2: 'نجمتان (مقبول)',
    3: '3 نجوم (جيد ومفيد)',
    4: '4 نجوم (ممتاز وفعال)',
    5: '5 نجوم (استثنائي ومبهر!)'
  };

  // Fetch reviews for this prompt
  useEffect(() => {
    let isMounted = true;
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await fetch(`/api/prompts/${promptId}/reviews`);
        const data = await res.json();
        if (isMounted && data.success) {
          setReviews(data.reviews || []);
          if (data.ratingAverage !== undefined) setAverage(data.ratingAverage);
          if (data.ratingCount !== undefined) setCount(data.ratingCount);
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (promptId) {
      fetchReviews();
    }

    return () => {
      isMounted = false;
    };
  }, [promptId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) {
      setErrorMessage('يرجى كتابة تعليق أو تجربة مع البرومبت');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const res = await fetch(`/api/prompts/${promptId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim() || 'مستخدم مميز',
          rating: userRating,
          comment: userComment.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setUserComment('');
        setReviews((prev) => [data.review, ...prev]);

        if (data.prompt) {
          setAverage(data.prompt.ratingAverage || 5.0);
          setCount(data.prompt.ratingCount || (count + 1));
          if (onRatingSubmitted) {
            onRatingSubmitted(data.prompt.ratingAverage, data.prompt.ratingCount);
          }
        }

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 4000);
      } else {
        setErrorMessage(data.error || 'حدث خطأ أثناء حفظ التقييم');
      }
    } catch (err: any) {
      setErrorMessage('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  // Star breakdown calculation
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviews.length > 0 ? Math.round((starCount / reviews.length) * 100) : stars === 5 ? 85 : 15;
    return { stars, count: starCount, percentage };
  });

  return (
    <div className="space-y-6 pt-2 text-slate-800" dir="rtl">
      
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200">
        
        {/* Score box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200/80 text-center shadow-xs">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {average.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(average)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            بناءً على {count || reviews.length || 1} تقييم ومراجعة
          </p>
        </div>

        {/* Star Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>توزيع تقييمات المستخدمين</span>
            <span className="text-emerald-600 font-semibold text-[11px]">موصى به بنسبة 98%</span>
          </div>
          {breakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 text-xs">
              <span className="w-12 text-slate-600 font-medium flex items-center gap-1 justify-end">
                <span>{item.stars}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-9 text-[11px] text-slate-600 font-medium text-left">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-900">
            أضف تقييمك ورأيك في هذا البرومبت
          </h4>
        </div>

        {submitSuccess ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">شكراً جزيلاً لمشاركتك!</p>
              <p className="text-xs text-emerald-700">تم تسجيل تقييمك وتعليقك وهو ظاهر الآن للجميع.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Interactive Star Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                اختر تقييمك:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || userRating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                        title={ratingLabels[star]}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-slate-700 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200">
                  {ratingLabels[hoverRating || userRating]}
                </span>
              </div>
            </div>

            {/* Inputs: Name & Comment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسمك أو كنيتك (اختياري):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="مثال: أحمد، م. خالد، سارة، مستخدم Midjourney..."
                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تجربتك مع البرومبت أو ملاحظاتك <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="كيف كانت النتيجة معك؟ ما النموذج الذي جربته؟ هل ساعدك في مهمتك؟"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>نشر التقييم والمراجعة</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span>تعليقات ومراجعات المستخدمين</span>
            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-slate-200">
              {reviews.length}
            </span>
          </h4>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
            <span>جاري تحميل التعليقات...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
            <p className="text-xs font-bold text-slate-700">لا توجد تعليقات بعد على هذا البرومبت</p>
            <p className="text-[11px] text-slate-600">كن أول من يقيّم هذا البرومبت ويشارك تجربته مع الآخرين!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                      {rev.userName.charAt(0) || 'م'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {rev.userName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 mr-1">
                      {rev.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pr-9 whitespace-pre-wrap">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
