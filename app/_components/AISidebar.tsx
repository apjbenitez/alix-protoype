"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Ghost, Tag, Textarea } from "@alixpartners/ui-components";
import { SUGGESTED_PROMPTS, mockAIResponse } from "../_mock";
import type { ChatMessage } from "../_types";

interface AISidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AISidebar({ open, onClose }: AISidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi Julian — EOD reconciliation finished at 4:18 PM. Ask me about P&L, positions, trades, compliance, or allocations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const ta = document.querySelector<HTMLTextAreaElement>(".ai-sidebar__input-field textarea");
      ta?.focus();
    }, 220);
    return () => clearTimeout(t);
  }, [open]);

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || pending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);
    // Vary the "thinking" delay with text length so it feels natural without using a non-deterministic source.
    const delay = Math.min(2000, 550 + text.length * 12);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: mockAIResponse(text) }]);
      setPending(false);
    }, delay);
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText(input);
    }
  };

  return (
    <>
      <div className={"ai-backdrop " + (open ? "ai-backdrop--open" : "")} onClick={onClose} aria-hidden />
      <aside className={"ai-sidebar " + (open ? "ai-sidebar--open" : "")} aria-label="AI trading assistant" aria-hidden={!open}>
        <div className="ai-sidebar__head">
          <div className="ai-sidebar__title">
            <div className="ai-sidebar__avatar">AI</div>
            <div>
              <strong>Trading Assistant</strong>
              <div className="ai-sidebar__sub">Mocked LLM · prototype only</div>
            </div>
          </div>
          <span className="ai-sidebar__close-wrap" onClick={onClose}>
            <Ghost variant="default" icon="ap-icon-close" noIcon={false} aria-label="Close AI assistant" />
          </span>
        </div>

        <div className="ai-sidebar__messages" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={"ai-msg ai-msg--" + m.role}>
              <div className="ai-msg__bubble">{m.text}</div>
            </div>
          ))}
          {pending && (
            <div className="ai-msg ai-msg--assistant">
              <div className="ai-msg__bubble ai-msg__bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          {messages.length <= 1 && !pending && (
            <div className="ai-suggestions">
              {SUGGESTED_PROMPTS.map((p) => (
                <span key={p} className="ai-suggestion-wrap" onClick={() => sendText(p)}>
                  <Tag type="basic" structure="border" color="gray" size="sm" label={p} noIcon />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="ai-sidebar__inputWrap">
          <div className="ai-sidebar__input">
            <div className="ai-sidebar__input-field">
              <Textarea
                label=""
                value={input}
                onChange={setInput}
                placeholder="Ask about positions, P&L, NVDA, compliance…"
                rows={2}
                fullWidth
                resize="none"
                disabled={pending}
                onKeyDown={onKey}
              />
            </div>
            <Button
              type="primary"
              size="md"
              icon="ap-icon-right"
              loading={pending}
              disabled={!input.trim() || pending}
              onClick={() => sendText(input)}
              aria-label="Send"
            />
          </div>
          <div className="ai-sidebar__hint">Enter to send · Shift+Enter for a new line</div>
        </div>
      </aside>
    </>
  );
}
