export const authenticate = (req, res, next) => {
    const userId = req.headers['user-id'];
    const role = req.headers['user-role'];

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated (missing user-id)',
        });
    }

    req.user = {
        id: userId,
        role,
    };

    next();
};
