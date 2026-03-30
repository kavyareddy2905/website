import React from 'react';

const ProductCard = ({ product }) => {
  // SAFETY CHECK: If product is undefined, don't crash the site
  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <div className={`relative bg-white shadow-md border border-gray-100 group transition-all duration-300 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
      
      {/* IMAGE CONTAINER */}
      <div className="relative h-80 overflow-hidden bg-[#f3f3f3]">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-110'}`}
        />
        
        {/* OVERLAYS */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-black/60 text-white text-xs uppercase px-3 py-1 tracking-widest border border-white/30">
              Out of Stock
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase animate-pulse z-10">
            Only {product.stock} Left
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="p-4 text-left">
        <h3 className="text-[#4A0E0E] font-medium text-sm truncate">{product.name}</h3>
        <p className="text-gray-900 font-bold mt-1 text-lg">₹{product.price}</p>
        
        <button 
          disabled={isOutOfStock}
          className={`w-full mt-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-colors
            ${isOutOfStock 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#4A0E0E] text-white hover:bg-black'}`}
        >
          {isOutOfStock ? 'Notify Me' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;