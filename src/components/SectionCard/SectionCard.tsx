import React, { memo } from 'react';
import styles from './SectionCard.module.css';

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<Props> = memo(({ title, icon, children }) => (
  <div className={styles.card}>
    <div className={styles.header}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3 className={styles.title}>{title}</h3>
    </div>
    <div className={styles.body}>{children}</div>
  </div>
));
