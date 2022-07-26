import {
  default as React,
  createElement,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { render } from 'react-dom';

import {
  useSearchBox,
  usePagination,
  useInstantSearch,
  useSortBy,
} from 'react-instantsearch-hooks';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { debounce } from '@algolia/autocomplete-shared';

import { createMapboxGeocodingPlugin } from './autocompletePlugins/mapboxGeocodingPlugin';
import { createSuggestionsPlugin } from './autocompletePlugins/createSuggestionsPlugin';

import '@algolia/autocomplete-theme-classic';

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const Autocomplete = ({
  searchClient,
  className,
  indexName,
  ...autocompleteProps
}) => {
  const autocompleteContainer = useRef(null);

  const { query, refine: setQuery } = useSearchBox();
  const { refine: setPage } = usePagination();
  const { setIndexUiState } = useInstantSearch();
  const { refine: setSortBy } = useSortBy({ items: []});

  const [
    instantSearchUiState,
    setInstantSearchUiState,
  ] = useState({ query });
  const debouncedSetInstantSearchUiState = debounce(
    setInstantSearchUiState,
    500
  );

  useEffect(() => {
    setQuery(instantSearchUiState.query);
    setPage(0);
    setSortBy(indexName);
  }, [instantSearchUiState, setQuery, setPage, setSortBy, indexName]);

  const plugins = useMemo(() => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }) {
            setInstantSearchUiState({
              query: item.label,
            });
            setIndexUiState((prevIndexUiState) => ({
              ...prevIndexUiState,
              configure: {
                ...prevIndexUiState.configure,
                aroundLatLng: '',
              }
            }));
          },
        };
      },
    });

    const mapboxGeocodingPlugin = createMapboxGeocodingPlugin(
      {
        fuzzyMatch: true,
        autocomplete: true,
        types: ['postcode', 'place', 'poi', 'address'],
        country: ['DE', 'AT', 'CH', 'IT', 'ES', 'FR', 'CZ'],
        access_token: mapboxToken,
      },
      (item) => {
        const { geometry } = item;
        const { coordinates } = geometry;
        setInstantSearchUiState({
          query: '',
        });
        setIndexUiState((prevIndexUiState) => ({
          ...prevIndexUiState,
          configure: {
            ...prevIndexUiState.configure,
            aroundLatLng: `${coordinates[1]},${coordinates[0]}`,
            aroundRadius: 5000,
            getRankingInfo: true,
          }
        }));
      },
    );

    const querySuggestionsPlugin = createSuggestionsPlugin(
      searchClient,
      indexName,
    );

    return [
      recentSearchesPlugin,
      mapboxGeocodingPlugin,
      querySuggestionsPlugin,
    ];
  }, [searchClient, indexName, setIndexUiState]); 

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      initialState: { query },
      plugins,
      onReset() {
        setInstantSearchUiState({ query: '' });
        setIndexUiState((prevIndexUiState) => ({
          ...prevIndexUiState,
          configure: {
            ...prevIndexUiState.configure,
            aroundLatLng: '',
          }
        }));
        
      },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
        setIndexUiState((prevIndexUiState) => ({
          ...prevIndexUiState,
          configure: {
            ...prevIndexUiState.configure,
            aroundLatLng: '',
          }
        }));
      },
      onStateChange({ prevState, state }) {
        if (prevState.query !== state.query) {
          debouncedSetInstantSearchUiState({
            query: state.query,
          });
        }
      },
      renderer: { createElement, Fragment, render },
    });

    return () => autocompleteInstance.destroy();
  }, [plugins]);

  return <div ref={autocompleteContainer} />;
}

export default Autocomplete;