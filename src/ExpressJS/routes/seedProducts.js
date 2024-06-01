//Script for populating mongodb (we can delete it after)

const mongoose = require('mongoose');
const Product = require('../models/Product')

const products = [
  {
    name: "Intel Core i9-11900K",
    category: "CPU",
    description: "8 Cores, 16 Threads, 3.5 GHz (up to 5.3 GHz) LGA 1200",
    price: 539.99,
    image: "image_url_here",
    brand: "Intel",
    stock: 15,
    ratings: []
  },
  {
    name: "AMD Ryzen 9 5900X",
    category: "CPU",
    description: "12 Cores, 24 Threads, 3.7 GHz (up to 4.8 GHz) AM4",
    price: 449.99,
    image: "image_url_here",
    brand: "AMD",
    stock: 3,
    ratings: []
  },
  {
    name: "NVIDIA GeForce RTX 3080",
    category: "GPU",
    description: "10GB GDDR6X, PCI Express 4.0",
    price: 699.99,
    image: "image_url_here",
    brand: "NVIDIA",
    stock: 0,
    ratings: []
  },
  {
    name: "ASUS ROG Strix B550-F",
    category: "Motherboard",
    description: "ATX Gaming Motherboard, PCIe 4.0, 128GB DDR4",
    price: 189.99,
    image: "image_url_here",
    brand: "ASUS",
    stock: 2,
    ratings: []
  },
  {
    name: "Corsair Vengeance LPX 16GB",
    category: "RAM",
    description: "DDR4 DRAM 3200MHz C16 Memory Kit",
    price: 89.99,
    image: "image_url_here",
    brand: "Corsair",
    stock: 6,
    ratings: []
  },
  {
    name: "Samsung 970 EVO Plus 1TB",
    category: "Storage Device",
    description: "NVMe M.2 Internal SSD, up to 3,500 MB/s",
    price: 149.99,
    image: "image_url_here",
    brand: "Samsung",
    stock: 1,
    ratings: []
  },
  {
    name: "EVGA SuperNOVA 750 G5",
    category: "Power Supply",
    description: "750W Fully Modular Power Supply, 80 Plus Gold",
    price: 129.99,
    image: "image_url_here",
    brand: "EVGA",
    stock: 9,
    ratings: []
  },
  {
    name: "NZXT H510 Mid Tower Case",
    category: "Case",
    description: "ATX Case, Tempered Glass Side Panel, USB-C Port",
    price: 69.99,
    image: "image_url_here",
    brand: "NZXT",
    stock: 4,
    ratings: []
  }
];

async function seedDB() {
  await mongoose.connect('mongodb+srv://hardwarehaven:QhTJnPXD6ipaUkSp@cluster0.wjytx9m.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Database seeded!");

  mongoose.disconnect();
}

seedDB().catch(err => console.log(err));
