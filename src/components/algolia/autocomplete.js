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
} from 'react-instantsearch-hooks';
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { debounce } from '@algolia/autocomplete-shared';

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
  }, [instantSearchUiState, setQuery, setPage]);

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
          },
        };
      },
    });

    const querySuggestionsPlugin = createSuggestionsPlugin(
      searchClient,
      indexName,
    );

    return [
      recentSearchesPlugin,
      querySuggestionsPlugin,
    ];
  }, [searchClient, indexName]); 

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
      },
      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
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