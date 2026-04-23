import React, { useRef, memo } from 'react';
import styles from './JsonEditor.module.css';

interface Props {
  jsonText: string;
  jsonError: string | null;
  onChange: (text: string) => void;
}

export const JsonEditor: React.FC<Props> = memo(({ jsonText, jsonError, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
      onChange(formatted);
    } catch {
      // leave as-is if invalid
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>Raw JSON</span>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarBtn} onClick={handleFormat} title="Format JSON">
            ⚡ Format
          </button>
          <button className={styles.toolbarBtn} onClick={handleCopy} title="Copy JSON">
            📋 Copy
          </button>
        </div>
      </div>

      {jsonError && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{jsonError}</span>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`${styles.editor} ${jsonError ? styles.editorError : ''}`}
        value={jsonText}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
});
