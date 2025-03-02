const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createCheckoutSession = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.cart || user.cart.length === 0) {
      throw new Error("El carrito está vacío o el usuario no existe");
    }

    const lineItems = [];
    for (const item of user.cart) {
      const prices = await stripe.prices.list({
        product: item.stripe_product_id, 
      });

      if (prices.data.length === 0) {
        throw new Error(`No se encontró precio para el producto ${item.stripe_product_id}`);
      }

      const price = prices.data[0];  

      lineItems.push({
        price: price.id, 
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://youtube.com',
      cancel_url: 'https://facebook.com',
    });

    return session.url;
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    throw error;
  }
};
