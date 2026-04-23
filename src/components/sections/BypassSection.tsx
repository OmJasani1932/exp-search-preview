import React from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

const BYPASS_FIELDS: { key: keyof SearchPayload; label: string }[] = [
  { key: 'bypass_cache', label: 'Cache' },
  { key: 'bypass_merchandising', label: 'Merchandising (all)' },
  { key: 'bypass_personalization', label: 'Personalization' },
  { key: 'bypass_merchandising_include_filter_rule', label: 'Include Filter Rule' },
  { key: 'bypass_merchandising_exclude_filter_rule', label: 'Exclude Filter Rule' },
  { key: 'bypass_merchandising_boost_rule', label: 'Boost Rule' },
  { key: 'bypass_merchandising_bury_rule', label: 'Bury Rule' },
  { key: 'bypass_merchandising_sort_rule', label: 'Sort Rule' },
  { key: 'bypass_merchandising_pin_rule', label: 'Pin Rule' },
  { key: 'bypass_merchandising_slot_rule', label: 'Slot Rule' },
  { key: 'bypass_merchandising_banner_rule', label: 'Banner Rule' },
];

export const BypassSection: React.FC<Props> = ({ payload, update }) => (
  <SectionCard title="Bypass Flags" icon="🚦">
    <div className={styles.bypassGrid}>
      {BYPASS_FIELDS.map(({ key, label }) => {
        const val = payload[key] as boolean;
        return (
          <FormField key={key} label={label}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => update(key, e.target.checked)}
              />
              <span className={styles.toggleSlider} />
              <span className={`${styles.toggleLabel} ${val ? styles.toggleActive : ''}`}>
                {val ? 'Bypass' : 'Active'}
              </span>
            </label>
          </FormField>
        );
      })}
    </div>
  </SectionCard>
);
