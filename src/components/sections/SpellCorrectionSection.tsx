import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

export const SpellCorrectionSection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Spell Correction" icon="✏️">
    <div className={styles.grid2}>
      <FormField label="Auto Spell Correction">
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={payload.is_auto_spell_correction}
            onChange={(e) => update('is_auto_spell_correction', e.target.checked)}
          />
          <span className={styles.toggleSlider} />
          <span className={styles.toggleLabel}>{payload.is_auto_spell_correction ? 'On' : 'Off'}</span>
        </label>
      </FormField>
      <FormField label="Correction on Zero Results">
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={payload.is_auto_spell_correction_zero_results}
            onChange={(e) => update('is_auto_spell_correction_zero_results', e.target.checked)}
          />
          <span className={styles.toggleSlider} />
          <span className={styles.toggleLabel}>
            {payload.is_auto_spell_correction_zero_results ? 'On' : 'Off'}
          </span>
        </label>
      </FormField>
    </div>
    <FormField label="Did You Mean Limit">
      <input
        type="number"
        className={styles.input}
        style={{ maxWidth: 120 }}
        value={payload.did_you_mean_limit}
        min={0}
        onChange={(e) => update('did_you_mean_limit', Number(e.target.value))}
      />
    </FormField>
  </SectionCard>
);
