import React from 'react';
import type { SearchPayload, VariationMapGroupBy, VariationMapGroupValue } from '../../types/searchPayload';
import { SectionCard } from '../SectionCard/SectionCard';
import { FormField } from '../FormField/FormField';
import styles from './sections.module.css';

interface Props {
  payload: SearchPayload;
  update: <K extends keyof SearchPayload>(key: K, value: SearchPayload[K]) => void;
}

const AGGREGATIONS = ['Count', 'First', 'Min', 'Max', 'Sum', 'Avg'] as const;

export const VariationSection: React.FC<Props> = ({ payload, update }) => {
  const groupBy = payload.variation_map_group_by;
  const groupValues = payload.variation_map_group_values;

  // Group By
  const updateGroupBy = (i: number, updated: VariationMapGroupBy) => {
    update('variation_map_group_by', groupBy.map((g, idx) => (idx === i ? updated : g)));
  };
  const removeGroupBy = (i: number) => {
    update('variation_map_group_by', groupBy.filter((_, idx) => idx !== i));
  };
  const addGroupBy = () => {
    update('variation_map_group_by', [...groupBy, { name: '', field: '' }]);
  };

  // Group Values
  const updateGroupValue = (i: number, updated: VariationMapGroupValue) => {
    update('variation_map_group_values', groupValues.map((g, idx) => (idx === i ? updated : g)));
  };
  const removeGroupValue = (i: number) => {
    update('variation_map_group_values', groupValues.filter((_, idx) => idx !== i));
  };
  const addGroupValue = () => {
    update('variation_map_group_values', [
      ...groupValues,
      { name: '', field: '', aggregation: 'First' },
    ]);
  };

  return (
    <SectionCard title="Variation Mapping" icon="🎨">
      <div className={styles.subSection}>
        <div className={styles.subSectionTitle}>Group By</div>
        {groupBy.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemIndex}>Group By {i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeGroupBy(i)}>✕</button>
            </div>
            <div className={styles.grid2}>
              <FormField label="Name">
                <input type="text" className={styles.input} value={item.name}
                  onChange={(e) => updateGroupBy(i, { ...item, name: e.target.value })} />
              </FormField>
              <FormField label="Field">
                <input type="text" className={styles.input} value={item.field}
                  onChange={(e) => updateGroupBy(i, { ...item, field: e.target.value })} />
              </FormField>
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={addGroupBy}>+ Add Group By</button>
      </div>

      <div className={styles.subSection}>
        <div className={styles.subSectionTitle}>Group Values</div>
        {groupValues.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.listItemHeader}>
              <span className={styles.listItemIndex}>Value {i + 1}</span>
              <button className={styles.removeBtn} onClick={() => removeGroupValue(i)}>✕</button>
            </div>
            <div className={styles.grid3}>
              <FormField label="Name">
                <input type="text" className={styles.input} value={item.name}
                  onChange={(e) => updateGroupValue(i, { ...item, name: e.target.value })} />
              </FormField>
              <FormField label="Field">
                <input type="text" className={styles.input} value={item.field}
                  onChange={(e) => updateGroupValue(i, { ...item, field: e.target.value })} />
              </FormField>
              <FormField label="Aggregation">
                <select className={styles.select} value={item.aggregation}
                  onChange={(e) =>
                    updateGroupValue(i, {
                      ...item,
                      aggregation: e.target.value as VariationMapGroupValue['aggregation'],
                    })
                  }>
                  {AGGREGATIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        ))}
        <button className={styles.addBtn} onClick={addGroupValue}>+ Add Group Value</button>
      </div>
    </SectionCard>
  );
};
