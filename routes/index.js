import express from 'express';
const router = express.Router();

import Product from '../models/products';
import Cart from '../models/cart';
import Order from '../models/order';

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    // const products = await Product.find();
    const successMsg = req.flash('success')[0];
    Product.find((err, products) => {
      // console.log("products", products.length)
      const chunkSize = 3;
      const productChunks = [];
      for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
      }
      res.render('shop/index', { title: 'Shopping Cart', product: productChunks, successMsg: successMsg, noMessage: !successMsg });
    })
  } catch (error) {
    console.log("error===>", error)
  }
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;

  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log("req.session.cart>>>>>>>", req.session.cart)
    res.redirect('/');

  })
})

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null })
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
})

router.get('/checkout',isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart')
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg })
})

router.post('/checkout', isLoggedIn, async (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart')
  }
  const cart = new Cart(req.session.cart);
  const stripe = require('stripe')('sk_test_51HyZTKF8dmL4MATwwoBCtD2EV0AnjoEaJw9GX8ZGfMGxKKUTF6CwtRHpJKXY7wXQO93UxUBXfvARE4I6O2bKRXof00t3SjgOoh');

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  console.log(" cart.totalPrice===>", cart.totalPrice)
  const charge = await stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'inr',
    source: 'tok_amex',
    description: 'My First Test Charge (created for API docs)',
  });
  console.log("t ~ charge", charge)
  if (!charge) {
    req.flash('error')
    return res.redirect('/checkout')
  }
  const order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    paymentId: charge.id,
    name: req.body.name,
  });
  order.save((err, result) => {
    req.flash('success', 'Successfully bought product');
    req.session.cart = null;
    return res.redirect('/')
  })

  // res.render('shop/checkout', {total: cart.totalPrice })
})
module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl= req.url;
  res.redirect('/user/signin');
}