import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

export const SessionSection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Session & User" icon="👤">
    <div className={styles.grid2}>
      <FormField label="Session ID">
        <input
          type="text"
          className={styles.input}
          value={payload.session_id}
          onChange={(e) => update('session_id', e.target.value)}
        />
      </FormField>
      <FormField label="User ID">
        <input
          type="text"
          className={styles.input}
          value={payload.user_id}
          onChange={(e) => update('user_id', e.target.value)}
        />
      </FormField>
    </div>
  </SectionCard>
);
