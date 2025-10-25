function ProductCard({ product, handleAdd, AfterClick }) {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} />   {/* ✅ Works if `img` is a path or URL */}
      <h3>{product.name}</h3>
      <h3>{product.price}</h3>
      <button
        className="buy-btt"
onClick={() => {
  handleAdd(product);
}}
      >
        Add
      </button> 
    </div>
  );
}

export default ProductCard;
