import express from "express";
import path from "path";

const api = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  const app = express();
  app.use(function (req, _, next) {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", function (chunk) {
      data += chunk;
    });
    req.on("end", function () {
      req.body = data;
      next();
    });
  });
  app.get("/.well-known/ai-plugin.json", (_, res) => {
    console.log("get", "/ai-plugin.json");
    res
      .header("Access-Control-Allow-Origin", "*")
      .sendFile(path.resolve("ai-plugin.json"));
  });
  app.options("/.well-known/ai-plugin.json", (_, res) => {
    console.log("options", "/ai-plugin.json");
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Private-Network", "true")
      .status(200)
      .send();
  });
  app.get("/openapi.yaml", (_, res) => {
    console.log("get", "/openapi.yaml");
    res
      .header("Access-Control-Allow-Origin", "*")
      .sendFile(path.resolve("openapi.yaml"));
  });
  app.options("/openapi.yaml", (_, res) => {
    console.log("options", "/openapi.yaml");
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Private-Network", "true")
      .status(200)
      .send();
  });
  app.get("/search", async (req, res) => {
    console.log("get", "/search");
    console.log(req.url);
    res
      .header("Access-Control-Allow-Origin", "*")
      .status(200)
      .json([{ id: 1 }]);
  });
  app.options("/search", (_, res) => {
    console.log("options", "/search");
    res
      .header("Access-Control-Allow-Origin", "*")
      .header(
        "Access-Control-Allow-Headers",
        "openai-ephemeral-user-id,Content-Type,openai-conversation-id"
      )
      .status(200)
      .send();
  });
  const port = 3000;
  app.use((req, res) => {
    console.error(`Route not found: ${req.method} - ${req.path}`);
    res
      .header("Access-Control-Allow-Origin", "*")
      .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      .status(404)
      .json({
        currentRoute: `${req.method} - ${req.path}`,
        error: "Route not found.",
        statusCode: 404,
      });
  });
  app.listen(port, () => {
    console.log(`API server listening on port ${port}...`);
  });
};

api();
