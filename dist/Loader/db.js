"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("src/config"));
const Challenge_1 = __importDefault(require("src/models/Challenge"));
const Concert_1 = __importDefault(require("src/models/Concert"));
const User_1 = __importDefault(require("src/models/User"));
const Admin_1 = __importDefault(require("src/models/Admin"));
const Badge_1 = __importDefault(require("src/models/Badge"));
const Comment_1 = __importDefault(require("src/models/Comment"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        User_1.default.createCollection().then(function (collection) {
            console.log("User Collection is created!");
        });
        Challenge_1.default.createCollection().then(function (collection) {
            console.log("Challenge Collection is created!");
        });
        Concert_1.default.createCollection().then(function (collection) {
            console.log("Concert Collection is created!");
        });
        Comment_1.default.createCollection().then(function (collection) {
            console.log("Comment Collection is created!");
        });
        Admin_1.default.createCollection().then(function (collection) {
            console.log("Admin Collection is created!");
        });
        Badge_1.default.createCollection().then(function (collection) {
            console.log("Badge Collection is created!");
        });
        console.log("Mongoose Connected ...");
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map