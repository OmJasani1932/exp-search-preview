import { useState, useCallback } from 'react';
import type { SelectedFacet, SelectedTermFacet, SelectedRangeFacet } from '../types/facetSelection';
import { isRangeSelection } from '../types/facetSelection';

export function useSelectedFacets() {
  const [selected, setSelected] = useState<SelectedFacet[]>([]);

  const toggleTerm = useCallback((field: string, value: string) => {
    setSelected((prev) => {
      const exists = prev.some(
        (f) => !isRangeSelection(f) && f.field === field && (f as SelectedTermFacet).value === value
      );
      if (exists) {
        return prev.filter(
          (f) => !((!isRangeSelection(f)) && f.field === field && (f as SelectedTermFacet).value === value)
        );
      }
      return [...prev, { field, value }];
    });
  }, []);

  const setRange = useCallback((field: string, min: number, max: number) => {
    setSelected((prev) => {
      const without = prev.filter((f) => !(isRangeSelection(f) && f.field === field));
      return [...without, { field, min, max } as SelectedRangeFacet];
    });
  }, []);

  const clearRange = useCallback((field: string) => {
    setSelected((prev) => prev.filter((f) => !(isRangeSelection(f) && f.field === field)));
  }, []);

  const clearAll = useCallback(() => setSelected([]), []);

  const isTermSelected = useCallback(
    (field: string, value: string) =>
      selected.some(
        (f) => !isRangeSelection(f) && f.field === field && (f as SelectedTermFacet).value === value
      ),
    [selected]
  );

  const getRangeSelection = useCallback(
    (field: string): SelectedRangeFacet | undefined =>
      selected.find((f) => isRangeSelection(f) && f.field === field) as SelectedRangeFacet | undefined,
    [selected]
  );

  return { selected, toggleTerm, setRange, clearRange, clearAll, isTermSelected, getRangeSelection };
}
