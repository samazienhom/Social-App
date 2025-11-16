"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./modules/routes"));
const connectDb_1 = require("./DB/config/connectDb");
const cors_1 = __importDefault(require("cors"));
const gateway_1 = require("./modules/gateway/gateway");
const app = (0, express_1.default)();
const bootstrap = async () => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
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
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    (0, gateway_1.initialize)(server);
    // const userModel = new UserRepo
    // const testDocumentSaveHook = async () => {
    //     const user = new UserModel({
    //         firstName: "sama",
    //         lastName: "mamdouh",
    //         email: `${Date.now()}_s@gmail.com`,
    //         password: "123"
    //     })
    //     // const user = await userModel.findOne({
    //     //     filter: {
    //     //         _id: "690cca21839db85519292a7a"
    //     //     }
    //     // })
    //     if (!user) {
    //         return
    //     }
    //     //user.email=`${Date.now()}_${user.email}`
    //     await user.save()
    //     console.log("saved");
    // }
    // const DeleteAndUpdateHook = async () => {
    //     const user = await userModel.findOne({
    //         filter: {
    //             _id: "690cca21839db85519292a7a"
    //         }
    //     })
    //     if (!user) {
    //         return
    //     }
    //     await user.updateOne({
    //         email: `${Date.now()}_${user.email}`
    //     })
    //     await user.deleteOne()
    //     console.log("updated and deleted");
    // }
    // const queryFindOneHook = async () => {
    //     const user = await userModel.findOne({
    //         filter: {
    //             _id: "690cd5084029470260caf869"
    //         }
    //     })
    //     console.log(user);
    // }
    // const findByIdandUpdateHook = async () => {
    //     const user = userModel.findOneAndUpdate({
    //         id: "690cd5084029470260caf869",
    //         update: {
    //             email: `${Date.now()}_s@gmail.com`
    //         },
    //         options: {
    //             new: true
    //         }
    //     })
    // }
    // const InserManyHook = async () => {
    //     const users = await userModel.inserMany({
    //         docs: [{
    //             firstName: "test1",
    //             lastName: "mamdouh",
    //             email: `${Date.now()}_s@gmail.com`,
    //             password: "123"
    //         }]
    //     })
    //     console.log("inserted successfully", users);
    // }
    // // InserManyHook()
    // // findByIdandUpdateHook()
    // // queryFindOneHook()
    // // DeleteAndUpdateHook()
    // // testDocumentSaveHook()
    // // emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL,{to:"xxxsama87@gmail.com",subject:"hi",html:"<h1>hi</h1>"})
};
exports.default = bootstrap;
