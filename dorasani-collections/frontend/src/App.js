import React, { useState, useEffect } from 'react';
import axios from "axios";

// --- INITIAL SAMPLE DATA (Source of Truth) ---
/*const initialStock = [
  { id: '101', name: 'Handloom Silk Saree', price: 950, stock: 45, image: 'https://images.unsplash.com/photo-1610030469668-935142b96fe4?q=80&w=400', details: 'Pure Handloom' },
  { id: '102', name: 'Zari Border Saree', price: 1050, stock: 12, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400', details: 'Zari Border' },
];*/

const initialOrders = [
  { id: 'S-1032', customer: 'Priya Rao', phone: '9845012345', date: 'Apr 24, 2026', amount: '₹3293', status: 'Pending' },
  { id: 'S-1031', customer: 'Anil Kumar', phone: '9001234567', date: 'Apr 23, 2026', amount: '₹5690', status: 'Pending' },
  { id: 'S-1030', customer: 'Sneha Iyer', phone: '9988776655', date: 'Apr 23, 2026', amount: '₹17250', status: 'Shipped' },
];

function App() {
  // --- AUTH STATE (Login Logic) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [sarees, setSarees] = useState([]);

  // Fixed credentials (TEMPORARY - Must remove by Day 5)
  const tempCredentials = { user: 'admin', pass: 'admin' };

  // --- CONTENT & MODAL STATE ---
  const [activeView, setActiveView] = useState('Stock'); // Stock, Orders, Dashboard
  //const [products, setProducts] = useState(initialStock);
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', details: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchSarees = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/sarees");
          setSarees(response.data);
        } catch (error) {
          console.error("Error fetching sarees:", error);
        }
      };

      // Load when page loads
      useEffect(() => {
        fetchSarees();
      }, []);

  // --- 🔒 LOGIN PAGE UI & LOGIC ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.username === tempCredentials.user && loginForm.password === tempCredentials.pass) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Credentials. Please retry.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif" style={{ backgroundColor: '#2D0A0A' }}>
        <div className="bg-white p-12 shadow-2xl border-t-[10px] border-[#D4AF37] w-[450px]">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-widest text-[#4A0E0E] uppercase m-0">శ్రీ <span className="text-[#A00E0E]">దొరసాని</span></h1>
            <p className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mt-2">Dorasani Admin Portal</p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <input type="text" placeholder="Administrator Username" required className="w-full border-b-2 p-3 outline-none focus:border-[#4A0E0E] text-sm" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
            <input type="password" placeholder="Access Password" required className="w-full border-b-2 p-3 outline-none focus:border-[#4A0E0E] text-sm" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            {loginError && <p className="text-red-600 text-[11px] text-center font-bold tracking-wider">{loginError}</p>}
            <button type="submit" className="w-full bg-[#4A0E0E] text-[#D4AF37] py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">Authenticate & Enter</button>
          </form>
        </div>
      </div>
    );
  }

  // --- PRODUCT MANAGEMENT LOGIC (FIXED Edit/Delete) ---
  const handleProductSave = async () => {
    try {
      if (editingId) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/sarees/${editingId}`,
          formData
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/sarees",
          formData
        );
      }

      fetchSarees(); // reload from DB
      closeProductModal();

    } catch (error) {
      console.error("Error saving saree:", error);
    }
  };




  const openProductEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleProductDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this saree?")) {
      try {
        await axios.delete(`http://localhost:5000/api/sarees/${id}`);
        fetchSarees(); // reload from DB
      } catch (error) {
        console.error("Error deleting saree:", error);
      }
    }
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ id: '', name: '', price: '', stock: '', details: '', image: '' });
  };

  // --- ORDER MANAGEMENT LOGIC ---
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  // --- COMMON UI SECTIONS (Sidebar, Header) ---
  const AdminLayout = ({ children }) => (
    <div className="flex flex-row min-h-screen w-full font-serif m-0 p-0">
      {/* 1. SIDEBAR (Reference Layout) */}
      <aside className="w-64 flex-shrink-0 shadow-2xl z-20" style={{ backgroundColor: '#4A0E0E', position: 'sticky', top: 0, height: '100vh' }}>
        <div className="p-8 text-center border-b border-white/10">
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Sri దొరసాని</h1>
          <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase mt-1">Admin Portal</p>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          {['Dashboard', 'Orders', 'Stock Management', 'Reports', 'Settings'].map((item, idx) => {
            const views = ['Dashboard', 'Orders', 'Stock', 'Reports', 'Settings'];
            const isActive = activeView === views[idx];
            return (
              <button key={item} onClick={() => setActiveView(views[idx])} className={`w-full text-left px-4 py-3 text-xs rounded transition-all ${isActive ? 'bg-[#D4AF37] text-[#4A0E0E] font-bold' : 'text-[#D4AF37] hover:bg-white/10'}`}>
                {item}
              </button>
            )
          })}
        </nav>
      </aside>
      
      {/* 2. MAIN WORKSPACE */}
      <div className="flex-grow flex flex-col min-h-screen">
        <header className="py-4 px-10 flex justify-between items-center shadow-lg z-10" style={{ backgroundColor: '#2D0A0A' }}>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">Internal Management System</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white opacity-80">Welcome, Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#4A0E0E] flex items-center justify-center font-bold shadow-md">A</div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );

  // --- RENDER CURRENT VIEW ---
  return (
    <AdminLayout>
      {/* 3. MIDDLE WORKSPACE (CREAM) */}
      <main className="flex-grow p-10" style={{ backgroundColor: '#FDF8F2' }}>
        
        {/* --- DASHBOARD VIEW (Match Reference Image 2) --- */}
        {activeView === 'Dashboard' && (
          <div className="space-y-10">
            <h2 className="text-3xl italic text-[#4A0E0E]">Admin Dashboard</h2>
            <div className="grid grid-cols-4 gap-6">
              {[ { title: 'Total Orders', value: '458', icon: '🛒' }, { title: 'Month Sales', value: '₹4,57,201', icon: '₹' }, { title: 'Out of Stock Saree', value: '8', icon: '🛑' }, { title: 'Pending Orders', value: '12', icon: '⏳' } ].map(stat => (
                <div key={stat.title} className="bg-white p-6 shadow-xl border-b-[5px] border-[#D4AF37] relative">
                  <span className="absolute top-4 right-4 text-3xl opacity-10">{stat.icon}</span>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">{stat.title}</p>
                  <p className="text-4xl font-bold text-[#4A0E0E] mt-3">{stat.value}</p>
                </div>
              ))}
            </div>
            {/* ... Other Dashboard Content ... */}
          </div>
        )}

        {/* --- STOCK MANAGEMENT VIEW (Current Logic Fixed) --- */}
        {activeView === 'Stock' && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl italic text-[#4A0E0E]">Stock Management</h2>
              <button onClick={() => setIsModalOpen(true)} className="bg-[#4A0E0E] text-[#D4AF37] px-8 py-3 text-xs font-bold uppercase border border-[#D4AF37]/30 hover:bg-black shadow-xl">
                + Add New Product
              </button>
            </div>
            {/* Table structure as before ... */}
            <div className="bg-white shadow-xl rounded-sm overflow-hidden border border-[#4A0E0E]/5">
              <table className="w-full text-left">
                {/* Table Head ... */}
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 border-b"><tr><th className="p-5">Image</th><th className="p-5">ID & Name</th><th className="p-5 text-[#4A0E0E]">Price</th><th className="p-5 text-[#4A0E0E]">Stock Status</th><th className="p-5 text-center">Actions</th></tr></thead>
                {/* Table Body ... */}
                <tbody className="divide-y divide-gray-100">
                  {sarees.map(p => (
                    <tr key={p.id} className="hover:bg-[#FDF8F2]/50 transition-colors">
                      <td className="p-5"><img src={p.image} className="w-16 h-20 object-cover shadow-sm border border-[#D4AF37]/20" /></td>
                      <td className="p-5"><p className="font-bold text-[#4A0E0E] text-base">{p.name}</p><p className="text-[10px] text-gray-400 font-mono italic">ID: {p.id}</p></td>
                      <td className="p-5 font-bold text-[#4A0E0E]">₹{p.price}</td>
                      <td className="p-5 text-gray-600 font-bold">{p.stock} pcs</td>
                      <td className="p-5 text-center"><div className="flex justify-center gap-4">
                        <button onClick={() => openProductEdit(p)} className="text-[#4A0E0E] text-[10px] font-bold border-b-2 border-[#4A0E0E] uppercase hover:text-[#D4AF37]">Edit</button>
                        <button onClick={() => handleProductDelete(p.id)} className="text-red-700 text-[10px] font-bold border-b-2 border-red-700 uppercase hover:text-red-900">Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ORDERS VIEW (Match Reference Image 3 & Fixed Status Drodown) --- */}
        {activeView === 'Orders' && (
          <div>
            <div className="mb-10"><h2 className="text-3xl italic text-[#4A0E0E]">Order Management</h2><p className="text-gray-500 text-xs mt-1">Review customer orders and modify delivery status.</p></div>
            <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-[#4A0E0E]/5">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 border-b">
                  <tr>
                    <th className="p-5">Order ID</th>
                    <th className="p-5">Customer Name</th>
                    <th className="p-5">Customer Phone</th>
                    <th className="p-5">Order Date</th>
                    <th className="p-5">Total Amount</th>
                    <th className="p-5">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map(order => {
                    // Status Badge Style
                    let badgeColor = order.status === 'Shipped' ? 'bg-green-100 text-green-700' : (order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700');
                    return (
                      <tr key={order.id} className="hover:bg-[#FDF8F2]/50">
                        <td className="p-5 font-bold text-gray-700">{order.id}</td>
                        <td className="p-5 text-[#4A0E0E]">{order.customer}</td>
                        <td className="p-5 font-mono tracking-wider">{order.phone}</td>
                        <td className="p-5 text-gray-600">{order.date}</td>
                        <td className="p-5 font-bold text-[#4A0E0E]">{order.amount}</td>
                        <td className="p-5">
                          {/* THE ORDER STATUS DROPDOWN (Matches reference requirements) */}
                          <select 
                            value={order.status} 
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className={`${badgeColor} text-[10px] font-bold uppercase px-3 py-1 rounded-full outline-none cursor-pointer border-none shadow-inner`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER (BROWN) ... same as last time ... */}
      <footer className="py-6 px-10 flex justify-between items-center border-t border-white/5" style={{ backgroundColor: '#2D0A0A' }}><p className="text-[9px] text-white opacity-40 uppercase tracking-widest">© 2026 Sri దొరసాని Collections • Internal Admin Use Only</p><div className="flex gap-6"><span className="text-[9px] text-[#D4AF37] uppercase font-bold cursor-pointer opacity-70 hover:opacity-100">Support</span><span className="text-[9px] text-[#D4AF37] uppercase font-bold cursor-pointer opacity-70 hover:opacity-100">Database Status: Connected</span></div></footer>

      {/* --- ADD/EDIT MODAL (Logic Fixed) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg p-10 shadow-2xl border-t-[10px] border-[#D4AF37]">
            {/* The title changes dynamically if editing */}
            <h3 className="text-3xl text-[#4A0E0E] italic mb-8 font-bold">{editingId ? 'Edit Product' : 'Register New Saree'}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2"><label className="text-[10px] uppercase font-bold text-gray-400">Saree Photo URL</label><input type="text" className="w-full border-b-2 p-2 outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /></div>
             /* <div><label className="text-[10px] uppercase font-bold text-gray-400">Saree ID (e.g., 101)</label><input type="text" className="w-full border-b-2 p-2 outline-none" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} /></div>*/
              <div><label className="text-[10px] uppercase font-bold text-gray-400">Price (₹)</label><input type="number" className="w-full border-b-2 p-2 outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
              <div className="col-span-2"><label className="text-[10px] uppercase font-bold text-gray-400">Saree Name</label><input type="text" className="w-full border-b-2 p-2 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="col-span-2"><label className="text-[10px] uppercase font-bold text-gray-400">Stock Pieces</label><input type="number" className="w-full border-b-2 p-2 outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
              <div className="col-span-2"><label className="text-[10px] uppercase font-bold text-gray-400">Details</label><textarea className="w-full border-2 p-2 h-16 outline-none" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} /></div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={closeProductModal} className="flex-1 py-4 text-[11px] font-bold uppercase bg-[#F4F4F4] text-gray-500">Cancel</button>
              {/* Button text changes dynamically */}
              <button onClick={handleProductSave} className="flex-1 py-4 text-[11px] font-bold uppercase bg-[#4A0E0E] text-[#D4AF37]">
                {editingId ? 'Update Saree' : 'Save Saree'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default App;