const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { createHandler } = require("graphql-http/lib/use/express");
const expressPlayground =
  require("graphql-playground-middleware-express").default;

const handleError = require("./core/middlewares/error-handler-middleware");
const auth = require("./core/middlewares/auth-middleware");
const storage = require("./core/middlewares/storage-middleware");
const { DB_URL, PORT, HOST } = require("./core/config/env");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const app = express();

app.use(bodyParser.json());
app.use("/data/images", express.static(path.join(__dirname, "data", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.put(
  "/post-image",
  [
    auth,
    (req, res, next) => {
      if (!req.isAuth) {
        throw new Error("Not authenticated!");
      }
      next();
    },
    storage.uploadImage.single("image"),
  ],
  (req, res, next) => {
    if (!req.file) {
      return res.status(200).json({ message: "No file provided!" });
    }
    if (req.body.oldPath) {
      storage.deleteImage(req.body.oldPath);
    }
    return res
      .status(201)
      .json({ message: "File stored.", filePath: req.file.path });
  }
);

app.use(auth);

app.use(
  "/graphql",
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    context: (req, res) => {
      return {
        isAuth: req.raw.isAuth,
        userId: req.raw.userId,
      };
    },
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.use(handleError);

mongoose
  .connect(DB_URL)
  .then((result) => {
    return app.listen(PORT, HOST);
  })
  .then(() => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
