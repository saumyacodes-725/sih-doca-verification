import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPageHelp, searchFaq } from '../../data/helpContent';

function makeMessage(from, content) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, from, content };
}

export default function HelpChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lastGuidedPath, setLastGuidedPath] = useState(null);
  const scrollRef = useRef(null);

  const pageHelp = getPageHelp(location.pathname);

  // Greet + auto-post contextual guidance for the current screen whenever the
  // panel is opened, or the user navigates to a new page while it's open.
  useEffect(() => {
    if (!open) return;
    if (lastGuidedPath === location.pathname) return;

    setLastGuidedPath(location.pathname);
    setMessages((prev) => {
      const intro = prev.length === 0
        ? [makeMessage('bot', `Hi ${currentUser?.name ? currentUser.name.split(' ')[0] : 'there'}! I'm the Trust Scale Help Assistant. Ask me anything, or read the tip below for this screen.`)]
        : [];
      return [...prev, ...intro, makeMessage('bot', { type: 'page-guide', help: pageHelp })];
    });
  }, [open, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleAsk = (rawQuery) => {
    const query = (rawQuery ?? input).trim();
    if (!query) return;

    setMessages((prev) => [...prev, makeMessage('user', query)]);
    setInput('');

    const matches = searchFaq(query);
    setTimeout(() => {
      if (matches.length === 0) {
        setMessages((prev) => [
          ...prev,
          makeMessage('bot', {
            type: 'text',
            text: "I couldn't find a specific answer for that. Try words like \"register\", \"apply\", \"certificate\", \"inspection\", or \"verify\" — or use the quick topics below."
          })
        ]);
      } else {
        setMessages((prev) => [...prev, makeMessage('bot', { type: 'faq-results', results: matches })]);
      }
    }, 150);
  };

  const handleGoto = (path) => {
    navigate(path);
    setOpen(true);
  };

  const quickTopics = [
    'How do I register an instrument?',
    'How do I apply for verification?',
    'How do I verify a certificate?',
    'How does LMO inspection work?'
  ];

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 1100 }}>
      {open && (
        <div
          className="card shadow-lg border-0 mb-2"
          style={{ width: '360px', maxWidth: 'calc(100vw - 2rem)', height: '480px', maxHeight: 'calc(100vh - 7rem)' }}
        >
          <div className="card-header bg-navy-dark text-white d-flex align-items-center justify-content-between py-2 px-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-headset fs-5 text-warning"></i>
              <div>
                <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Trust Scale Help Assistant</div>
                <div className="text-white-50" style={{ fontSize: '0.68rem' }}>Guided help for this portal</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-sm btn-outline-light border-0 py-0 px-1"
              aria-label="Close help chat"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div ref={scrollRef} className="card-body overflow-auto d-flex flex-column gap-2 bg-light" style={{ fontSize: '0.85rem' }}>
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} onGoto={handleGoto} onAsk={handleAsk} />
            ))}
          </div>

          <div className="card-footer bg-white p-2">
            <div className="d-flex flex-wrap gap-1 mb-2">
              {quickTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => handleAsk(t)}
                  className="btn btn-sm btn-outline-secondary py-0 px-2"
                  style={{ fontSize: '0.7rem' }}
                >
                  {t}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="d-flex gap-2"
            >
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ask about this portal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-primary px-3">
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center ms-auto"
        style={{ width: '58px', height: '58px', fontSize: '1.5rem' }}
        title="Help Assistant"
        aria-label="Open help assistant"
      >
        <i className={`bi ${open ? 'bi-chevron-down' : 'bi-question-lg'}`}></i>
      </button>
    </div>
  );
}

function ChatBubble({ message, onGoto, onAsk }) {
  const isBot = message.from === 'bot';

  return (
    <div className={`d-flex ${isBot ? 'justify-content-start' : 'justify-content-end'}`}>
      <div
        className={`rounded-3 px-3 py-2 shadow-sm ${isBot ? 'bg-white border' : 'bg-primary text-white'}`}
        style={{ maxWidth: '88%' }}
      >
        {typeof message.content === 'string' ? (
          <div>{message.content}</div>
        ) : (
          <BubbleContent content={message.content} onGoto={onGoto} onAsk={onAsk} />
        )}
      </div>
    </div>
  );
}

function BubbleContent({ content, onGoto, onAsk }) {
  if (content.type === 'text') {
    return <div>{content.text}</div>;
  }

  if (content.type === 'page-guide') {
    const { help } = content;
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className={`bi ${help.icon} text-primary`}></i>
          <span className="fw-bold">{help.title}</span>
        </div>
        <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>{help.summary}</div>
        {help.steps?.length > 0 && (
          <ol className="ps-3 mb-2" style={{ fontSize: '0.8rem' }}>
            {help.steps.map((s, i) => (
              <li key={i} className="mb-1">{s}</li>
            ))}
          </ol>
        )}
        {help.links?.length > 0 && (
          <div className="d-flex flex-wrap gap-1">
            {help.links.map((l) => (
              <button
                key={l.path}
                onClick={() => onGoto(l.path)}
                className="btn btn-sm btn-outline-primary py-0 px-2"
                style={{ fontSize: '0.72rem' }}
              >
                <i className="bi bi-arrow-right-short"></i> {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (content.type === 'faq-results') {
    return (
      <div className="d-flex flex-column gap-2">
        {content.results.map((r) => (
          <div key={r.question}>
            <div className="fw-bold" style={{ fontSize: '0.82rem' }}>{r.question}</div>
            <div style={{ fontSize: '0.8rem' }}>{r.answer}</div>
            {r.links?.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-1">
                {r.links.map((l) => (
                  <button
                    key={l.path}
                    onClick={() => onGoto(l.path)}
                    className="btn btn-sm btn-outline-primary py-0 px-2"
                    style={{ fontSize: '0.72rem' }}
                  >
                    <i className="bi bi-arrow-right-short"></i> {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
