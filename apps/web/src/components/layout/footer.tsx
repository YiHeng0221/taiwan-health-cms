/**
 * @fileoverview Footer Component
 */

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">台灣健康管理</h3>
            <p className="text-sm">
              專業健康管理服務，為您打造最佳健康方案。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">快速連結</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-primary-400">
                  服務項目
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-primary-400">
                  運動專欄
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">服務項目</h4>
            <ul className="space-y-2 text-sm">
              <li>健康檢查</li>
              <li>運動指導</li>
              <li>營養諮詢</li>
              <li>健康講座</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">聯絡資訊</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>02-1234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@taiwanhealth.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>台北市信義區健康路100號</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} 台灣健康管理. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
