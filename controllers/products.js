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
                    type
                    reference {
                      ... on Metaobject {
                        handle
                        fields {
                          key
                          value
                        }
                      }
                    }
                    references(first: 10) {
                      edges {
                        node {
                          ... on Metaobject {
                            handle
                            fields {
                              key
                              value
                            }
                          }
                        }
                      }
                    }
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
      product.metafields.edges.forEach((metafieldEdge) => {
        const metafield = metafieldEdge.node;
        const key = metafield.key;

        // Check if it's a metaobject reference
        if (metafield.references && metafield.references.edges.length > 0) {
          // Multiple references (list)
          const values = metafield.references.edges.map((ref) => {
            const titleField = ref.node.fields.find((f) => f.key === 'title');
            return titleField ? titleField.value : ref.node.handle;
          });
          metafields[key] = values.join(', ');
        } else if (metafield.reference) {
          // Single reference
          const titleField = metafield.reference.fields.find(
            (f) => f.key === 'title'
          );
          metafields[key] = titleField
            ? titleField.value
            : metafield.reference.handle;
        } else {
          // Regular value
          metafields[key] = metafield.value;
        }
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
