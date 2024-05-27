var express = require('express');
var router = express.Router();

let purchases = [];
let basket = [];

router.post('/purchase', (req, res) => {
    const userId = req.user.userId;

    let price = 0;
    basket.forEach(element => {
        price += element.price;
    });

    const userPurchasesIndex = purchases.findIndex(purchase => purchase.userId === userId);
    if (userPurchasesIndex != -1) {
        console.log(purchases[userPurchasesIndex]);
        purchases[userPurchasesIndex].purchases.push(basket);
    }
    else {
        purchases.push({ userId: userId, purchases: [basket] });
    }

    basket = [];

    res.status(201).json({ message: 'Purchased products', price: price });
});

router.get('/purchases', (req, res) => {
    const userId = req.user.userId;
    const userPurchasesIndex = purchases.findIndex(purchase => purchase.userId === userId);
    res.status(200).json(purchases[userPurchasesIndex]);
});

router.get('/purchases', (req, res) => {
    res.status(200).json(purchases);
});

router.post('/basket', (req, res) => {
    const newProduct = req.body;
    basket.push(newProduct);
    res.status(201).json({ message: 'Product added successfully' });
});

router.get('/basket', (req, res) => {
    res.status(200).json(basket);
});

router.delete('/basket/:id', (req, res) => {
    const productId = req.params.id;
    const index = basket.findIndex(product => product.id === productId);

    if (index !== -1) {
        basket.splice(index, 1);
        res.status(200).json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;
