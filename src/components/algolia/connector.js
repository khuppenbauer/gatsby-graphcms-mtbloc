import { createConnector } from 'react-instantsearch-dom';

export default createConnector({
  displayName: 'AlgoliaGeoSearch',

  getProvidedProps() {
    return {};
  },

  refine(props, searchState, nextValue) {
    return {
      ...searchState,
      aroundLatLng: nextValue,
      boundingBox: {},
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const { aroundLatLng } = searchState;
    if (!aroundLatLng) {
      return searchParameters.setQueryParameter('insideBoundingBox')  
    }
    const { lat, lng } = aroundLatLng;
    if (!lat && !lng) {
      return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLng');
    }
    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLng', `${lat}, ${lng}`)
      .setQueryParameter('aroundRadius', 5000)
      .setQueryParameter('getRankingInfo', true);
  },
});
