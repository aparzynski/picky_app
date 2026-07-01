'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBar } from '@/components/StatusBar';
import { EarlChatHeader } from '@/components/EarlChatHeader';
import { EarlChatInputBar } from '@/components/EarlChatInputBar';
import { ChatBubble } from '@/components/ChatBubble';

type ApiMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatEntry = {
  id: string;
  role: 'user' | 'earl';
  text?: string;
  recipeId?: string;
  isTyping?: boolean;
  timestamp: string;
};

const INITIAL_GREETING = "Hi! I'm Earl, your family's meal assistant. What can I help you with today?";

const SUGGESTED_CHIPS = [
  "What should I make tonight?",
  "Quick dinner for Lily",
  "Something Mia can eat",
  "Add pantry staples to grocery list",
];

const SESSION_KEY_ENTRIES = 'earl_chat_entries';
const SESSION_KEY_API = 'earl_chat_api_messages';
const SESSION_KEY_CHIPS = 'earl_chat_chips_visible';

const INITIAL_ENTRIES: ChatEntry[] = [
  {
    id: 'greeting',
    role: 'earl',
    text: INITIAL_GREETING,
    timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
  },
];

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function EarlPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [apiMessages, setApiMessages] = useState<ApiMessage[]>([]);
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>(INITIAL_ENTRIES);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Hydrate from sessionStorage on first mount (client-only)
  useEffect(() => {
    setChatEntries(readSession(SESSION_KEY_ENTRIES, INITIAL_ENTRIES));
    setApiMessages(readSession(SESSION_KEY_API, []));
    setChipsVisible(readSession(SESSION_KEY_CHIPS, true));
    setHydrated(true);
  }, []);

  // Persist to sessionStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(SESSION_KEY_ENTRIES, JSON.stringify(chatEntries));
      sessionStorage.setItem(SESSION_KEY_API, JSON.stringify(apiMessages));
      sessionStorage.setItem(SESSION_KEY_CHIPS, JSON.stringify(chipsVisible));
    } catch { /* quota exceeded — silently ignore */ }
  }, [hydrated, chatEntries, apiMessages, chipsVisible]);

  // Scroll to bottom whenever entries change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatEntries]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInput('');
    setChipsVisible(false);
    setErrorMsg(null);

    const userEntry: ChatEntry = {
      id: makeId(),
      role: 'user',
      text: userText,
      timestamp: formatTime(new Date()),
    };

    // Append typing indicator
    const typingId = makeId();
    const typingEntry: ChatEntry = {
      id: typingId,
      role: 'earl',
      isTyping: true,
      timestamp: formatTime(new Date()),
    };

    setChatEntries((prev) => [...prev, userEntry, typingEntry]);
    setIsLoading(true);

    const nextMessages: ApiMessage[] = [
      ...apiMessages,
      { role: 'user', content: userText },
    ];

    try {
      const res = await fetch('/api/earl', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Earl had trouble responding. Please try again.');
      }

      const { reply, recipeId } = data as { reply: string; recipeId?: string };

      setApiMessages([
        ...nextMessages,
        { role: 'assistant', content: reply },
      ]);

      const earlEntry: ChatEntry = {
        id: makeId(),
        role: 'earl',
        text: reply,
        recipeId,
        timestamp: formatTime(new Date()),
      };

      setChatEntries((prev) => prev.filter((e) => e.id !== typingId).concat(earlEntry));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Earl had trouble responding. Please try again.';
      setErrorMsg(msg);
      setChatEntries((prev) => prev.filter((e) => e.id !== typingId));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, apiMessages]);

  const handleChipClick = (label: string) => {
    sendMessage(label);
  };

  if (!hydrated) return null;

  return (
    <div className="flex flex-col h-dvh bg-neutral-primary overflow-hidden">
      <StatusBar />

      <EarlChatHeader
        onBack={() => router.back()}
      />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4 max-w-[432px] mx-auto">
          {chatEntries.map((entry, idx) => {
            const isFirst = idx === 0;
            const showChips =
              isFirst &&
              entry.role === 'earl' &&
              !entry.isTyping &&
              chipsVisible;

            return (
              <ChatBubble
                key={entry.id}
                earlMessage={entry.role === 'earl'}
                text={entry.text}
                recipeId={entry.recipeId}
                isTyping={entry.isTyping}
                timestamp={entry.timestamp}
                chips={showChips ? SUGGESTED_CHIPS.map((label) => ({
                  label,
                  onClick: () => handleChipClick(label),
                })) : undefined}
              />
            );
          })}

          {/* Error banner */}
          {errorMsg && (
            <div className="rounded-xl bg-[#FFF0F0] border border-[#FFCCCC] px-4 py-3">
              <p className="font-picky-sans font-normal text-[13px] leading-[1.5] text-[#CC0000]">
                {errorMsg}
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <EarlChatInputBar
        value={input}
        onChange={setInput}
        onSend={() => sendMessage(input)}
        disabled={isLoading}
      />
    </div>
  );
}
