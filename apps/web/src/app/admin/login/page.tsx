/**
 * @fileoverview Admin Login Page
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { adminPath } from '@/lib/admin-path';

const loginSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件'),
  password: z.string().min(6, '密碼至少需要6個字元'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login.mutateAsync(data);
      router.push(adminPath());
    } catch (err) {
      setError('帳號或密碼錯誤');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-brown">樂頤生健康管理</h1>
            <p className="text-gray-500 mt-2">管理後台登入</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                電子郵件
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={cn('input', errors.email && 'input-error')}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                密碼
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={cn('input', errors.password && 'input-error')}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="btn-primary w-full"
            >
              {login.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  登入中...
                </>
              ) : (
                '登入'
              )}
            </button>
          </form>

          {/* Demo credentials — only in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">測試帳號：</p>
              <p>Email: admin@leyisheng.com</p>
              <p>Password: admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
