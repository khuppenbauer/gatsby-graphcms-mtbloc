import React from 'react';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { Link } from "gatsby"
import { PlayCircle, StopCircle } from "react-feather"

import { renderMetaData } from "../../../helpers/track"

const createSuggestionsPlugin = (
  searchClient,
  indexName,
) => {
  return createQuerySuggestionsPlugin({
    searchClient,
    indexName,
    transformSource({ source }) {
      return {
        ...source,
        sourceId: 'trackIndex',
        templates: {
          header() {
            return (
              <React.Fragment>
                <span className="aa-SourceHeaderTitle">Touren</span>
                <div className="aa-SourceHeaderLine" />
              </React.Fragment>
            );
          },
          item({ item }) {
            const { 
              title, slug, distance, totalElevationGain, totalElevationLoss, previewImageUrl,
              startCity, endCity,
            } = item;
            const gatsbyPath = `/tracks/${slug}`;
            return (
              <Link to={gatsbyPath}>
                <div className="w-full">
                  <div className="flex">
                    <div className="inline-flex items-center justify-center pr-8">
                      <img src={previewImageUrl} alt={title} width="120" height="90" />
                    </div>
                    <div>
                      <h2 className="text-gray-900 text-lg title-font font-medium mb-2">{title}</h2>
                      <div className="mb-2">
                        <span className="text-gray-500 inline-flex items-center mr-2 leading-none text-sm">
                          <PlayCircle className="w-4 h-4 mr-1" />
                          {startCity}
                        </span>
                        <div className="text-gray-500 inline-flex items-center leading-none text-sm">
                          <StopCircle className="w-4 h-4 mr-1" />
                          {endCity}
                        </div>
                      </div>
                      <span className="flex items-center flex-wrap mb-2">
                        {renderMetaData({ distance, totalElevationGain, totalElevationLoss })}
                      </span>
                    </div>
                  </div>
              </div>
              </Link>
            );
          },
        },
      };
    },
  });
};

export { createSuggestionsPlugin };
