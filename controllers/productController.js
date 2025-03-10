const Product = require('../models/Product');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json({ product });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

exports.getMenClothes = async (req, res) => {
  try {
    const products = await Product.find({ category: "men's clothing" });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en la categoría "men\'s clothing"' });
    }
    res.json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos de la categoría "men\'s clothing"' });
  }
};

exports.getWomenClothes = async (req, res) => {
  try {
    const products = await Product.find({ category: "women's clothing" });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en la categoría "women\'s clothing"' });
    }
    res.json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos de la categoría "women\'s clothing"' });
  }
};

exports.getJewelery = async (req, res) => {
  try {
    const products = await Product.find({ category: "jewelery" });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en la categoría "jewelery"' });
    }
    res.json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos de la categoría "jewelery"' });
  }
};

exports.getElectronics = async (req, res) => {
  try {
    const products = await Product.find({ category: "electronics" });
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en la categoría "electronics"' });
    }
    res.json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos de la categoría "electronics' });
  }
};

exports.subtractQuantityById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const newQuantity = product.quantity - 1;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'No hay suficiente stock' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { quantity: newQuantity }, { new: true });

    res.json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la cantidad del producto' });
  }
};

exports.addQuantityById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const newQuantity = product.quantity + 1;

    const updatedProduct = await Product.findByIdAndUpdate(id, { quantity: newQuantity }, { new: true });

    res.json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la cantidad del producto' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, image, rating, quantity } = req.body;

    if (!title || !price || !description || !category || !image || !rating || !quantity) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const stripeProduct = await stripe.products.create({
      name: title,
      description: description,
      images: [image],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price,
      currency: 'clp',
    });

    const newProduct = await Product.create({
      title,
      price,
      description,
      category,
      image,
      rating,
      quantity,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Hubo un error al crear el producto' });
  }
};

