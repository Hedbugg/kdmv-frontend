import "./../Style/Sell.css";
import { useState, useEffect } from "react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import OrderSection from "./OrdereSection";

function Sell() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("https://hedbugg.kesug.com/products.php");
        const data = await res.json();

        console.log("PRODUCTS:", data);

        if (!data.success) {
          setError("Failed to load products");
          return;
        }

        setProducts(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setTotal((prev) => prev + Number(product.price));
  };

  const handleClear = () => {
    setCartItems([]);
    setTotal(0);
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      window.alert("Please order something");
      return;
    }

    try {
      const res = await fetch("https://hedbugg.kesug.com/sendOrderTodb.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),
          total: total,
        }),
      });

      const data = await res.json();
      console.log("ORDER RESPONSE:", data);

      if (data.success) {
        window.alert(`Order saved! Total: $${total.toFixed(2)}`);
        handleClear();
      } else {
        window.alert("Failed to save order");
      }
    } catch (err) {
      console.error("Order error:", err);
      window.alert("Server error");
    }
  };

  return (
    <div className="sell-container">
      <Header time={time} />

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleAdd={handleAdd}
          />
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-preview">
          <h3>Your Order:</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <OrderSection
            total={total}
            handleClear={handleClear}
            handleOrder={handleOrder}
          />
        </div>
      )}

      {cartItems.length === 0 && (
        <OrderSection
          total={total}
          disabled={true}
        />
      )}
    </div>
  );
}

export default Sell;
