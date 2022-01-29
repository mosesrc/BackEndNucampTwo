const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain"); // we are going to sen back plain text in the response body
    next(); //Past control of the app routing to the next relevant routing method after this one
  })
  .get((req, res) => {
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotions: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain"); // we are going to sen back plain text in the response body
    next(); //Past control of the app routing to the next relevant routing method after this one
  })
  .get((req, res) => {
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.end(
      `Will update the promotion: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

module.exports = promotionRouter;
