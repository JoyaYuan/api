#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "./app";
import Debug from "debug";
import http from "http";
import mongoose from "mongoose";
import serverConfig from "./config/server";
const debug = Debug("sast-app-api");

/**
 * Connect database.
 */
const localhost =
  process.env.LOCALHOST ||
  (process.env.NODE_ENV === production ? "host.docker.internal" : "localhost");
mongoose.connect(
  `mongodb://${localhost}:27017/sast-app-api`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error: "));
db.once("open", () => {
  debug("Database connected");
});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || serverConfig.port);
app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
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
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
