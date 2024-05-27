var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

let users = [{
    username: 'alenskorjanc',
    email: 'alen@test.si',
    password: 'test'
}];
let refreshTokens = [];

function generateAccessToken(user) {
	return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

router.post('/register', (req, res) => {
	const newUser = req.body;
	newUser.id = uuidv4();
	users.push(newUser);
	res.status(201).json({ message: 'User registered successfully', id: newUser.id });
});

router.post('/login', (req, res) => {
	console.log(req.body)
	const { email, password } = req.body;
	const user = users.find(user => user.email === email && user.password === password);
	const accessToken = generateAccessToken(user);
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken);

	if (user != undefined || user != null) {
		res.status(200).json({ message: 'Login successful', accessToken: accessToken, refreshToken: refreshToken });
	}
	else {
		res.status(401).json({ message: 'Login failed' });
	}
});

router.post('/refresh-access-token', (req, res) => {
	const refreshToken = req.body.refreshToken;
	if (refreshToken == null) {
		return res.sendStatus(401);
	}

	if (!refreshTokens.includes(refreshToken)) {
		console.log('ref token not in list');
		return res.sendStatus(403);
	}

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log('ref token not valid');
			return res.sendStatus(403);
		}

		const accessToken = generateAccessToken(user);
		res.status(200).json({ accessToken: accessToken });
	});
});

router.delete('/logout', (req, res) => {
	const refreshToken = req.body.refreshToken;
	if (refreshToken == null) {
		return res.sendStatus(400);
	}

	refreshTokens = refreshTokens.filter(token => token != req.body.token);
	res.sendStatus(204);
});

router.get('/', (req, res) => {
	const userId = req.user.userId;
	const user = users.find(user => user.id === userId);
	if (user != undefined || user != null) {
		res.status(200).json(user);
	}
	else {
		res.status(404).json({ message: 'User not found' });
	}
});

router.put('/', (req, res) => {
	const userId = req.user.userId;
	const updatedData = req.body;
	updatedData.id = userId;
	const index = users.findIndex(user => user.id === userId);

	if (index !== -1) {
		users[index] = updatedData;
		console.log(users);
		res.status(200).json({ message: 'User data updated successfully' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

router.delete('/', (req, res) => {
	const userId = req.user.userId;
	const index = users.findIndex(user => user.id === userId);

	if (index !== -1) {
		users.splice(index, 1);
		res.status(200).json({ message: 'User deleted successfully' });
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});

module.exports = router;
