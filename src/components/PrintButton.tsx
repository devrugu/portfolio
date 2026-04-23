"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: '#f0a500',
        color: '#111',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '13px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      ⬇ Download PDF
    </button>
  );
}