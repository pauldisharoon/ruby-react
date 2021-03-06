import compression from "compression";
import express from "express";
import path from "path";
import Loadable from "react-loadable";
import proxy from 'http-proxy-middleware'
import loader from "./loader";

// Create our express app using the port optionally specified
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());


// Set up homepage, static assets, and capture everything else
app.use('/uploads', proxy({ target: 'http://werate.co:3000', changeOrigin: true }))
app.use(express.Router().get("/", loader));
app.use(express.static(path.resolve(__dirname, "../build")));
app.use(loader);

// We tell React Loadable to load all required assets and start listening
Loadable.preloadAll().then(() => {
  app.listen(PORT, console.log(`App listening on port ${PORT}!`));
});

// Handle the bugs somehow
app.on("error", error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});
