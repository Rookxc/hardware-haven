var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

let products = [
    { id: 'e3ff8295-8915-4dbd-922f-335146105878', name: 'Motherboard', price: 150 },
    { id: '32bc7694-e78a-43ff-8386-306192b47d1c', name: 'CPU', price: 200 },
    { id: '797fa699-615d-41d5-880e-bf0fb4dd236d', name: 'GPU', price: 500 }
];

router.post('/', (req, res) => {
    const newProduct = req.body;

    newProduct.id = uuidv4();
    products.push(newProduct);
    res.status(201).json({ message: `Product ${newProduct.name} added successfully`, id: newProduct.id });
});

router.get('/find/:query', (req, res) => {
    const query = req.params.query.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    res.status(200).json(filteredProducts);
});

router.get('/', (req, res) => {
    res.status(200).json(products);
});

router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(product => product.id === productId);
    if (product != undefined || product != null) {
        res.status(200).json(product);
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
});

router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;
    updatedData.id = productId;
    const index = products.findIndex(product => product.id === productId);

    if (index !== -1) {
        products[index] = updatedData;
        res.status(200).json({ message: `Product ${updatedData.name} updated successfully` });
    } else {
        res.status(404).json({ message: `Product ${updatedData.name} not found` });
    }
});

router.delete('/:id', (req, res) => {
    const productId = req.params.id;
    const index = products.findIndex(product => product.id === productId);
    const name = products[index].name

    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).json({ message: `Product ${name} deleted successfully` });
    } else {
        res.status(404).json({ message: `Product ${name} not found` });
    }
});

module.exports = router;