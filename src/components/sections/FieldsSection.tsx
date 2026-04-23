import React, { useState, useEffect } from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

function toArray(val: string): string[] {
  return val.split(',').map((s) => s.trim()).filter(Boolean);
}

export const FieldsSection: React.FC<Props> = ({ payload, update }) => {
  const [fieldsText, setFieldsText] = useState(payload.fields.join(', '));
  const [variantFieldsText, setVariantFieldsText] = useState(
    payload.selected_variant_fields.join(', ')
  );

  // Keep local text in sync when payload is updated from the JSON editor tab
  const fieldsKey = payload.fields.join(',');
  const variantKey = payload.selected_variant_fields.join(',');

  useEffect(() => {
    setFieldsText(payload.fields.join(', '));
  }, [fieldsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setVariantFieldsText(payload.selected_variant_fields.join(', '));
  }, [variantKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SectionCard title="Return Fields" icon="🗂️">
      <FormField label="Fields" hint="comma-separated · parsed on blur">
        <textarea
          className={styles.textarea}
          rows={2}
          value={fieldsText}
          onChange={(e) => setFieldsText(e.target.value)}
          onBlur={() => update('fields', toArray(fieldsText))}
        />
      </FormField>
      <FormField label="Selected Variant Fields" hint="comma-separated · parsed on blur">
        <textarea
          className={styles.textarea}
          rows={2}
          value={variantFieldsText}
          onChange={(e) => setVariantFieldsText(e.target.value)}
          onBlur={() => update('selected_variant_fields', toArray(variantFieldsText))}
        />
      </FormField>
    </SectionCard>
  );
};
