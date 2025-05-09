//import { MovieModel } from '../models/locale-file-system/movie.js';
//import { MovieModel } from '../models/mysql/movie.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    const movies = await this.movieModel.getAll({ genre });

    res.json(movies);
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const movie = await this.movieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).send('Movie not found');
  };

  create = async (req, res) => {
    const validationResult = validateMovie(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(validationResult.error.message) });
    }

    const newMovie = await this.movieModel.create({
      input: validationResult.data,
    });
    res.status(201).json(newMovie);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const result = await this.movieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ mesage: 'Movie deleted' });
  };

  update = async (req, res) => {
    const { id } = req.params;
    const validationResult = validatePartialMovie(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(validationResult.error.message) });
    }

    const updatedMovie = await this.movieModel.update({
      id,
      input: validationResult.data,
    });
    if (updatedMovie === false) {
      return res.status(400).json({ message: 'Movie not found' });
    }

    res.json(updatedMovie);
  };
}
