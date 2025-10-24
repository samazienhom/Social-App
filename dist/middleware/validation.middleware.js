"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation = (schema) => {
    return async (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query
        };
        const validationResult = await schema.safeParseAsync(data);
        if (!validationResult.success) {
            return res.status(422).json({
                message: "Validation Error",
                errors: JSON.parse(validationResult.error)
            });
        }
        next();
    };
};
exports.default = validation;
