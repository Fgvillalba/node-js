import { Router } from 'express';
import movies from '../movies.json' with { type: 'json' };
import {validateMovie, validatePartialMovie} from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js';

export const moviesRouter = Router();

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query;
  const movies = await MovieModel.getAll({genre})
  res.json(movies);
});

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const movie = await MovieModel.getById({id})
  if (movie) return res.json(movie);
  res.status(404).send('Movie not found');
})

moviesRouter.post('/', async (req, res) => {
  const validationResult = validateMovie(req.body);

  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: JSON.parse(validationResult.error.message) });
  }
  
  const newMovie = await MovieModel.create({input: validationResult.data});
  res.status(201).json(newMovie);
})

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await MovieModel.delete({id})
  
  if(result === false){
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json({ mesage: 'Movie deleted' });
})

moviesRouter.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const validationResult = validatePartialMovie(req.body);
  
    if (validationResult.error) {
      return res.status(400).json({ message: JSON.parse(validationResult.error.message) });
    }
  
    const result = await MovieModel.update({id, input: validationResult.data})
    if (result === false) {
      return res.status(400).json({ message: 'Movie not found' });
    }
  
    res.json(result);  
})