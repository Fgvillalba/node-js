import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { PORT, SECRET_JWT_KEY } from './config.js';
import { UserRepository } from './user-repository.js';

const app = express();

app.set('view engine', 'ejs');

app.use(json());
app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies?.acces_token;
  req.session = {
    user: null,
  };

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY);
    req.session.user = data;
  } catch {}

  next();
});

app.get('/', (req, res) => {
  res.render('login', req.session.user);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserRepository.login({ username, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: '1h',
      },
    );

    res
      .cookie('acces_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60,
      })
      .send(user);
  } catch (error) {
    console.log(error);
    res.status(401).send(error.message);
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('acces_token').send({ status: 'ok' });
});

app.get('/protected', (req, res) => {
  console.log('entro a protected');
  const { user } = req.session;
  if (!user) {
    return res.status(403).send('Acces not authorized');
  }

  res.render('protected', user);
});

app.get('/dummy', (req, res) => {
  res.redirect('/protected');
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
