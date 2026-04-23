import React, { useState, memo } from 'react';
import type { SearchPayload } from '../../types/searchPayload';
import type { ApiConfig } from '../../types/apiConfig';
import { FormEditor } from '../FormEditor/FormEditor';
import { JsonEditor } from '../JsonEditor/JsonEditor';
import styles from './ConfigDrawer.module.css';

type Tab = 'form' | 'json';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
  jsonText: string;
  jsonError: string | null;
  onJsonChange: (text: string) => void;
  onReset: () => void;
  resetKey: number;
  apiConfig: ApiConfig;
  updateApiConfig: <K extends keyof ApiConfig>(key: K, value: ApiConfig[K]) => void;
}

export const ConfigDrawer: React.FC<Props> = memo(({
  open,
  onClose,
  onSave,
  payload,
  update,
  jsonText,
  jsonError,
  onJsonChange,
  onReset,
  resetKey,
  apiConfig,
  updateApiConfig,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('form');

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        {/* Drawer header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <span>⚙️</span>
            <span>Search Config</span>
          </div>
          <div className={styles.drawerHeaderActions}>
            <button className={styles.saveBtn} onClick={onSave} title="Save config & search">
              💾 Save
            </button>
            <button className={styles.resetBtn} onClick={onReset} title="Reset to default">
              ↺ Reset
            </button>
            <button className={styles.closeBtn} onClick={onClose} title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === 'form' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('form')}
          >
            📝 Form
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'json' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('json')}
          >
            {'{ }'} Raw JSON
            {jsonError && <span className={styles.errorDot} />}
          </button>
        </div>

        {/* Content — only render children when drawer is open to avoid unnecessary work */}
        <div className={styles.drawerBody}>
          {open && (
            activeTab === 'form' ? (
              <FormEditor
                payload={payload}
                update={update}
                resetKey={resetKey}
                apiConfig={apiConfig}
                updateApiConfig={updateApiConfig}
              />
            ) : (
              <JsonEditor jsonText={jsonText} jsonError={jsonError} onChange={onJsonChange} />
            )
          )}
        </div>
      </aside>
    </>
  );
});
