const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }
    try {
        const [ type, token ] = authorization.split(' ');
        if(type === 'Token' || type === 'Bearer'){
            const openToken = jsonwebtoken.verify(token, process.env.SECRET);
            req.user = openToken.user;
            next();
        } else {
            return res.status(401).json({ message: 'Acceso no autorizado' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Error al verificar usuario' });
    }
}