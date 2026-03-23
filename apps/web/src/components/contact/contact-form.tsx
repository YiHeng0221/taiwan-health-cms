/**
 * @fileoverview Contact Form Component
 * 
 * Contact form using React Hook Form + Zod validation.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle } from 'lucide-react';

// Form validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(1, '請輸入姓名').max(50, '姓名最多50個字元'),
  email: z.string().min(1, '請輸入電子郵件').email('請輸入有效的電子郵件'),
  phone: z.string().max(20, '電話最多20個字元').optional(),
  subject: z.string().min(1, '請輸入主旨').max(100, '主旨最多100個字元'),
  message: z.string().min(1, '請輸入訊息內容').max(2000, '訊息最多2000個字元'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => api.post('/contact', data),
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-brand-yellow mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">感謝您的來信！</h3>
        <p className="text-gray-600 mb-6">我們已收到您的訊息，會盡快回覆您。</p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-outline"
        >
          發送新訊息
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={cn('input', errors.name && 'input-error')}
            placeholder="請輸入您的姓名"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            電子郵件 <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={cn('input', errors.email && 'input-error')}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            電話
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className={cn('input', errors.phone && 'input-error')}
            placeholder="0912-345-678"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            主旨 <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            className={cn('input', errors.subject && 'input-error')}
            placeholder="請輸入主旨"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          訊息內容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className={cn('input resize-none', errors.message && 'input-error')}
          placeholder="請輸入您想詢問的內容..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Error Message */}
      {mutation.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          發送失敗，請稍後再試。
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-primary w-full"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            發送中...
          </>
        ) : (
          <span className='text-white'>發送訊息</span>
        )}
      </button>
    </form>
  );
}
