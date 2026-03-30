// Inside your Add Product Component
const AddProduct = () => {
  // 1. Keep the state here to track inputs
  const [formData, setFormData] = useState({ name: '', price: '', imageUrl: '' });

  // 2. Keep the handleSubmit function here
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/sarees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    alert("Saved to Database!");
  };

  return (
    <form onSubmit={handleSubmit}> 
       {/* Your input fields go here */}
    </form>
  );
};