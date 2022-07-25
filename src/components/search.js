import algoliasearch from "algoliasearch/lite"
import { default as React, useMemo } from "react"
import { 
  InstantSearch, 
  Configure,
} from 'react-instantsearch-hooks-web';

import CustomCurrentRefinements from "./algolia/currentRefinement"
import CustomHierarchicalMenu from "./algolia/hierarchicalMenu"
import CustomHits from "./algolia/hits"
import CustomPagination from "./algolia/pagination"
import CustomStats from "./algolia/stats"
import CustomSortBy from "./algolia/sortBy"

import Header from "../views/header"
import Headline from "../views/headline"

const indexName = "tracks";

const Search = () => {
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
      ),
    []
  )

  return (
    <section className="text-gray-400 body-font bg-gray-900">
      <div className="container md:flex md:flex-wrap px-5 py-5 mx-auto">
        <InstantSearch indexName={indexName} searchClient={searchClient}>
          <Configure filters="NOT private:true" />
          <div className="md:w-1/4 md:pr-12 md:border-r md:border-b-0 md:mb-0 mb-10 pb-10 border-b border-gray-800">       
            <Headline title="Filter" />
            <CustomCurrentRefinements />
            <CustomHierarchicalMenu 
              attributes={[
                'hierarchicalCategories.lvl0',
                'hierarchicalCategories.lvl1',
                'hierarchicalCategories.lvl2',
              ]}
              limit={100}
            />        	
          </div>
          <div className="md:flex md:flex-col md:w-3/4 md:pl-12">
            <Header title="Suche" />
            <div className="flex flex-wrap">
              <div className="w:1/5">
                <CustomStats />
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
          </div>
        </InstantSearch>
      </div>
    </section>
  );
}

export default Search;
