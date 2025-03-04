const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);

        if (!user || !user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío o el usuario no existe" });
        }

        const lineItems = [];
        for (const item of user.cart) {
            const prices = await stripe.prices.list({
                product: item.stripe_product_id, 
            });

            if (prices.data.length === 0) {
                return res.status(400).json({ message: `No se encontró precio para el producto ${item.stripe_product_id}` });
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
            success_url: 'http://localhost:5173/successful-payment',
            cancel_url: 'http://localhost:5173/failed-payment',
            // Descomentar las siguientes líneas para el despliegue en railway
            // success_url: 'https://p7-front-production.up.railway.app/successful-payment',
            // cancel_url: 'https://p7-front-production.up.railway.app/failed-payment',
        });

        return res.json({ session_url: session.url });
    } catch (error) {
        console.error("Error al crear la sesión de pago:", error);
        return res.status(500).json({ message: 'Error al crear la sesión de pago' });
    }
};

