import express from "express";
const app = express();
import connectDB from "src/Loader/db";

// Connect Database
connectDB();

app.use(express.urlencoded());
app.use(express.json());

// // allow cors
import cors from "cors";
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// route
app.use("/auth", require("src/controller/auth"));
app.use("/challenge", require("src/controller/challenge"));
app.use("/admin", require("src/controller/admin"));
app.use("/concert", require("src/controller/concert"));
app.use("/user", require("src/controller/user"));
app.use("/notice", require("src/controller/notice"));

// scheduler
import { challengeOpen } from "src/service/schedulerService";

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");

  // scheduler
  challengeOpen;
});

const port = process.env.PORT;
app
  .listen(port, () => {
    console.log(
      `
    ################################################
    🛡️  Server listening on port: ` +
        port +
        ` 🛡️
    ################################################
  `
    );
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
