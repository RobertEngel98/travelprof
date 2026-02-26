"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import "./ebook.css";

export default function EbookReader({ content }: { content: string }) {
  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Top bar - hidden in print */}
      <div className="ebook-toolbar">
        <Link
          href="/dashboard/produkte"
          style={{
            color: "var(--text-sub)",
            textDecoration: "none",
            fontSize: "0.88rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Zurück zu Produkte
        </Link>
        <button
          onClick={handlePrint}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-soft)",
            background: "var(--bg-warm)",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--text-main)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Als PDF speichern
        </button>
      </div>

      {/* E-Book content */}
      <article className="ebook-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="ebook-h1">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="ebook-h2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="ebook-h3">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="ebook-p">{children}</p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="ebook-tip">{children}</blockquote>
            ),
            table: ({ children }) => (
              <div className="ebook-table-wrap">
                <table className="ebook-table">{children}</table>
              </div>
            ),
            ul: ({ children }) => (
              <ul className="ebook-list">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="ebook-list ebook-list-ol">{children}</ol>
            ),
            hr: () => <hr className="ebook-hr" />,
            strong: ({ children }) => (
              <strong style={{ fontWeight: 700 }}>{children}</strong>
            ),
            a: ({ href, children }) => (
              <a href={href ?? "#"} style={{ color: "var(--accent)", textDecoration: "underline" }}>
                {children}
              </a>
            ),
          }}
        />
      </article>
    </>
  );
}
