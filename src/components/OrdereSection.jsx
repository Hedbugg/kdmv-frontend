function OrderSection({ total, handleClear, handleOrder }) {
    
  return (
    <div className="order-section">
      <h1 className="totalTxt">Total is: ${Number(total).toFixed(2)}</h1>

      <button className="order-btt" onClick={handleOrder}>
        Order
      </button>
      <button className="clear-btt" onClick={handleClear}>
        Clear
      </button>
      
    </div>
  );
}

export default OrderSection;
