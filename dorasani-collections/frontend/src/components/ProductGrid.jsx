// Inside your Gallery/Home Component
const SareeGrid = () => {
  const [sarees, setSarees] = useState([]);

  // 3. Keep the useEffect here to fetch data on page load
  useEffect(() => {
    fetch('http://localhost:5000/api/sarees')
      .then(res => res.json())
      .then(data => setSarees(data));
  }, []);

  return (
    <div className="grid">
      {sarees.map(saree => (
        <SareeCard key={saree._id} data={saree} />
      ))}
    </div>
  );
};