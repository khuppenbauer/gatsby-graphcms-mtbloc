import { default as React, useMemo, useState, useRef, useEffect, useCallback } from "react"
import { 
  InstantSearch,
  Configure,
  connectSearchBox,
} from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import qs from "qs";

import CustomRadius from "./algolia/aroundRadius"
import CustomCurrentRefinements from "./algolia/currentRefinement"
import CustomHierarchicalMenu from "./algolia/hierarchicalMenu"
import CustomHits from "./algolia/hits"
import CustomPagination from "./algolia/pagination"
import CustomPoweredBy from "./algolia/poweredBy"
import CustomStats from "./algolia/stats"
import CustomSortBy from "./algolia/sortBy"
import CustomAutocomplete from './algolia/autocomplete';
import { createMapboxGeocodingPlugin } from './algolia/autocompletePlugins/mapboxGeocodingPlugin';
import { createSuggestionsPlugin } from './algolia/autocompletePlugins/createSuggestionsPlugin';

import '@algolia/autocomplete-theme-classic/dist/theme.css';

import Header from "../views/header"
import Headline from "../views/headline"

const indexName = "tracks";
const hierarchicalAttributes = [
  'hierarchicalCategories.lvl0',
  'hierarchicalCategories.lvl1',
  'hierarchicalCategories.lvl2',
];
const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN;

const createURL = (searchState) => {
  return qs.stringify(searchState, { addQueryPrefix: true });
}

const searchStateToUrl = ({ location }, searchState) => {
  if (Object.keys(searchState).length === 0) {
    return '';
  }
  return `${location.pathname}${createURL(searchState)}`;
}

const urlToSearchState = ({ search }) => {
  return qs.parse(search.slice(1));
}

const VirtualSearchBox = connectSearchBox(() => null);

const Search = () => {
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
      ),
    []
  )

  const [searchState, setSearchState] = useState(() =>
    urlToSearchState(window.location)
  );
  const [currentLocation, setCurrentLocation] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      window.history.pushState(
        searchState,
        null,
        searchStateToUrl({ location: window.location }, searchState)
      );
    }, 400);
  }, [searchState]);

  const onSubmit = useCallback(({ state }) => {
    console.log(state);
    setCurrentLocation(null);
    setSearchState((searchState) => ({
      ...searchState,
      query: state.query,
    }));
  }, []);

  const onReset = useCallback(() => {
    setSearchState((searchState) => ({
      ...searchState,
      query: '',
    }));
  }, []);

  const plugins = useMemo(() => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            header() {
              return (
                <React.Fragment>
                  <span className="aa-SourceHeaderTitle">Letzte Suchbegriffe</span>
                  <div className="aa-SourceHeaderLine" />
                </React.Fragment>
              );
            },
            item(params) {
              const { item, html } = params;
              return html`<a className="aa-ItemLink" href="/search?query=${item.label}">
                ${source.templates.item(params).props.children}
              </a>`;
            },
          },
          onSelect({ item }) {
            setSearchState((searchState) => ({
              ...searchState,
              query: item.label,
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
        setCurrentLocation({lat: coordinates[1], lng: coordinates[0], name: item.place_name});
        setSearchState((searchState) => ({
          ...searchState,
          query: '',
          aroundRadius: 5000,
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
  }, []); 

  return (
    <section className="text-gray-400 body-font bg-gray-900">
      <div className="container md:flex md:flex-wrap px-5 py-5 mx-auto">
        <InstantSearch 
          indexName={indexName}
          searchClient={searchClient}
          searchState={searchState}
          onSearchStateChange={setSearchState}
          createURL={createURL}
        >
          <Configure 
            filters="NOT private:true"
            aroundLatLng={currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : ''}
          />
          <div className="md:w-1/4 md:pr-12 md:border-r md:border-b-0 md:mb-0 mb-10 pb-10 border-b border-gray-800">       
            <Headline title="Filter" />
            <CustomCurrentRefinements />
            <CustomHierarchicalMenu 
              attributes={hierarchicalAttributes}
            />        	
          </div>
          <div className="md:flex md:flex-col md:w-3/4 md:pl-12">
            <Header title="Suche" />
            <VirtualSearchBox />
            <CustomAutocomplete
              initialState={{
                query: searchState.query,
              }}
              placeholder={currentLocation ? currentLocation.name : 'Ort, PLZ oder Name der Tour'}
              openOnFocus={true}
              onSubmit={onSubmit}
              onReset={onReset}
              plugins={plugins}
            />
            <div className="flex flex-wrap">
              <div className="w:1/5">
                <CustomStats />
              </div>
              <div className="w:4/5">
                <CustomRadius
                  items={[
                    { value: 1000, label: '1 km' },
                    { value: 5000, label: '5 km' },
                    { value: 10000, label: '10 km' },
                    { value: 20000, label: '20 km' },
                    { value: 50000, label: '50 km' },
                  ]}
                />
              </div>
            </div>
            <CustomSortBy
              defaultRefinement={indexName}
              items={[
                { value: `${indexName}`, label: 'Standard' },
                { value: `${indexName}_title_asc`, label: 'Name', dir: 'asc' },
                { value: `${indexName}_title_desc`, label: 'Name', dir: 'desc' },
                { value: `${indexName}_distance_asc`, label: 'Länge', dir: 'asc' },
                { value: `${indexName}_distance_desc`, label: 'Länge', dir: 'desc' },
                { value: `${indexName}_elevation_asc`, label: 'Höhenmeter', dir: 'asc' },
                { value: `${indexName}_elevation_desc`, label: 'Höhenmeter', dir: 'desc' },

              ]}
            />
            <CustomHits />
            <CustomPagination />
            <div className="bg-gray-900 px-4 py-3 md:flex md:flex-col items-center justify-between sm:px-6">
              <CustomPoweredBy />
            </div>
          </div>
        </InstantSearch>
      </div>
    </section>
  );
}

export default Search;
