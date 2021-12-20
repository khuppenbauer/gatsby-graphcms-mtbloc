const algoliasearch = require('algoliasearch');

const appId = process.env.GATSBY_ALGOLIA_APP_ID
const searchKey = process.env.GATSBY_ALGOLIA_SEARCH_KEY

export default async function handler(req, res) {
  const body = req.body;
  const { index: algoliaIndex, query } = body;
  const client = algoliasearch(appId, searchKey);
  const index = client.initIndex(algoliaIndex);
  index.search('', query).then((data) => {
    res.status(200).json(data);
  });
}
