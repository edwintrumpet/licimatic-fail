const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const debug = require('debug')('app:server');
const { port } = require('./config/index');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
