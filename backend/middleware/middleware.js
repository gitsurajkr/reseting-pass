const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/Jwtkey');

const authMiddleware = (req, res, next) => {
    
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not found or invalid format. Use: Bearer <token>' });
    }

    const token = authorization.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; 
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {authMiddleware};
