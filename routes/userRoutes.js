const express = require('express');
const { getAllUsers, registerUser, userLogin, userVerify, updateVerifiedUser, deleteVerifiedUser, addProductToCart, getUserCart, substractProductQuantityFromCart, removeProductFromCart, verifyPassword } = require('../controllers/userController');
const userRouter = express.Router();
const auth = require('../middleware/Authorization');


userRouter.post('/register', registerUser);
userRouter.get('/all-users', getAllUsers);
userRouter.post('/login', userLogin);
userRouter.get('/verify', auth, userVerify);
userRouter.put('/update', auth, updateVerifiedUser);
userRouter.delete('/delete', auth, deleteVerifiedUser);
userRouter.put('/addToCart', auth, addProductToCart);
userRouter.put('/removeQuantity', auth, substractProductQuantityFromCart);
userRouter.put('/removeProduct', auth, removeProductFromCart);
userRouter.get('/cart/:id', auth, getUserCart);
userRouter.post('/verify/:id', verifyPassword);

module.exports = userRouter;
