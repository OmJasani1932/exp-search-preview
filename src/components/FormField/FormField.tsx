import React, { memo } from 'react';
import styles from './FormField.module.css';

interface Props {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<Props> = memo(({ label, hint, children }) => (
  <div className={styles.field}>
    <label className={styles.label}>
      {label}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
    <div className={styles.control}>{children}</div>
  </div>
));
