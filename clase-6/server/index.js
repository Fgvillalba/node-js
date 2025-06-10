import express from 'express';
import logger from 'morgan';
import mysql from 'mysql2/promise';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';

const port = process.env.PORT ?? 3000;

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://192.168.0.12:8080',
  'https://movies.com',
  'http://192.168.0.5',
];

const config = {
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: '',
  database: 'chatdb',
};

let connection;

try {
  connection = await mysql.createConnection(config);
} catch (error) {
  console.log('Error al conectar a my sql');
  process.exit(1);
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
  // connectionStateRecovery: {},
});

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin);
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  }),
);

io.on('connection', async (socket) => {
  console.log('A user has connected');

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });

  socket.on('chat-message', async (message) => {
    console.log(`Message recieved: ${message}`);
    let result;
    try {
      [result] = await connection.query(
        `INSERT INTO chat (msg, user) VALUES 
        (?, ?);`,
        [message, socket.handshake?.auth?.username],
      );
    } catch (error) {
      console.log(error);
      throw new Error('Error on post message');
    }
    io.emit(
      'chat-message',
      message,
      result.insertId,
      socket.handshake?.auth?.username,
    );
  });

  if (!socket.recovered) {
    try {
      const [messages] = await connection.query(
        `SELECT id, msg, user
       FROM chat
       WHERE id > ?`,
        [socket.handshake.auth.serverOffset ?? 0],
      );
      //res.json(messages);
      console.log(
        `SE RECONECTO Y VOY A BUSCAR LOS MENSAJES DESDE EL: ${socket.handshake.auth.serverOffset}`,
      );
      messages.forEach((msg) => {
        socket.emit('chat-message', msg.msg, msg.id, msg.user);
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error when obtaining chat history');
    }
  }
});

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

// app.get('/messages', async (req, res) => {
//   const { lastId } = req.query;
//   try {
//     const [messages] = await connection.query(
//       `SELECT id, msg
//        FROM chat
//        WHERE id > ?`,
//       [lastId],
//     );
//     console.log(`mensajes: ${messages}`);
//     res.json(messages);
//   } catch (error) {
//     console.log(error);
//     throw new Error('Error when obtaining chat history');
//   }
// });

server.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
