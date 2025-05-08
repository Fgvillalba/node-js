import mysql from 'mysql2/promise';
import { v4 as uuidv4, parse } from 'uuid';

const config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'moviesdb',
};

let connection;
try {
  connection = await mysql.createConnection(config);
} catch (oError) {
  console.log('Error al conectar a my sql');
  process.exit(1);
}

function uuidToBinary(uuidString) {
  const buffer = parse(uuidString);
  return Buffer.from(buffer);
}

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      //   genre = genre.toLowerCase();
      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) id, g.name genre 
             FROM movie m 
             JOIN movie_genres mg ON mg.movie_id = m.id 
             JOIN genres g ON g.id = mg.genre_id 
             WHERE g.name = ?`,
        [genre], //Para evitar inyecciones de sql usando g.name = ${genre}
      );
      return movies;
    }
    const [movies] = await connection.query(`
        SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie
        `);

    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT  title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
                     FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id],
    );

    if (!movies.length) return null;

    return movies[0];
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;

    try {
      const [result] = await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
        (UUID_TO_BIN('${uuid}'), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate],
      );
    } catch (error) {
      throw new Error('Error when creating movie');
    }

    try {
      const formattedGenreNames = `${genreInput
        .map((v) => JSON.stringify(v))
        .join(', ')}`;
      const [genreIdsResult] = await connection.query(
        `SELECT id FROM genres WHERE name IN (${formattedGenreNames})`,
      );

      const genresIds = genreIdsResult.map((result) => result.id);

      const binId = uuidToBinary(uuid);
      const valuesGenreInsert = genresIds.map((genreId) => {
        return [binId, genreId];
      });

      const genreResult = await connection.query(
        `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?;`,
        [valuesGenreInsert],
      );
    } catch (error) {
      throw new Error('Error when creating genres realtionship');
    }

    try {
      const [movies] = await connection.query(
        `
          SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie
          WHERE id = UUID_TO_BIN(?);`,
        [uuid],
      );
      return movies[0];
    } catch (error) {
      throw new Error('Error when obtain the created  movie');
    }
  }

  static async delete({ id }) {
    const [{ affectedRows }] = await connection.query(
      `DELETE FROM movie WHERE id=UUID_TO_BIN(?)`,
      [id],
    );

    return affectedRows === 1;
  }

  static async update({ id, input }) {}
}
