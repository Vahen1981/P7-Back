const express = require('express');
const productRouter = express.Router();
const auth = require('../middleware/Authorization');
const { getAllProducts, getProductById, getMenClothes, getWomenClothes, getJewelery, getElectronics, subtractQuantityById, addQuantityById } = require('../controllers/productController');


productRouter.get('/all', getAllProducts); //http://localhost:8000/api/products/all
productRouter.get('/:id', getProductById); //http://localhost:8000/api/products/:id
productRouter.get('/category/menclothes', getMenClothes); //http://localhost:8000/api/products/category/menclothes
productRouter.get('/category/womenclothes', getWomenClothes); //http://localhost:8000/api/products/category/womenclothes
productRouter.get('/category/jewelery', getJewelery); //http://localhost:8000/api/products/category/jewelery
productRouter.get('/category/electronics', getElectronics); //http://localhost:8000/api/products/category/electronics
productRouter.put('/quantity/subtract/:id', subtractQuantityById); //http://localhost:8000/api/products/quantity/subtract/:id
productRouter.put('/quantity/add/:id', addQuantityById); //http://localhost:8000/api/products/quantity/add/:id

module.exports = productRouter;