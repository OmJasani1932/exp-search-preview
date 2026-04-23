export interface FacetValueExact {
  value: string;
}

export interface FacetValueRange {
  min?: number;
  max?: number;
}

export interface Facet {
  field: string;
  value: FacetValueExact | FacetValueRange;
}

export interface FilterRule {
  action: string;
  field_name: string;
  value: string | number | boolean;
}

export interface FilterGroup {
  operator: 'and' | 'or';
  rules: FilterNode[];
}

export interface FilterNode {
  action?: string;
  field_name?: string;
  value?: string | number | boolean;
  group?: FilterGroup;
}

export interface VariationMapGroupBy {
  name: string;
  field: string;
}

export interface VariationMapGroupValue {
  name: string;
  field: string;
  aggregation: 'Count' | 'First' | 'Min' | 'Max' | 'Sum' | 'Avg';
}

/* ── Merchandising rule override ─────────────────── */
export interface MerchRuleOverrideFilter {
  group: FilterGroup;
}

export interface MerchFilterRuleData {
  name: string;
  operation: string;
  filter: MerchRuleOverrideFilter;
}

export interface MerchRankRuleData {
  name: string;
  filter: MerchRuleOverrideFilter;
  boost: number;
}

export interface MerchRuleOverride {
  type: string;
  data: MerchFilterRuleData | MerchRankRuleData;
}

/* ── Main search payload ──────────────────────────── */
export interface SearchPayload {
  fields: string[];
  skip: number;
  limit: number;
  sort_by: string;
  sort_order: 'ascending' | 'descending';
  include_count: boolean;
  is_auto_spell_correction: boolean;
  is_auto_spell_correction_zero_results: boolean;
  did_you_mean_limit: number;
  session_id: string;
  user_id: string;
  facets: Facet[];
  filters: FilterNode[];
  currency: string;
  bypass_cache: boolean;
  bypass_merchandising: boolean;
  bypass_personalization: boolean;
  bypass_merchandising_include_filter_rule: boolean;
  bypass_merchandising_exclude_filter_rule: boolean;
  bypass_merchandising_boost_rule: boolean;
  bypass_merchandising_bury_rule: boolean;
  bypass_merchandising_sort_rule: boolean;
  bypass_merchandising_pin_rule: boolean;
  bypass_merchandising_slot_rule: boolean;
  bypass_merchandising_banner_rule: boolean;
  out_of_stock: string;
  algorithm_id: string;
  algorithm_variant_id: string;
  auto_redirect: boolean;
  location: string;
  price_group: string;
  currency_conversion_rate: number;
  selected_variant_fields: string[];
  skip_facet_generation: boolean;
  merchandising_rule_override: MerchRuleOverride[];
  variation_map_group_by: VariationMapGroupBy[];
  variation_map_group_values: VariationMapGroupValue[];
}
