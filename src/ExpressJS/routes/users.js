var express = require('express');
const User = require('../models/User');
var router = express.Router();

router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-password/:id', async function (req, res, next) {
  console.log(req.body)

  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (user && (await user.matchPassword(password))) {
      user.password = newPassword;
      user.save();

      res.status(200).json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async function (req, res, next) {
  const { name, surname, email } = req.body; 
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: name,
      surname: surname,
      email: email
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
