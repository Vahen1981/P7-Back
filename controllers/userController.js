const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Este correo ya está registrado' });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const createdUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        return res.status(201).json({ 
            id: createdUser._id, 
            username: createdUser.username, 
            email: createdUser.email 
        });
    } catch (error){
        console.error(error);
        return res.status(400).json({ message: 'Error al crear usuario' });
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const registeredUser = await User.findOne({ email });
        if(!registeredUser){
            return res.status(400).json({ message: 'El usuario o la contraseña no corresponde' });
        }
        const rightPassword = await bcryptjs.compare(password, registeredUser.password);
        if(!rightPassword){
            return res.status(400).json({ message: 'El usuario o la contraseña no corresponde' });
        }
        const payload = { user: { id: registeredUser._id } };
        jsonwebtoken.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600
            },
            (error, token) => {
                if (error) throw error;
                res.json({
                    token,
                    id: registeredUser._id,
                    email: registeredUser.email,
                    username: registeredUser.username,
                });
            }
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
}

exports.verifyPassword = async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    try{
        const user = await User.findById(id);
        const rightPassword = await bcryptjs.compare(password, user.password);
        if(rightPassword){
            return res.status(200).json({ message: 'La contraseña corresponde' });
        }
        if(!rightPassword){
            return res.status(400).json({ message: 'La contraseña NO corresponde' });
        }
    } catch (error) {
        console.error(error);
    }
}

exports.addProductToCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const user = await User.findById(userId);
        
        const productExists = user.cart.some(item => item.productId.toString() === productId);

        if (productExists) {
            const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
            user.cart[productIndex].quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito' });
    }
};

exports.substractProductQuantityFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const user = await User.findById(userId);
        const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(200).json({ cart: user.cart, message: "Producto no encontrado en el carrito" }); 
        }

        if(user.cart[productIndex].quantity > 1){
            user.cart[productIndex].quantity -= 1;
        } else {

        }

        await user.save();
        res.status(200).json({ cart: user.cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al quitar producto del carrito' });
    }
}

exports.removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const user = await User.findById(userId);
        const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(200).json({ cart: user.cart, message: "Producto no encontrado en el carrito" }); 
        }

        user.cart.splice(productIndex, 1);
        await user.save();
        res.status(200).json({ cart: user.cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al quitar producto del carrito' });
    }
}

exports.getUserCart = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        console.log(user.cart);
        res.json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos del carrito' });
    }
}

exports.userVerify = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al verificar el usuario' });
    }
}

exports.updateVerifiedUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userId = req.user.id;

        if (email) {
            const emailExist = await User.findOne({ email });
            if (emailExist && emailExist.id !== userId) {
                return res.status(400).json({ message: 'El correo ya está registrado por otro usuario' });
            }
        }

        let hashedPassword = password;
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashedPassword = await bcryptjs.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(201).json({ 
            username: updatedUser.username, 
            email: updatedUser.email 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

exports.deleteVerifiedUser = async(req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        return res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}