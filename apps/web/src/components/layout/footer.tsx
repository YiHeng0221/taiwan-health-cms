/**
 * @fileoverview Footer Component
 *
 * Server component — fetches site settings from backend for SEO-friendly rendering.
 * Falls back to constants if backend is unavailable.
 */

import { getSiteSettings } from '@/lib/get-settings';
import { COMPANY_INFO } from '@/lib/constants';

export async function Footer() {
  const settings = await getSiteSettings();

  const contact = settings?.contact;
  const social = settings?.social;
  const footer = settings?.footer;
  const email = contact?.email || COMPANY_INFO.email;

  // Collect social links that have a URL
  const socialLinks = [
    social?.line && { label: 'LINE', ...social.line },
    social?.facebook && { label: 'Facebook', ...social.facebook },
    social?.instagram && { label: 'Instagram', ...social.instagram },
    social?.youtube && { label: 'YouTube', ...social.youtube },
  ].filter(Boolean) as { label: string; name: string; url: string }[];

  const copyright =
    footer?.copyright ||
    `Copyright © ${new Date().getFullYear()} ${COMPANY_INFO.legalName} All rights reserved.`;

  return (
    <footer className="bg-brand-brown text-brand-cream">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">{COMPANY_INFO.name}</h3>
            <p className="text-lg font-semibold">{COMPANY_INFO.nameEn}</p>
            <p className="text-sm opacity-80">{COMPANY_INFO.slogan}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">聯絡我們</h4>
            <ul className="space-y-1 text-sm">
              {email && (
                <li>
                  電子信箱：
                  <a
                    href={`mailto:${email}`}
                    className="underline hover:opacity-80 transition-opacity"
                  >
                    {email}
                  </a>
                </li>
              )}
              {contact?.phone && (
                <li>
                  電話：
                  <a
                    href={`tel:${contact.phone}`}
                    className="underline hover:opacity-80 transition-opacity"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li>地址：{contact.address}</li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">社群媒體</h4>
            <ul className="space-y-1 text-sm">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <li key={link.label}>
                    {link.label}：
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80 transition-opacity"
                    >
                      {link.name || link.url}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    LINE：
                    <a
                      href={COMPANY_INFO.lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80 transition-opacity"
                    >
                      {COMPANY_INFO.lineUrl}
                    </a>
                  </li>
                  <li>
                    Facebook：
                    <a
                      href={COMPANY_INFO.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80 transition-opacity"
                    >
                      {COMPANY_INFO.facebookName}
                    </a>
                  </li>
                  <li>
                    Instagram：
                    <a
                      href={COMPANY_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-80 transition-opacity"
                    >
                      {COMPANY_INFO.instagramHandle}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-cream/20 mt-8 pt-8 text-sm opacity-60">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
