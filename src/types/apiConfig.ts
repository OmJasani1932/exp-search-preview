export interface ApiConfig {
  baseUrl: string;
  catalogId: string;
  environmentId: string;
  tenantId: string;
  workspaceId: string;
}

export const API_CONFIG_STORAGE_KEY = 'search_debugger_api_config';

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: '/apis/discovery/search/',
  catalogId: 'c3d34cf6-c728-4c53-a7fd-4002e24bd529',
  environmentId: 'PRODUCTION-9f01199d-af1b-421d-93ec-bbd9725320e5-xifc6611',
  tenantId: '25fdab8e-574c-4f88-b87e-07ddc131f20b',
  workspaceId: '9f01199d-af1b-421d-93ec-bbd9725320e5',
};
