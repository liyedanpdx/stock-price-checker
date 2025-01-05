// 'use strict';

// module.exports = function (app) {

//   app.route('/api/stock-prices')
//     .get(function (req, res){
//       //GET https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote
//     });
    
// };

'use strict';
const fetch = require('node-fetch');

// Store likes in memory (In production, should use a database)
const stockLikes = new Map();

async function getStockPrice(symbol) {
  try {
    const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
    const data = await response.json();
    return data.latestPrice;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

function getLikes(symbol) {
  if (!symbol) return 0;
  const likes = stockLikes.get(symbol);
  if (!likes) return 0;
  return likes.size;
}
function addLike(symbol, ip) {
  const likes = stockLikes.get(symbol) || new Set();
  likes.add(ip);
  stockLikes.set(symbol, likes);
  return likes.size;
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const stocks = Array.isArray(req.query.stock) ? req.query.stock : [req.query.stock];
      const like = req.query.like === 'true';
      const ip = req.ip;

      try {
        // Handle single stock
        if (stocks.length === 1) {
          const symbol = stocks[0].toUpperCase();
          const price = await getStockPrice(symbol);
          
          if (like) {
            addLike(symbol, ip);
          }
          
          res.json({
            stockData: {
              stock: symbol,
              price: price,
              likes: getLikes(symbol)
            }
          });
        }
        // Handle stock comparison
        else if (stocks.length === 2) {
          const results = await Promise.all(stocks.map(async (symbol) => {
            symbol = symbol.toUpperCase();
            if (like) {
              addLike(symbol, ip);
            }
            return {
              symbol,
              price: await getStockPrice(symbol),
              likes: getLikes(symbol)
            };
          }));
          // Calculate relative likes
          const rel_likes1 = results[0].likes - results[1].likes;
          const rel_likes2 = results[1].likes - results[0].likes;

          res.json({
            stockData: [
              {
                stock: results[0].symbol,
                price: results[0].price,
                rel_likes: rel_likes1
              },
              {
                stock: results[1].symbol,
                price: results[1].price,
                rel_likes: rel_likes2
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
};