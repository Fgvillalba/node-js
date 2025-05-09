import { Router } from 'express';
import { MovieModel } from '../models/mysql/movie.js';
import { MovieController } from '../controllers/movies.js';

export const moviesRouter = Router();

const movieModel = new MovieController({ movieModel: MovieModel });

moviesRouter.get('/', movieModel.getAll);

moviesRouter.get('/:id', movieModel.getById);

moviesRouter.post('/', movieModel.create);

moviesRouter.delete('/:id', movieModel.delete);

moviesRouter.patch('/:id', movieModel.update);
