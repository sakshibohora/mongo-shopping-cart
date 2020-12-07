import express from 'express';
const router = express.Router();

import Product from '../models/products';


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    // const products = await Product.find();
    Product.find((err, products) => {
      console.log("products", products.length)
      const chunkSize = 3;
      const productChunks = [];
      for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', product: productChunks });
    })
  } catch (error) {
    console.log("error===>", error)
  }
});


module.exports = router;
