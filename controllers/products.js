const { shopifyStorefrontAPI } = require('../services/shopify');

const getAllProducts = async (req, res) => {
  try {
    const query = `
      {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await shopifyStorefrontAPI(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts };
