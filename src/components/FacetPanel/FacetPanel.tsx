import React, { useState, memo } from 'react';
import type { FacetResult } from '../../types/searchResponse';
import styles from './FacetPanel.module.css';

interface Props {
  facets: FacetResult[];
  isTermSelected: (field: string, value: string) => boolean;
  getRangeSelection: (field: string) => { min: number; max: number } | undefined;
  onToggleTerm: (field: string, value: string) => void;
  onSetRange: (field: string, min: number, max: number) => void;
  onClearRange: (field: string) => void;
  onClearAll: () => void;
  selectedCount: number;
}

export const FacetPanel: React.FC<Props> = memo(({
  facets,
  isTermSelected,
  getRangeSelection,
  onToggleTerm,
  onSetRange,
  onClearRange,
  onClearAll,
  selectedCount,
}) => (
  <aside className={styles.panel}>
    <div className={styles.panelHeader}>
      <span className={styles.panelTitle}>Filters</span>
      {selectedCount > 0 && (
        <button className={styles.clearAllBtn} onClick={onClearAll}>
          Clear all ({selectedCount})
        </button>
      )}
    </div>

    {facets.map((facet) => (
      <FacetGroup
        key={facet.field}
        facet={facet}
        isTermSelected={isTermSelected}
        getRangeSelection={getRangeSelection}
        onToggleTerm={onToggleTerm}
        onSetRange={onSetRange}
        onClearRange={onClearRange}
      />
    ))}
  </aside>
));

/* ── Individual facet group ───────────────────────────── */
interface GroupProps {
  facet: FacetResult;
  isTermSelected: (field: string, value: string) => boolean;
  getRangeSelection: (field: string) => { min: number; max: number } | undefined;
  onToggleTerm: (field: string, value: string) => void;
  onSetRange: (field: string, min: number, max: number) => void;
  onClearRange: (field: string) => void;
}

const FacetGroup: React.FC<GroupProps> = memo(({
  facet,
  isTermSelected,
  getRangeSelection,
  onToggleTerm,
  onSetRange,
  onClearRange,
}) => {
  const [collapsed, setCollapsed] = useState(
    facet.default_collapse_on_desktop as boolean ?? false
  );
  const [termSearch, setTermSearch] = useState('');

  const isRange = facet.appearance === 'Range';
  const rangeSelection = isRange ? getRangeSelection(facet.field) : undefined;

  // Local range input state (committed on blur)
  const [localMin, setLocalMin] = useState<string>(
    rangeSelection?.min?.toString() ?? facet.range?.min?.toString() ?? ''
  );
  const [localMax, setLocalMax] = useState<string>(
    rangeSelection?.max?.toString() ?? facet.range?.max?.toString() ?? ''
  );

  const filteredValues = facet.values
    ? facet.values.filter((v) =>
        termSearch === '' ||
        v.display_value.toLowerCase().includes(termSearch.toLowerCase())
      )
    : [];

  const handleRangeApply = () => {
    const min = parseFloat(localMin);
    const max = parseFloat(localMax);
    if (!isNaN(min) && !isNaN(max)) {
      onSetRange(facet.field, min, max);
    }
  };

  const handleRangeClear = () => {
    setLocalMin(facet.range?.min?.toString() ?? '');
    setLocalMax(facet.range?.max?.toString() ?? '');
    onClearRange(facet.field);
  };

  return (
    <div className={styles.group}>
      {/* Group header */}
      <button className={styles.groupHeader} onClick={() => setCollapsed((v) => !v)}>
        <span className={styles.groupName}>{facet.name}</span>
        <span className={styles.collapseIcon}>{collapsed ? '▶' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className={styles.groupBody}>
          {/* Terms facet */}
          {!isRange && facet.values && (
            <>
              {facet.show_search_within_facet && (
                <input
                  type="text"
                  className={styles.termSearch}
                  placeholder={`Search ${facet.name}…`}
                  value={termSearch}
                  onChange={(e) => setTermSearch(e.target.value)}
                />
              )}
              <ul className={styles.termList}>
                {filteredValues.map((v) => {
                  const checked = isTermSelected(facet.field, v.value);
                  return (
                    <li key={v.value} className={styles.termItem}>
                      <label className={`${styles.termLabel} ${checked ? styles.termChecked : ''}`}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={checked}
                          onChange={() => onToggleTerm(facet.field, v.value)}
                        />
                        <span className={styles.termText}>{v.display_value}</span>
                        {facet.show_count === true && (
                          <span className={styles.termCount}>{v.count.toLocaleString()}</span>
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {/* Range facet */}
          {isRange && facet.range && (
            <div className={styles.rangeWrap}>
              <div className={styles.rangeMeta}>
                <span className={styles.rangeMetaLabel}>
                  Range: ${facet.range.min} – ${facet.range.max}
                </span>
                {rangeSelection && (
                  <button className={styles.rangeClearBtn} onClick={handleRangeClear}>
                    Clear
                  </button>
                )}
              </div>
              <div className={styles.rangeInputRow}>
                <div className={styles.rangeInputWrap}>
                  <span className={styles.rangeInputLabel}>Min</span>
                  <input
                    type="number"
                    className={styles.rangeInput}
                    value={localMin}
                    min={facet.range.min}
                    max={facet.range.max}
                    step={facet.range.step}
                    onChange={(e) => setLocalMin(e.target.value)}
                    onBlur={handleRangeApply}
                  />
                </div>
                <span className={styles.rangeSep}>–</span>
                <div className={styles.rangeInputWrap}>
                  <span className={styles.rangeInputLabel}>Max</span>
                  <input
                    type="number"
                    className={styles.rangeInput}
                    value={localMax}
                    min={facet.range.min}
                    max={facet.range.max}
                    step={facet.range.step}
                    onChange={(e) => setLocalMax(e.target.value)}
                    onBlur={handleRangeApply}
                  />
                </div>
              </div>
              {rangeSelection && (
                <div className={styles.rangeActiveTag}>
                  Active: ${rangeSelection.min} – ${rangeSelection.max}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
