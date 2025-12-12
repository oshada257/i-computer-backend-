import jwt from 'jsonwebtoken';

export default function auturizationMiddleware(req, res, next) {

    const header = req.headers['authorization'];

    if (header != null) {
        const token = header.replace('Bearer ', '');

        jwt.verify(token, "your-secret-key-here", (err, decoded) => {

            if (err || decoded == null) {
                res.status(401).json(
                    {
                        message: "Unauthorized access"
                    }
                )
            } else {
                req.user = decoded;
                next();
            }
        }
        )
    } else {
        next();
    }
}   