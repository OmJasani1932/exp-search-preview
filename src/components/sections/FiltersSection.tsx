import React from 'react';
import type { FilterNode, FilterGroup } from '../../types/searchPayload';
import styles from './sections.module.css';

interface RuleProps {
  node: FilterNode;
  onChange: (updated: FilterNode) => void;
  onRemove: () => void;
  depth?: number;
}

const FilterRuleEditor: React.FC<RuleProps> = ({ node, onChange, onRemove, depth = 0 }) => {
  if (node.group) {
    return (
      <FilterGroupEditor
        group={node.group}
        onChange={(g) => onChange({ group: g })}
        onRemove={onRemove}
        depth={depth}
      />
    );
  }

  return (
    <div className={styles.filterRule} style={{ marginLeft: depth * 16 }}>
      <input
        type="text"
        className={styles.inputSm}
        placeholder="action (e.g. equals)"
        value={node.action ?? ''}
        onChange={(e) => onChange({ ...node, action: e.target.value })}
      />
      <input
        type="text"
        className={styles.inputSm}
        placeholder="field_name"
        value={node.field_name ?? ''}
        onChange={(e) => onChange({ ...node, field_name: e.target.value })}
      />
      <input
        type="text"
        className={styles.inputSm}
        placeholder="value"
        value={String(node.value ?? '')}
        onChange={(e) => onChange({ ...node, value: e.target.value })}
      />
      <button className={styles.removeBtn} onClick={onRemove} title="Remove rule">
        ✕
      </button>
    </div>
  );
};

interface GroupProps {
  group: FilterGroup;
  onChange: (updated: FilterGroup) => void;
  onRemove: () => void;
  depth?: number;
}

const FilterGroupEditor: React.FC<GroupProps> = ({ group, onChange, onRemove, depth = 0 }) => {
  const updateRule = (i: number, updated: FilterNode) => {
    const rules = group.rules.map((r, idx) => (idx === i ? updated : r));
    onChange({ ...group, rules });
  };

  const removeRule = (i: number) => {
    onChange({ ...group, rules: group.rules.filter((_, idx) => idx !== i) });
  };

  const addRule = () => {
    onChange({
      ...group,
      rules: [...group.rules, { action: 'equals', field_name: '', value: '' }],
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      rules: [
        ...group.rules,
        { group: { operator: 'and', rules: [] } },
      ],
    });
  };

  return (
    <div className={styles.filterGroup} style={{ marginLeft: depth * 16 }}>
      <div className={styles.filterGroupHeader}>
        <span className={styles.filterGroupLabel}>Group</span>
        <select
          className={styles.operatorSelect}
          value={group.operator}
          onChange={(e) =>
            onChange({ ...group, operator: e.target.value as 'and' | 'or' })
          }
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        <button className={styles.addBtnSm} onClick={addRule}>
          + Rule
        </button>
        <button className={styles.addBtnSm} onClick={addGroup}>
          + Group
        </button>
        <button className={styles.removeBtn} onClick={onRemove} title="Remove group">
          ✕
        </button>
      </div>
      <div className={styles.filterGroupRules}>
        {group.rules.map((rule, i) => (
          <FilterRuleEditor
            key={i}
            node={rule}
            onChange={(updated) => updateRule(i, updated)}
            onRemove={() => removeRule(i)}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};

interface SectionProps {
  filters: FilterNode[];
  onChange: (filters: FilterNode[]) => void;
}

export const FiltersSection: React.FC<SectionProps> = ({ filters, onChange }) => {
  const updateNode = (i: number, updated: FilterNode) => {
    onChange(filters.map((f, idx) => (idx === i ? updated : f)));
  };

  const removeNode = (i: number) => {
    onChange(filters.filter((_, idx) => idx !== i));
  };

  const addTopGroup = () => {
    onChange([...filters, { group: { operator: 'and', rules: [] } }]);
  };

  return (
    <div>
      {filters.map((node, i) => (
        <FilterRuleEditor
          key={i}
          node={node}
          onChange={(u) => updateNode(i, u)}
          onRemove={() => removeNode(i)}
          depth={0}
        />
      ))}
      <button className={styles.addBtn} onClick={addTopGroup}>
        + Add Filter Group
      </button>
    </div>
  );
};
