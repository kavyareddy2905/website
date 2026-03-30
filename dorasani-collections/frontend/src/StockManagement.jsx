const handleAddProduct = async (productData) => {
  // This sends the saree info to your backend server
  await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
};