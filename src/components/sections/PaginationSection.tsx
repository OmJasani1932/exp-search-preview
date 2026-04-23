import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

export const PaginationSection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Pagination" icon="📄">
    <div className={styles.grid2}>
      <FormField label="Skip" hint="offset">
        <input
          type="number"
          className={styles.input}
          value={payload.skip}
          min={0}
          onChange={(e) => update('skip', Number(e.target.value))}
        />
      </FormField>
      <FormField label="Limit" hint="results per page">
        <input
          type="number"
          className={styles.input}
          value={payload.limit}
          min={1}
          onChange={(e) => update('limit', Number(e.target.value))}
        />
      </FormField>
    </div>
    <FormField label="Include Count">
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={payload.include_count}
          onChange={(e) => update('include_count', e.target.checked)}
        />
        <span className={styles.toggleSlider} />
        <span className={styles.toggleLabel}>{payload.include_count ? 'Yes' : 'No'}</span>
      </label>
    </FormField>
  </SectionCard>
);
