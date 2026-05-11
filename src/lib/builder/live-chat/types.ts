export type MessageRole = 'visitor' | 'admin' | 'system';

export interface ChatMessage {
  messageId: string;
  conversationId: string;
  role: MessageRole;
  body: string;
  at: string;
  authorLabel?: string;
}

export interface ChatConversation {
  conversationId: string;
  /** Token the visitor uses on subsequent send/stream calls. Never exposed in admin payloads. */
  visitorToken: string;
  /** Optional visitor display name + email for follow-up. */
  visitorName?: string;
  visitorEmail?: string;
  pagePath?: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  unreadByAdmin: number;
}
