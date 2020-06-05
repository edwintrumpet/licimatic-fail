const routes = require('../routes');
const testServer = require('../utils/testServer');

const request = testServer(routes);

describe('Routes', () => {
  describe('/', () => {
    it('Should return status 200', () => request.get('/').then((response) => expect(response.statusCode).toBe(200)));
    it('Should return a message', () => request.get('/').then((response) => expect(response.body).toEqual({ message: 'Routes works!' })));
  });
});
