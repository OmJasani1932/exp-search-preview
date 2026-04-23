import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ConfigDrawer } from './components/ConfigDrawer/ConfigDrawer';
import { FacetPanel } from './components/FacetPanel/FacetPanel';
import { RawJsonModal } from './components/RawJsonModal/RawJsonModal';
import { useSearchPayload } from './hooks/useSearchPayload';
import { useSelectedFacets } from './hooks/useSelectedFacets';
import { useApiConfig } from './hooks/useApiConfig';
import { ProductCard } from './components/ProductCard/ProductCard';
import { executeSearch } from './services/searchApi';
import type { SearchResponse } from './types/searchResponse';
import type { Facet } from './types/searchPayload';
import { isRangeSelection } from './types/facetSelection';
import './App.css';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rawOpen, setRawOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Sort controls (outside flyout, applied directly)
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');

  // Card display toggles (persisted)
  const [globalShowRanking, setGlobalShowRanking] = useState(() => {
    return localStorage.getItem('card_show_ranking') !== 'false';
  });
  const [globalShowFields, setGlobalShowFields] = useState(() => {
    return localStorage.getItem('card_show_fields') === 'true';
  });

  const handleToggleRanking = useCallback(() => {
    setGlobalShowRanking((v) => {
      localStorage.setItem('card_show_ranking', String(!v));
      return !v;
    });
  }, []);

  const handleToggleFields = useCallback(() => {
    setGlobalShowFields((v) => {
      localStorage.setItem('card_show_fields', String(!v));
      return !v;
    });
  }, []);

  const abortRef = useRef<AbortController | null>(null);

  const { payload, jsonText, jsonError, resetKey, updatePayload, updateFromJson, savePayload, resetToDefault } =
    useSearchPayload();

  const { config: apiConfig, updateConfig: updateApiConfig } = useApiConfig();

  const {
    selected,
    toggleTerm,
    setRange,
    clearRange,
    clearAll,
    isTermSelected,
    getRangeSelection,
  } = useSelectedFacets();

  const records = useMemo(() => response?.records ?? [], [response]);
  const facets = useMemo(() => response?.facets ?? [], [response]);
  const meta = response?.meta ?? null;
  const totalCount = meta?.total_count ?? 0;
  const limit = payload.limit || 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  // Convert UI-selected facets into the Facet[] format the API expects
  const selectedFacetsPayload: Facet[] = useMemo(() => {
    return selected.map((sel) => {
      if (isRangeSelection(sel)) {
        return { field: sel.field, value: { min: sel.min, max: sel.max } };
      }
      return { field: sel.field, value: { value: sel.value } };
    });
  }, [selected]);

  const doSearch = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    // Override skip based on page
    const skip = (page - 1) * limit;

    // Merge config facets with UI-selected facets
    const mergedFacets = [...(payload.facets ?? []), ...selectedFacetsPayload];

    try {
      const overriddenPayload = { ...payload, skip, facets: mergedFacets };
      const result = await executeSearch(apiConfig, query, overriddenPayload, controller.signal);
      setResponse(result);
      setCurrentPage(page);
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      console.error('[Search Debugger] API Error:', err);
      setError((err as Error).message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiConfig, payload, limit, selectedFacetsPayload]);

  // Keep doSearch ref fresh
  const doSearchRef = useRef(doSearch);
  doSearchRef.current = doSearch;

  // Manual search trigger (button click or Enter key)
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    setCurrentPage(1);
    doSearchRef.current(searchQuery, 1);
  }, [searchQuery]);

  // Clear search resets results
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setResponse(null);
    setCurrentPage(1);
  }, []);

  // Re-trigger search when facet selections change (skip initial mount)
  const facetMountRef = useRef(true);
  useEffect(() => {
    if (facetMountRef.current) {
      facetMountRef.current = false;
      return;
    }
    if (!searchQuery.trim()) return;
    setCurrentPage(1);
    doSearchRef.current(searchQuery, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacetsPayload]);

  // Sort handlers — update payload directly and re-trigger search immediately
  const handleSortByChange = useCallback((value: string) => {
    setSortBy(value);
    updatePayload('sort_by', value);
  }, [updatePayload]);

  const handleSortOrderChange = useCallback((value: 'ascending' | 'descending') => {
    setSortOrder(value);
    updatePayload('sort_order', value);
    if (searchQuery.trim()) {
      setCurrentPage(1);
      setTimeout(() => doSearchRef.current(searchQuery, 1), 0);
    }
  }, [searchQuery, updatePayload]);

  // Save config handler: persist → close drawer → re-search if query exists
  const handleSaveConfig = useCallback(() => {
    savePayload();
    setDrawerOpen(false);
    if (searchQuery.trim()) {
      // Use setTimeout so the saved payload state is committed before searching
      setTimeout(() => {
        doSearchRef.current(searchQuery, 1);
        setCurrentPage(1);
      }, 0);
    }
  }, [savePayload, searchQuery]);

  const handlePageChange = useCallback((page: number) => {
    doSearch(searchQuery, page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doSearch, searchQuery]);

  // Memoize pagination items to avoid recomputing on every render
  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return [];
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => {
        if (p === 1 || p === totalPages) return true;
        return Math.abs(p - currentPage) <= 2;
      })
      .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
        acc.push(p);
        return acc;
      }, []);
  }, [totalPages, currentPage]);

  // Stable callback refs for inline handlers to prevent child re-renders
  const handleCloseDrawer = useCallback(() => setDrawerOpen(false), []);
  const handleOpenDrawer = useCallback(() => setDrawerOpen(true), []);
  const handleToggleRaw = useCallback(() => setRawOpen((v) => !v), []);
  const handleCloseRaw = useCallback(() => setRawOpen(false), []);
  const handleDismissError = useCallback(() => setError(null), []);
  const handleToggleDarkMode = useCallback(() => setDarkMode((v) => !v), []);

  return (
    <div className="spa">
      {/* ── Config Drawer ── */}
      <ConfigDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveConfig}
        payload={payload}
        update={updatePayload}
        jsonText={jsonText}
        jsonError={jsonError}
        onJsonChange={updateFromJson}
        onReset={resetToDefault}
        resetKey={resetKey}
        apiConfig={apiConfig}
        updateApiConfig={updateApiConfig}
      />

      {/* ── Top Header ── */}
      <header className="spaHeader">
        <div className="spaHeaderLeft">
          <button
            className="themeToggle"
            onClick={handleToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="spaHeaderCenter">
          <div className="searchForm">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              className="searchInput"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="searchClear"
                onClick={handleClearSearch}
                title="Clear"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              className="searchBtn"
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              title="Search"
            >
              Search
            </button>
            {loading && <span className="searchSpinner">⏳</span>}
          </div>
        </div>

        <div className="spaHeaderRight">
          {response && (
            <button className="rawBtn" onClick={handleToggleRaw}>
              {'{ } Raw JSON'}
            </button>
          )}
          <button
            className="editConfigBtn"
            onClick={handleOpenDrawer}
            title="Open search configuration"
          >
            <span className="editConfigIcon">⚙️</span>
            Edit Search Config
          </button>
        </div>
      </header>

      {/* ── Raw JSON Modal ── */}
      <RawJsonModal open={rawOpen} onClose={handleCloseRaw} data={response} />

      {/* ── Error banner ── */}
      {error && (
        <div className="errorBanner">
          <span>❌</span>
          <span className="errorText">{error}</span>
          <button className="errorDismiss" onClick={handleDismissError}>✕</button>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="loadingBar">
          <div className="loadingBarInner" />
        </div>
      )}

      {/* ── No search yet ── */}
      {!response && !loading && !error && (
        <div className="welcomeState">
          <span className="welcomeIcon">🔍</span>
          <h2 className="welcomeTitle">Search Debugger</h2>
          <p className="welcomeText">Start typing to search. Results appear automatically.</p>
          <p className="welcomeHint">Configure the API connection and search payload using the ⚙️ button.</p>
        </div>
      )}

      {/* ── Results ── */}
      {response && meta && (
        <>
          {/* Meta bar */}
          <div className="metaBar">
            <span className="metaCount">
              Showing <strong>{records.length}</strong> of{' '}
              <strong>{totalCount.toLocaleString()}</strong> results
              {totalPages > 1 && (
                <span className="pageNote"> · Page {currentPage} of {totalPages}</span>
              )}
              {selected.length > 0 && (
                <span className="activeFiltersNote"> · {selected.length} filter{selected.length > 1 ? 's' : ''} active</span>
              )}
            </span>
            <div className="metaBadges">
              {meta.corrected_search_term && (
                <span className="spellBadge">→ {meta.corrected_search_term}</span>
              )}
            </div>
          </div>

          {/* Meta + Sort row */}
          <div className="metaSortRow">
            {/* Meta details table */}
            <table className="metaTable">
              <thead>
                <tr>
                  <th className="metaTableHeading" colSpan={4}>META FIELDS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metaTableLabel">Total Count</td>
                  <td className="metaTableValue">{meta.total_count?.toLocaleString() ?? '—'}</td>
                  <td className="metaTableLabel">Auto Spell Correction</td>
                  <td className="metaTableValue">{meta.auto_spell_correction_applied ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td className="metaTableLabel">Corrected Search Term</td>
                  <td className="metaTableValue">{meta.corrected_search_term ?? '—'}</td>
                  <td className="metaTableLabel">Redirect URL</td>
                  <td className="metaTableValue">{meta.redirect_url ?? '—'}</td>
                </tr>
                <tr>
                  <td className="metaTableLabel">Did You Mean</td>
                  <td className="metaTableValue">{meta.did_you_mean?.join(', ') ?? '—'}</td>
                  <td className="metaTableLabel">Experiments</td>
                  <td className="metaTableValue">{meta.experiments ? JSON.stringify(meta.experiments) : '—'}</td>
                </tr>
                <tr>
                  <td className="metaTableLabel">Tagged Attributes</td>
                  <td className="metaTableValue" colSpan={3}>{meta.tagged_attributes ? JSON.stringify(meta.tagged_attributes) : '—'}</td>
                </tr>
              </tbody>
            </table>

            {/* Sort + Display controls */}
            <div className="sortControls">
              <div className="displayToggles">
                <label className="displayToggle">
                  <input
                    type="checkbox"
                    checked={globalShowRanking}
                    onChange={handleToggleRanking}
                  />
                  <span className="displayToggleSlider" />
                  <span className="displayToggleLabel">Show Ranking</span>
                </label>
                <label className="displayToggle">
                  <input
                    type="checkbox"
                    checked={globalShowFields}
                    onChange={handleToggleFields}
                  />
                  <span className="displayToggleSlider" />
                  <span className="displayToggleLabel">Show Fields</span>
                </label>
              </div>
              <label className="sortLabel">
                Sort By
                <input
                  type="text"
                  className="sortInput"
                  placeholder="e.g. price, name"
                  value={sortBy}
                  onChange={(e) => handleSortByChange(e.target.value)}
                />
              </label>
              <label className="sortLabel">
                Order
                <select
                  className="sortSelect"
                  value={sortOrder}
                  onChange={(e) => handleSortOrderChange(e.target.value as 'ascending' | 'descending')}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </label>
            </div>
          </div>

          {/* Body: Facets + Grid */}
          <div className="resultsBody">
            {facets.length > 0 && (
              <FacetPanel
                facets={facets}
                isTermSelected={isTermSelected}
                getRangeSelection={getRangeSelection}
                onToggleTerm={toggleTerm}
                onSetRange={setRange}
                onClearRange={clearRange}
                onClearAll={clearAll}
                selectedCount={selected.length}
              />
            )}

            <main className="spaMain">
              {records.length === 0 ? (
                <div className="emptyState">
                  <span className="emptyIcon">🔍</span>
                  <p>No results found.</p>
                </div>
              ) : (
                <>
                  <div className="productGrid">
                    {records.map((record) => (
                      <ProductCard
                        key={record.id}
                        record={record}
                        showRankingGlobal={globalShowRanking}
                        showFieldsGlobal={globalShowFields}
                      />
                    ))}
                  </div>

                  {/* ── Pagination ── */}
                  {totalPages > 1 && (
                    <nav className="pagination">
                      <button
                        className="pageBtn"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        ← Prev
                      </button>

                      {paginationItems.map((item, i) =>
                          item === 'ellipsis' ? (
                            <span key={`e${i}`} className="pageEllipsis">…</span>
                          ) : (
                            <button
                              key={item}
                              className={`pageBtn ${item === currentPage ? 'pageBtnActive' : ''}`}
                              onClick={() => handlePageChange(item)}
                            >
                              {item}
                            </button>
                          )
                        )}

                      <button
                        className="pageBtn"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next →
                      </button>
                    </nav>
                  )}
                </>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
