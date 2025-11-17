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
              priceRangeV2 {
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
              metafields(first: 50) {
                edges {
                  node {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await shopifyAdminAPI(query);

    // Simplify the response
    const products = result.products.edges.map((edge) => {
      const product = edge.node;

      // Convert metafields to simple key-value object
      const metafields = {};
      product.metafields.edges.forEach((metafield) => {
        metafields[metafield.node.key] = metafield.node.value;
      });

      // Convert images to simple array
      const images = product.images.edges.map((img) => img.node.url);

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        handle: product.handle,
        price: product.priceRangeV2.minVariantPrice.amount,
        currency: product.priceRangeV2.minVariantPrice.currencyCode,
        images: images,
        metafields: metafields,
      };
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllProducts };
