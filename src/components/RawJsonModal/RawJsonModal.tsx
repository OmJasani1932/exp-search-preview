import React, { useEffect } from 'react';
import styles from './RawJsonModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  data: unknown;
}

export const RawJsonModal: React.FC<Props> = ({ open, onClose, data }) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>{'{ }'}</span>
            <span className={styles.headerTitle}>Raw JSON Response</span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.copyBtn} onClick={handleCopy} title="Copy to clipboard">
              📋 Copy
            </button>
            <button className={styles.closeBtn} onClick={onClose} title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <pre className={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
