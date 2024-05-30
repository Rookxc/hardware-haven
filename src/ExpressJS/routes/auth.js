const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

router.post('/register', async (req, res) => {
    const { name, email, surname, password } = req.body;
    try {
      const userExists = await User.findOne({ $or: [{ email }, { surname }] });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        name,
        email,
        surname,
        password,
      });
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        surname: user.surname,
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/verify', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              return res.status(403).json({ message: 'Failed to authenticate token' });
          }
          res.status(200).json({ message: 'Token is valid', decoded });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router;
