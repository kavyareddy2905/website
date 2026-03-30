import React, { useEffect, useState } from 'react';

function App() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sarees') // Connects to your backend
      .then(res => res.json())
      .then(data => setSarees(data))
      .catch(err => console.log("Backend not running yet!"));
  }, []);

  return (
    <div className="min-h-screen bg-sri-cream p-10">
      <h1 className="text-4xl font-serif text-sri-maroon mb-8">Sri Dorasani Live Stock</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sarees.map(saree => (
          <div key={saree._id} className="bg-white p-4 shadow-lg border-t-4 border-sri-gold">
            <img src={saree.imageUrl} alt={saree.name} className="w-full h-64 object-cover mb-4" />
            <h2 className="text-xl text-sri-maroon font-bold">{saree.name}</h2>
            <p className="text-gray-700 text-lg">Price: ₹{saree.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;