import React from 'react';
import type { ApiConfig } from '../../types/apiConfig';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  config: ApiConfig;
  updateConfig: <K extends keyof ApiConfig>(key: K, value: ApiConfig[K]) => void;
}

export const ApiConfigSection: React.FC<Props> = ({ config, updateConfig }) => (
  <SectionCard title="API Connection" icon="🔌">
    <FormField label="Base Path" hint="path only, no domain">
      <input
        type="text"
        className={styles.input}
        value={config.baseUrl}
        onChange={(e) => updateConfig('baseUrl', e.target.value)}
        placeholder="/apis/discovery/search/"
      />
    </FormField>
    <FormField label="Catalog ID">
      <input
        type="text"
        className={styles.input}
        value={config.catalogId}
        onChange={(e) => updateConfig('catalogId', e.target.value)}
      />
    </FormField>
    <FormField label="X-Environment-Id">
      <input
        type="text"
        className={styles.input}
        value={config.environmentId}
        onChange={(e) => updateConfig('environmentId', e.target.value)}
      />
    </FormField>
    <FormField label="X-Tenant-Id">
      <input
        type="text"
        className={styles.input}
        value={config.tenantId}
        onChange={(e) => updateConfig('tenantId', e.target.value)}
      />
    </FormField>
    <FormField label="X-Workspace-Id">
      <input
        type="text"
        className={styles.input}
        value={config.workspaceId}
        onChange={(e) => updateConfig('workspaceId', e.target.value)}
      />
    </FormField>
  </SectionCard>
);
