require('@babel/register')({
    presets: ['@babel/preset-env']
  })
  
  require('@babel/polyfill')

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    imagePath: {type: String, required:true},
    title: {type: String, required:true},
    description: {type: String, required:true},
    price: {type: Number, required:true},
})

const Product = mongoose.model('Products',schema);
module.exports =  Product;