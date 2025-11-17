const { shopifyQuery } = require('../services/shopifyService');

async function getAllProducts(req, res) {
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

    const data = await shopifyQuery(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllProducts };
