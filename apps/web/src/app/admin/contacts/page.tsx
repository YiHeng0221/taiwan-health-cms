/**
 * @fileoverview Admin Contact Messages Page
 */

'use client';

import { useState } from 'react';
import {
  useAdminContacts,
  useMarkContactRead,
  useDeleteContact,
} from '@/hooks/use-contacts';
import { formatDate } from '@/lib/utils';
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Phone,
} from 'lucide-react';

export default function AdminContactsPage() {
  const { data: contacts, isLoading } = useAdminContacts();
  const markRead = useMarkContactRead();
  const deleteContact = useDeleteContact();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleMarkRead = async (id: string) => {
    await markRead.mutateAsync(id);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`確定要刪除來自「${name}」的訊息嗎？`)) {
      await deleteContact.mutateAsync(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const unreadCount = contacts?.filter((c) => !c.isRead).length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">聯絡訊息</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} 則未讀訊息
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !contacts?.length ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">目前沒有聯絡訊息</p>
          </div>
        ) : (
          <div className="divide-y">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`transition-colors ${!contact.isRead ? 'bg-blue-50/50' : ''
                  }`}
              >
                {/* Row summary */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(contact.id)}
                >
                  {/* Read status icon */}
                  <div className="flex-shrink-0">
                    {contact.isRead ? (
                      <MailOpen className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Mail className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  {/* Sender info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-medium truncate ${!contact.isRead ? 'text-gray-900' : 'text-gray-600'
                          }`}
                      >
                        {contact.name}
                      </p>
                      {!contact.isRead && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.subject}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-400 flex-shrink-0">
                    {formatDate(contact.createdAt)}
                  </div>

                  {/* Expand icon */}
                  <div className="flex-shrink-0">
                    {expandedId === contact.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === contact.id && (
                  <div className="px-6 pb-4 pl-16">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {/* Contact info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          <strong>Email:</strong> {contact.email}
                        </span>
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                        )}
                      </div>

                      {/* Subject */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          主旨：{contact.subject}
                        </p>
                      </div>

                      {/* Message body */}
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {contact.message}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                        {!contact.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(contact.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <MailOpen className="h-3.5 w-3.5" />
                            標記已讀
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact.id, contact.name);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
