const ADMIN_PREFIX = process.env.NEXT_PUBLIC_ADMIN_PREFIX || 'admin';

export function adminPath(subPath = '') {
  const base = `/${ADMIN_PREFIX}`;
  if (!subPath) return base;
  return `${base}${subPath.startsWith('/') ? subPath : `/${subPath}`}`;
}
