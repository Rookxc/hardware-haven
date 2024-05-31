import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Shop({ isAuthenticated }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Set the mock items as the initial state
    setItems([
      {
        id: 1,
        name: "Intel Core i9-11900K",
        description: "8 Cores, 16 Threads, 3.5 GHz (up to 5.3 GHz) LGA 1200",
        price: "539.99 €"
      },
      {
        id: 2,
        name: "AMD Ryzen 9 5900X",
        description: "12 Cores, 24 Threads, 3.7 GHz (up to 4.8 GHz) AM4",
        price: "449.99 €"
      },
      {
        id: 3,
        name: "NVIDIA GeForce RTX 3080",
        description: "10GB GDDR6X, PCI Express 4.0",
        price: "699.99 €"
      },
      {
        id: 4,
        name: "ASUS ROG Strix B550-F",
        description: "ATX Gaming Motherboard, PCIe 4.0, 128GB DDR4",
        price: "189.99 €"
      },
      {
        id: 5,
        name: "Corsair Vengeance LPX 16GB",
        description: "DDR4 DRAM 3200MHz C16 Memory Kit",
        price: "89.99 €"
      },
      {
        id: 6,
        name: "Samsung 970 EVO Plus 1TB",
        description: "NVMe M.2 Internal SSD, up to 3,500 MB/s",
        price: "149.99 €"
      },
      {
        id: 7,
        name: "EVGA SuperNOVA 750 G5",
        description: "750W Fully Modular Power Supply, 80 Plus Gold",
        price: "129.99 €"
      },
      {
        id: 8,
        name: "NZXT H510 Mid Tower Case",
        description: "ATX Case, Tempered Glass Side Panel, USB-C Port",
        price: "69.99 €"
      }
    ]);
  }, []);

  const displayItem = (id) => {
    navigate(`/item-detail/${id}`);
  };

  // TODO: api call - add to user DB collection (basket_items)
  const displayBasket = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isAuthenticated) {
      navigate('/basket');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 p-4">
        <div className="relative w-full">
          <input type="text" placeholder="Search..." className="w-full p-2 rounded-md pl-10" />
          <i className="fas fa-search text-black ml-3 absolute top-1/2 transform -translate-y-1/2 left-0"></i>
        </div>
      </header>
      <div className="flex flex-1">
        <nav className="w-52 bg-gray-100 p-5 shadow-md">
          <ul className="space-y-2">
            <li className="cursor-pointer hover:underline">All</li>
            <li className="cursor-pointer hover:underline">CPUs</li>
            <li className="cursor-pointer hover:underline">GPUs</li>
            <li className="cursor-pointer hover:underline">Motherboards</li>
            <li className="cursor-pointer hover:underline">RAM</li>
            <li className="cursor-pointer hover:underline">Storage</li>
            <li className="cursor-pointer hover:underline">Power Supplies</li>
            <li className="cursor-pointer hover:underline">Cases</li>
          </ul>
        </nav>
        <main className="flex-1 p-5 flex flex-wrap gap-5 justify-start">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-56" onClick={() => displayItem(item.id)}>
                <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="test_image" className="w-auto h-48 object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                  <b className="text-lg font-bold leading-tight h-12">{item.name}</b>
                  <p className="text-sm pt-4 overflow-hidden overflow-ellipsis whitespace-nowrap h-12">{item.description}</p>
                  <p className="text-xl font-bold text-black mt-2 h-8">{item.price}</p>
                </div>
                <button onClick={(e) => displayBasket(e)} className="bg-gray-800 text-white py-2 w-full flex items-center justify-center rounded-b-lg">
                  <span className="fas fa-shopping-cart mr-2"></span> Add to Basket
                </button>
              </div>
            ))
          ) : (
            <p>No items to display</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Shop;
