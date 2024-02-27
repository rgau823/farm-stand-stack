const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
.then(()=> {
  console.log('Mongo connection open');
})
.catch(err => {
  console.log('Mongo error detected');
  console.log(err);
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))



app.post('/products', async (req, res) => {
  const newP = new Product(req.body);
  await newP.save();
  console.log(newP);
  res.redirect(`/products/${newP._id}`)
})

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products/new', (req,res)=> {
  res.render('products/new', { categories })
})

app.get('/products', async (req, res)=> {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category })
    res.render('products/index', { products, category })
  } else {
    const products = await Product.find({})
    res.render('products/index', { products, category: 'All' })
  }
  
 
})

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product })
})

app.get('/products/:id/edit', async(req, res)=> {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product, categories });
})

app.put('/products/:id', async(req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
  res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req, res)=>{
  const { id } = req.params;
  const deletedP = await Product.findByIdAndDelete(id);
  res.redirect('/products')
})


app.listen(3000, ()=> {
  console.log('APP LISTENING ON PORT 3000');
})