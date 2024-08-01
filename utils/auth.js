import jwt from 'jsonwebtoken';

// Generate a token
export const generateToken = (user) => {
    const userToken = {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
    };
    return jwt.sign(userToken, process.env.JWT_SECRET, {
        expiresIn: '1w'
    });
};

// Verify token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access denied! No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).json({
            message: 'Invalid Token'
        });
    }
};

// Check if user is admin
export const checkAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            message: 'Access denied! Admins only'
        });
    }
    next();
};