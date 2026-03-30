import React from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full font-serif">
      <div className="bg-[#4A0E0E] text-[#D4AF37] text-[10px] py-2 px-6 flex justify-between uppercase tracking-widest font-bold">
        <span>Manufacturing • Wholesale • Worldwide</span>
        <span>Sri Dorasani Official</span>
      </div>
      <div className="bg-white border-b border-gray-100 py-5 px-8 flex justify-between items-center">
        <div className="hidden md:flex gap-6 text-[11px] uppercase font-bold text-[#4A0E0E]">
          <a href="#" className="hover:text-[#D4AF37]">Silk Sarees</a>
          <a href="#" className="hover:text-[#D4AF37]">New Arrivals</a>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#4A0E0E]">SRI <span className="text-[#D4AF37]">DORASANI</span></h1>
        </div>
        <div className="flex gap-5 text-[#4A0E0E]">
          <Search size={20} className="cursor-pointer hover:text-[#D4AF37]" />
          <User size={20} className="cursor-pointer hover:text-[#D4AF37]" />
          <ShoppingBag size={20} className="cursor-pointer hover:text-[#D4AF37]" />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;