const { shopifyAdminAPI } = require('../services/shopifyAdmin');

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
              productType
              vendor
              tags
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              metafields(first: 50) {
                edges {
                  node {
                    namespace
                    key
                    value
                    type
                  }
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    title
                    price
                    availableForSale
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await shopifyAdminAPI(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts };
