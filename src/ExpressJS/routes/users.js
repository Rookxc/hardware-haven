var express = require('express');
const User = require('../models/User');
const validateEmail = require('../helpers/Validator');
var router = express.Router();

router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-password/:id', async function (req, res, next) {
  const { password, newPassword, repeatPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (!password) {
      return res.status(400).json({ message: 'This field is required.', field: 'password' });
    }

    if (user && (await user.matchPassword(password))) {
      if (!newPassword) {
        return res.status(400).json({ message: 'This field is required.', field: 'newPassword' });
      } else if (newPassword !== repeatPassword) {
        return res.status(400).json({ message: "Passwords don't match.", field: 'repeatPassword' });
      }

      user.password = newPassword;
      user.save();

      return res.status(200).json({ message: 'Password updated successfully.' });
    } else {
      return res.status(401).json({ message: 'Invalid password.', field: 'password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async function (req, res, next) {
  const { name, surname, email } = req.body;
  try {
    let errors = [];

    if (!name) {
      errors.push({ message: 'This field is required.', field: 'name' });
    }

    if (!surname) {
      errors.push({ message: 'This field is required.', field: 'surname' });
    }

    if (!email) {
      errors.push({ message: 'This field is required.', field: 'email' });
    } else if (!validateEmail(email)) {
      errors.push({ message: 'Please enter a valid email address.', field: 'email' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      name: name,
      surname: surname,
      email: email
    });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
