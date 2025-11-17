const axios = require('axios');

async function shopifyStorefrontAPI(query, variables = {}) {
  const { data } = await axios.post(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
    }
  );

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
}

module.exports = { shopifyStorefrontAPI };
