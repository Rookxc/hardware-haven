//Script for populating mongodb (we can delete it after)

const mongoose = require('mongoose');
const Product = require('../models/Product')

const products = [
  {
    name: "Intel Core i7-11700K",
    category: "CPU",
    description: "8 Cores, 16 Threads, 3.6 GHz (up to 5.0 GHz) LGA 1200",
    price: 389.99,
    image: "https://www.mlacom.si/iimg/75859/334x400/i.jpg",
    brand: "Intel",
    stock: 20,
    ratings: []
  },
  {
    name: "AMD Ryzen 7 5800X",
    category: "CPU",
    description: "8 Cores, 16 Threads, 3.8 GHz (up to 4.7 GHz) AM4",
    price: 449.99,
    image: "https://m.media-amazon.com/images/I/51smqWKarCL._AC_UF350,350_QL80_.jpg",
    brand: "AMD",
    stock: 15,
    ratings: []
  },
  {
    name: "NVIDIA GeForce RTX 3090",
    category: "GPU",
    description: "24GB GDDR6X, PCI Express 4.0",
    price: 1499.99,
    image: "https://m.media-amazon.com/images/I/51K36OrmxLL._AC_UF894,1000_QL80_.jpg",
    brand: "NVIDIA",
    stock: 5,
    ratings: []
  },
  {
    name: "MSI MAG B550 TOMAHAWK",
    category: "Motherboard",
    description: "ATX Gaming Motherboard, PCIe 4.0, 128GB DDR4",
    price: 179.99,
    image: "https://komponentko.b-cdn.net/wp-content/uploads/e-9f57517c65c18de1daf62a393b2a8fd2.jpg",
    brand: "MSI",
    stock: 8,
    ratings: []
  },
  {
    name: "G.SKILL Ripjaws V Series 32GB",
    category: "RAM",
    description: "DDR4 DRAM 3600MHz C16 Memory Kit",
    price: 169.99,
    image: "https://www.mlacom.si/iimg/68501/[w]x[h]/i.png",
    brand: "G.SKILL",
    stock: 12,
    ratings: []
  },
  {
    name: "Crucial P2 1TB",
    category: "Storage Device",
    description: "NVMe M.2 Internal SSD, up to 2400 MB/s",
    price: 109.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbngfDfv0I0vimGYi3MqNDppWUM0eBQdv8fg&s",
    brand: "Crucial",
    stock: 10,
    ratings: []
  },
  {
    name: "Seasonic FOCUS GX-750",
    category: "Power Supply",
    description: "750W Fully Modular Power Supply, 80 Plus Gold",
    price: 129.99,
    image: "https://www.mlacom.si/iimg/88013/i.jpg",
    brand: "Seasonic",
    stock: 18,
    ratings: []
  },
  {
    name: "Fractal Design Meshify C",
    category: "Case",
    description: "ATX Mid Tower Case, Tempered Glass Side Panel, USB 3.0",
    price: 99.99,
    image: "https://www.mlacom.si/iimg/48461/400x400/i.jpg",
    brand: "Fractal Design",
    stock: 22,
    ratings: []
  }
];


async function seedDB() {
  await mongoose.connect('mongodb+srv://hardwarehaven:QhTJnPXD6ipaUkSp@cluster0.wjytx9m.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Product.insertMany(products);
  console.log("Database seeded!");

  mongoose.disconnect();
}

seedDB().catch(err => console.log(err));
