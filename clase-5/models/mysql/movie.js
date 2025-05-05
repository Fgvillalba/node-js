import mysql from 'mysql2/promise';

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

  static async getById({ id }) {}

  static async create({ input }) {}

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
