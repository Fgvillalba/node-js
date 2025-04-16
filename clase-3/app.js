const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');

const app = express();
const port = process.env.PORT ?? 1234;
app.disable('x-powered-by');

app.use(express.json());

app.get('/movies', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    let moviesByGenre = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
    );
    return res.json(moviesByGenre);
  }
  res.json(movies);
});

app.get('/movies/:movieId', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).send('Movie not found');
});

app.post('/movies', (req, res) => {
  const validationResult = validateMovie(req.body);

  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: JSON.parse(validationResult.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...validationResult.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex < 0) {
    return res.status(400).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;
  res.json(updateMovie);
});

app.use((req, res) => {
  res.status(404).send('<h1>Not found</h1>');
});

app.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`);
});
