require('@babel/register')({
  presets: ['@babel/preset-env']
})

require('@babel/polyfill')

const mongoose = require("mongoose");
const Product = require("../models/products");
mongoose.connect('mongodb://localhost:27017/shoppingCart', { useNewUrlParser: true });
const products = [
  new Product({
    imagePath: "https://www.raajkart.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/t/h/the_greatness_guide.jpg",
    title: "THe greatness guide!",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "The monk who sold his ferrari",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://rukminim1.flixcart.com/image/416/416/jsaocy80/book/3/2/3/who-will-cry-when-you-die-original-imafdw8gnfnvtam5.jpeg?q=70",
    title: "Who will cry when you die!",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Family wisdom!",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Leadership wisdom!",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "The secret letter",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Robin sharma book 6",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Robin sharma book 7",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://www.akshardhara.com/40970-large_default/Discover-Your-Destiny-Robin-Sharma-Jaico-Books-buy-marathi-books-online-at-akshardhara.jpg",
    title: "Discover Your destiny!",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Robin sharma book 9",
    description: "Awesome book!",
    price: 20
  }),
  new Product({
    imagePath: "https://images-na.ssl-images-amazon.com/images/I/61Iz2yy2CKL.jpg",
    title: "Robin sharma book 10",
    description: "Awesome book!",
    price: 20
  })
];

products.forEach((product) => {
  try {
    product.save()
      .then(doc => {
        console.log("doc>>", doc)
      })
      .catch(err => {
        console.error("err>>>", err)
      })
  } catch (error) {
      console.log("error==>",error);
  }
})

// var done = 0;
// for (var i = 0; i < products.length; i++) {
// console.log("products[i]", products[i])
// products[i].save(function (err, result) {
//   console.log("result", result)
//   if (err) return console.error("err----->>", err);
//   done++;
//   console.log("done", done)
//   if (done === products.length) {
//     exit();
//   }
// });
// }
// try {
//   console.log("hiiii");
//   products.save()
//     .then(doc => {
//       console.log("doc>>", doc)
//     })
//     .catch(err => {
//       console.error("err>>>", err)
//     })
// } catch (error) {
//   console.log(" error", error)

// }


// function exit() {
//   mongoose.disconnect();
// }