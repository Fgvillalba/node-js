import { MovieModel } from '../models/movie';
import { validateMovie, validatePartialMovie } from '../schemas/movies';

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });

    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).send('Movie not found');
  }

  static async create(req, res) {
    const validationResult = validateMovie(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(validationResult.error.message) });
    }

    const newMovie = await MovieModel.create({ input: validationResult.data });
    res.status(201).json(newMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ mesage: 'Movie deleted' });
  }

  static async update(req, res) {
    const { id } = req.params;
    const validationResult = validatePartialMovie(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(validationResult.error.message) });
    }

    const updatedMovie = await MovieModel.update({
      id,
      input: validationResult.data,
    });
    if (updatedMovie === false) {
      return res.status(400).json({ message: 'Movie not found' });
    }

    res.json(updatedMovie);
  }
}
