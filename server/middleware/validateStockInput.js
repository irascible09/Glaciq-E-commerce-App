module.exports = (req, res, next) => {
    const value =
        req.body.addedBottles ?? req.body.reduceBottles;

    if (!Number.isInteger(value) || value <= 0) {
        return res.status(400).json({
            message: "Quantity must be a positive integer",
        });
    }

    next();
};
