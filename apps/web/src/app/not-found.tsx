import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-brand-yellow mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          找不到頁面
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          您尋找的頁面不存在或已被移除。
        </p>
        <Link href="/" className="btn-primary inline-flex">
          返回首頁
        </Link>
      </div>
    </div>
  );
}
