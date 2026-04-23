import React, { memo } from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import type { ApiConfig } from '../../types/apiConfig';
import { ApiConfigSection } from '../sections/ApiConfigSection';
import { PaginationSection } from '../sections/PaginationSection';
import { SpellCorrectionSection } from '../sections/SpellCorrectionSection';
import { SessionSection } from '../sections/SessionSection';
import { FieldsSection } from '../sections/FieldsSection';
import { FiltersSection } from '../sections/FiltersSection';
import { CurrencySection } from '../sections/CurrencySection';
import { AlgorithmSection } from '../sections/AlgorithmSection';
import { BypassSection } from '../sections/BypassSection';
import { VariationSection } from '../sections/VariationSection';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './FormEditor.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
  resetKey: number;
  apiConfig: ApiConfig;
  updateApiConfig: <K extends keyof ApiConfig>(key: K, value: ApiConfig[K]) => void;
}

export const FormEditor: React.FC<Props> = memo(({ payload, update, resetKey, apiConfig, updateApiConfig }) => (
  <div className={styles.container}>
    <ApiConfigSection config={apiConfig} updateConfig={updateApiConfig} />
    <PaginationSection payload={payload} update={update} />
    <SpellCorrectionSection payload={payload} update={update} />
    <SessionSection payload={payload} update={update} />
    <FieldsSection key={resetKey} payload={payload} update={update} />
    <SectionCard title="Filters" icon="🔎">
      <FiltersSection
        filters={payload.filters}
        onChange={(f) => update('filters', f)}
      />
    </SectionCard>
    <CurrencySection payload={payload} update={update} />
    <AlgorithmSection payload={payload} update={update} />
    <BypassSection payload={payload} update={update} />
    <VariationSection payload={payload} update={update} />
  </div>
));
