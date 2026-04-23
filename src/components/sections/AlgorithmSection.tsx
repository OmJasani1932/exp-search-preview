import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

export const AlgorithmSection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Algorithm" icon="🤖">
    <div className={styles.grid2}>
      <FormField label="Algorithm ID">
        <input
          type="text"
          className={styles.input}
          value={payload.algorithm_id}
          onChange={(e) => update('algorithm_id', e.target.value)}
        />
      </FormField>
      <FormField label="Algorithm Variant ID">
        <input
          type="text"
          className={styles.input}
          value={payload.algorithm_variant_id}
          onChange={(e) => update('algorithm_variant_id', e.target.value)}
        />
      </FormField>
    </div>
    <FormField label="Auto Redirect">
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={payload.auto_redirect}
          onChange={(e) => update('auto_redirect', e.target.checked)}
        />
        <span className={styles.toggleSlider} />
        <span className={styles.toggleLabel}>{payload.auto_redirect ? 'Enabled' : 'Disabled'}</span>
      </label>
    </FormField>
  </SectionCard>
);
