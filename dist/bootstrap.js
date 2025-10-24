"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./modules/routes"));
const connectDb_1 = require("./DB/config/connectDb");
const app = (0, express_1.default)();
const bootstrap = async () => {
    app.use(express_1.default.json());
    app.use('/api/v1', routes_1.default);
    const port = process.env.PORT || 5000;
    await (0, connectDb_1.DBconnection)();
    app.use((err, req, res, next) => {
        console.log({ err });
        res.status(err.statusCode || 500).json({
            message: err.message,
            stack: err.stack,
            status: err.statusCode || 500
        });
    });
    // emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL,{to:"xxxsama87@gmail.com",subject:"hi",html:"<h1>hi</h1>"})
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
exports.default = bootstrap;
