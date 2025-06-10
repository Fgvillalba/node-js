import express, { json } from 'express';
//import { MovieModel } from './models/mysql/movie.js';
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

//Custom require for JSON files in ESM
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);
// const movies = require('./movies.json');

export const createApp = ({ movieModel }) => {
  const app = express();
  const PORT = process.env.PORT ?? 1234;
  app.use(json()); //parseo de JSON
  app.use(corsMiddleware());
  app.disable('x-powered-by');

  app.use('/movies', createMovieRouter({ movieModel }));

  app.use((req, res) => {
    res.status(404).send('<h1>Not found</h1>');
  });

  app.listen(PORT, () => {
    console.log(`server listening on PORT http://localhost:${PORT}`);
  });
};
