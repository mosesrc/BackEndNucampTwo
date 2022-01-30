const express = require('express');
const Partner = require('../models/partner');

const partnerRouter = express.Router();

partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })
  .delete((req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
        res.json(response);
      })
      .catch((err) => next(err));
  });

partnerRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })
  .put((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          if (req.body.name) {
            partner.name = req.body.name;
          }
          if (req.body.description) {
            partner.description = req.body.description;
          }
          partner.save().then((partner) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
            res.json(partner);
          });
        } else if (!partner) {
          err = new Error(` Partner {$req.params.partnerId} not found`);
          err.status = 404;
          return next(err); //passes off error to the express error handling system
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json'); // we are going to sen back plain text in the response body
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
