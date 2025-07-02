import crypto from 'node:crypto';

import DBLocal from 'db-local';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './config.js';
import { Validation } from './validations/user.js';

const { Schema } = new DBLocal({ path: './db' });

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserRepository {
  static async create({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });

    if (user) {
      throw new Error('username already exist');
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const id = crypto.randomUUID();

    User.create({
      _id: id,
      username,
      password: hashPassword,
    }).save();

    return id;
  }
  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });

    if (!user) {
      throw new Error('username does not exist');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('password is invalid');
    }

    const { password: _, ...publicUser } = user;

    return publicUser;
  }
}
