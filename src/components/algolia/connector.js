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
    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter(
        'aroundLatLng',
        `${aroundLatLng.lat}, ${aroundLatLng.lng}`
      );
  },
});
