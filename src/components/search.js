import algoliasearch from "algoliasearch/lite"
import { default as React, useMemo } from "react"
import { 
  InstantSearch,
  Configure,
} from "react-instantsearch-dom"
import { Tab } from '@headlessui/react'
import { Grid, Map, Menu } from 'react-feather';

import CustomRadius from "./algolia/aroundRadius"
import CustomCurrentRefinements from "./algolia/currentRefinement"
import CustomHierarchicalMenu from "./algolia/hierarchicalMenu"
import CustomGrid from "./algolia/grid"
import CustomList from "./algolia/list"
import CustomPagination from "./algolia/pagination"
import CustomPlaces from "./algolia/places"
import CustomStats from "./algolia/stats"
import CustomSortBy from "./algolia/sortBy"
import CustomMap from "./algolia/map"

import Headline from "../views/headline"

const indexName = "tracks";
const hitsPerPage = 100;

const Search = () => {
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID,
        process.env.GATSBY_ALGOLIA_SEARCH_KEY
      ),
    []
  )
  const buttonClass = 'relative inline-flex items-center px-2 py-2 border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800';
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
            />        	
          </div>
          <div className="md:flex md:flex-col md:w-3/4 md:pl-12">
            <Headline title="Suche" />
            <CustomPlaces />
            <Tab.Group>
              <div className="pt-5">
                <Tab.List>
                  <Tab
                    className={({ selected }) =>
                      selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                    }
                  >
                    <Grid className="h-5 w-5" />
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                    }
                  >
                    <Menu className="h-5 w-5" />
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                    }
                  >
                    <Map className="h-5 w-5" />
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels>
                <Tab.Panel>
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
                  <CustomGrid />
                  <CustomPagination />
                </Tab.Panel>
                <Tab.Panel>
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
                  <CustomList />
                  <CustomPagination />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="py-3 md:py-5">
                    <div className="flex flex-wrap">
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
                    <CustomMap hitsPerPage={hitsPerPage} />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </InstantSearch>
      </div>
    </section>
  );
}

export default Search;
