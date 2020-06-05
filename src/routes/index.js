const express = require('express');

const routes = (app) => {
  const router = express.Router();
  app.use('/', router);
  router.get('/', (req, res) => {
    res.status(200).json({ message: 'Routes works!' });
  });
};

module.exports = routes;
