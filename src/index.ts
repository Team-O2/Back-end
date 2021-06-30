import express from "express";
const app = express();
import connectDB from "./Loader/db";

// Connect Database
connectDB();

app.use(express.urlencoded());
app.use(express.json());

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
    console.log(`
    ################################################
    🛡️  Server listening on port: `+port+` 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
