import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

export const CurrencySection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Currency & Pricing" icon="💱">
    <div className={styles.grid3}>
      <FormField label="Currency">
        <input
          type="text"
          className={styles.input}
          value={payload.currency}
          onChange={(e) => update('currency', e.target.value)}
        />
      </FormField>
      <FormField label="Price Group">
        <input
          type="text"
          className={styles.input}
          value={payload.price_group}
          onChange={(e) => update('price_group', e.target.value)}
        />
      </FormField>
      <FormField label="Conversion Rate">
        <input
          type="number"
          className={styles.input}
          step="0.01"
          value={payload.currency_conversion_rate}
          onChange={(e) => update('currency_conversion_rate', Number(e.target.value))}
        />
      </FormField>
    </div>
    <div className={styles.grid2}>
      <FormField label="Location">
        <input
          type="text"
          className={styles.input}
          value={payload.location}
          onChange={(e) => update('location', e.target.value)}
        />
      </FormField>
      <FormField label="Out of Stock" hint="e.g. Exclude, Include, Only, Burry">
        <input
          type="text"
          className={styles.input}
          value={payload.out_of_stock}
          onChange={(e) => update('out_of_stock', e.target.value)}
          placeholder="Exclude"
        />
      </FormField>
    </div>
  </SectionCard>
);
