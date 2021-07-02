import express from "express";
const app = express();
import connectDB from "src/Loader/db";

// Connect Database
connectDB();

app.use(express.urlencoded());
app.use(express.json());

// route
<<<<<<< refs/remotes/origin/develop
app.use("/auth", require("src/controller/auth"));
app.use("/challenge", require("src/controller/challenge"));
// app.use("/concert", require("src/controller/concert"))

=======
app.use("/auth", require("./controller/auth"));
app.use("/concert", require("./controller/concert"))
>>>>>>> fix
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = 5000;
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
