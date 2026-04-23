// Selected facet state managed on the results page
// Separate from the search config payload

export interface SelectedTermFacet {
  field: string;
  value: string;
}

export interface SelectedRangeFacet {
  field: string;
  min: number;
  max: number;
}

export type SelectedFacet = SelectedTermFacet | SelectedRangeFacet;

export function isRangeSelection(f: SelectedFacet): f is SelectedRangeFacet {
  return 'min' in f;
}
