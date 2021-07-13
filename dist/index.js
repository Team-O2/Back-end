"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const db_1 = __importDefault(require("./Loader/db"));
// Connect Database
db_1.default();
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
// // allow cors
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default({ credentials: true }));
// route
app.use("/auth", require("./controller/auth"));
app.use("/challenge", require("./controller/challenge"));
app.use("/admin", require("./controller/admin"));
app.use("/concert", require("./controller/concert"));
app.use("/user", require("./controller/user"));
app.use("/notice", require("./controller/notice"));
// scheduler
const schedulerService_1 = require("./service/schedulerService");
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
    // scheduler
    schedulerService_1.challengeOpen;
});
const port = process.env.PORT;
const server = app
    .listen(port, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ` +
        port +
        ` 🛡️
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
server.timeout = 1000000;
//# sourceMappingURL=index.js.map