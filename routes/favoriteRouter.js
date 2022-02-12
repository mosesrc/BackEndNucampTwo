const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode = 200;
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id }) // finds favorite by id
      .populate('user') // pulls in data, use name of the field not name of the ref!!
      .populate('campsites') // pulls in data
      .then((favoriteCampsite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favoriteCampsite); //sends back the found document
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.forEach((campsiteId) => {
          if (!favorite.campsites.includes(campsiteId._id)) {
            favorite.campsites.push(campsiteId._id);
          }
        });
        favorite
          .save()
          .then((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          })
          .catch((err) => next(err));
      } else {
        Favorite.create({
          user: req.user._id,
          campsites: req.body,
        }).then((favorite) => {
          console.log('Favorite Created ', favorite);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
        });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        res.statusCode = 200;

        if (favorite) {
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.end('You do not have any favorites to delete');
        }
      })
      .catch((err) => next(err));
  });
favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode = 200;
  })
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (favorite.campsites.includes(req.params.campsiteId)) {
            res.send('That campsite is already in the list of favorites!');
          } else {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                // this is a Favorite document that we just added the campsite id too
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
              .catch((err) => next(err));
          }
        } else {
          Favorite.create(req.body).then((favorite) => {
            console.log('Favorite Created ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorite/${req.params.campsiteId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        // this is a Favorite document
        if (favorite) {
          let indexVariable = favorite.campsites.indexOf(req.params.campsiteId); // the index of the campsiteId in the campsites array -- campsiteID is a singular string
          /*
        if(favorite){
        favorite.campsites = favorite.campsites.filter(favorite => !favorite.equals(req.params.campsiteId)) false does not get added to new array
        } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end('No favorites to delete');
      }
        */
          if (indexVariable >= 0) {
            favorite.campsites.splice(indexVariable, 1); // remove item from array
            favorite.save().then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            });
          } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('No campsite with that id');
          }
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.end('No favorites to delete');
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
