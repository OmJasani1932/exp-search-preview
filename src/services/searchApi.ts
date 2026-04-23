import type { ApiConfig } from '../types/apiConfig';
import type { SearchPayload } from '../types/searchPayload';
import type { SearchResponse } from '../types/searchResponse';

/**
 * Build the request body from a SearchPayload, stripping empty/default values
 * so we only send what the user actually configured.
 */
function buildRequestBody(payload: SearchPayload): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  // Always include these
  body.skip = payload.skip;
  body.limit = payload.limit;

  // Strings — only send if non-empty
  if (payload.sort_by) body.sort_by = payload.sort_by;
  if (payload.sort_by) body.sort_order = payload.sort_order;
  if (payload.session_id) body.session_id = payload.session_id;
  if (payload.user_id) body.user_id = payload.user_id;
  if (payload.currency) body.currency = payload.currency;
  if (payload.location) body.location = payload.location;
  if (payload.price_group) body.price_group = payload.price_group;
  if (payload.algorithm_id) body.algorithm_id = payload.algorithm_id;
  if (payload.algorithm_variant_id) body.algorithm_variant_id = payload.algorithm_variant_id;
  if (payload.out_of_stock) body.out_of_stock = payload.out_of_stock;

  // Numbers — only send if non-zero
  if (payload.currency_conversion_rate) body.currency_conversion_rate = payload.currency_conversion_rate;
  if (payload.did_you_mean_limit) body.did_you_mean_limit = payload.did_you_mean_limit;

  // Booleans — only send if true
  if (payload.include_count) body.include_count = true;
  if (payload.is_auto_spell_correction) body.is_auto_spell_correction = true;
  if (payload.is_auto_spell_correction_zero_results) body.is_auto_spell_correction_zero_results = true;
  if (payload.auto_redirect) body.auto_redirect = true;
  if (payload.skip_facet_generation) body.skip_facet_generation = true;

  // Bypass flags — only send if true
  if (payload.bypass_cache) body.bypass_cache = true;
  if (payload.bypass_merchandising) body.bypass_merchandising = true;
  if (payload.bypass_personalization) body.bypass_personalization = true;
  if (payload.bypass_merchandising_include_filter_rule) body.bypass_merchandising_include_filter_rule = true;
  if (payload.bypass_merchandising_exclude_filter_rule) body.bypass_merchandising_exclude_filter_rule = true;
  if (payload.bypass_merchandising_boost_rule) body.bypass_merchandising_boost_rule = true;
  if (payload.bypass_merchandising_bury_rule) body.bypass_merchandising_bury_rule = true;
  if (payload.bypass_merchandising_sort_rule) body.bypass_merchandising_sort_rule = true;
  if (payload.bypass_merchandising_pin_rule) body.bypass_merchandising_pin_rule = true;
  if (payload.bypass_merchandising_slot_rule) body.bypass_merchandising_slot_rule = true;
  if (payload.bypass_merchandising_banner_rule) body.bypass_merchandising_banner_rule = true;

  // Arrays — only send if non-empty (defensive ?. for old stored payloads)
  if (payload.fields?.length > 0) body.fields = payload.fields;
  if (payload.selected_variant_fields?.length > 0) body.selected_variant_fields = payload.selected_variant_fields;
  if (payload.facets?.length > 0) body.facets = payload.facets;
  if (payload.filters?.length > 0) body.filters = payload.filters;
  if (payload.merchandising_rule_override?.length > 0) body.merchandising_rule_override = payload.merchandising_rule_override;
  if (payload.variation_map_group_by?.length > 0) body.variation_map_group_by = payload.variation_map_group_by;
  if (payload.variation_map_group_values?.length > 0) body.variation_map_group_values = payload.variation_map_group_values;

  return body;
}

export async function executeSearch(
  config: ApiConfig,
  query: string,
  payload: SearchPayload,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  // baseUrl is just the path (e.g. /apis/discovery/search/) — proxy handles the domain
  const path = config.baseUrl.startsWith('/') ? config.baseUrl : `/${config.baseUrl}`;
  const params = new URLSearchParams();
  params.set('catalog_id', config.catalogId);
  if (query.trim()) {
    params.set('q', query.trim());
  }

  const proxyUrl = `${path}?${params.toString()}`;

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Environment-Id': config.environmentId,
      'X-Tenant-Id': config.tenantId,
      'X-Workspace-Id': config.workspaceId,
    },
    body: JSON.stringify(buildRequestBody(payload)),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<SearchResponse>;
}
