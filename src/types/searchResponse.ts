export interface SelectedVariant {
  id: string;
  name: string;
  provider_id: string;
  color?: string;
  size?: string;
  price?: number;
  primary_image_url?: string;
  primary_image_alt_text?: string;
  description?: string;
  brand?: string;
  categories?: string[];
  category_ids?: string[];
  type?: string;
  kind?: string;
  url?: string;
  tags?: string[];
  sku?: string;
  inventory_status?: string;
  inventory_level?: number;
  [key: string]: unknown;
}

export interface RankingInfo {
  overall_score: number;
  merchandising_score: number;
  relevance_score: number;
  personalization_score: number | null;
  performance_score: number | null;
  position: number;
  is_pin: boolean;
  is_slotted: boolean;
}

export interface ProductRecord {
  id: string;
  name: string;
  provider_id: string;
  brand?: string;
  price?: number;
  description?: string;
  primary_image_url?: string;
  primary_image_alt_text?: string;
  categories?: string[];
  category_ids?: string[];
  sku?: string;
  type?: string;
  kind?: string;
  url?: string;
  tags?: string[];
  inventory_status?: string;
  inventory_level?: number;
  selected_variant?: SelectedVariant;
  ranking_info?: RankingInfo;
  [key: string]: unknown;
}

export interface FacetValue {
  display_value: string;
  count: number;
  image_url: string | null;
  color: string | null;
  value: string;
  min: number | null;
  max: number | null;
}

export interface FacetRange {
  min: number;
  max: number;
  step: number;
}

export interface FacetResult {
  name: string;
  field: string;
  appearance: string;
  default_collapse_on_desktop: boolean;
  default_collapse_on_mobile: boolean;
  show_count: boolean;
  show_search_within_facet: boolean;
  display_tooltip: boolean;
  tooltip: string;
  hide_empty_value: boolean;
  layout_style: string;
  display_layout: string;
  star_color: string;
  values: FacetValue[] | null;
  range: FacetRange | null;
}

export interface Banner {
  id: string;
  position: number;
  repeat_on_pagination: boolean;
  banner: Record<string, unknown>;
}

export interface SearchMeta {
  did_you_mean: string[] | null;
  auto_spell_correction_applied: boolean;
  redirect_url: string | null;
  tagged_attributes: unknown;
  total_count: number;
  corrected_search_term: string | null;
  experiments: unknown;
}

export interface SearchResponse {
  records: ProductRecord[];
  facets: FacetResult[] | null;
  banners: Banner[] | null;
  meta: SearchMeta;
}
