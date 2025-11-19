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

  // For testing onclick
  function AfterClick() {
    window.alert("click");
  }

  // ⏰ Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🧩 Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // const response = await fetch("https://hedbugg.kesug.com/getProducts.php", {
        //  // method: "GET",
        //   //credentials: "include",
        // });

        const response = await fetch("https://hedbugg.kesug.com/getProducts.php");


        const text = await response.text();
        console.log("RAW PRODUCT RESPONSE:", text);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Server returned invalid JSON");
        }

        if (data.success) {
          setProducts(data.data || []);
        } else {
          setError(data.message || "Failed to load products");
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ➕ Add to cart
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

  // ❌ Clear cart
  const handleClear = () => {
    setCartItems([]);
    setTotal(0);
  };

  // 🛒 Send order to backend
  const handleOrder = async () => {
    if (cartItems.length === 0) {
      window.alert("Please order something");
      return;
    }

    try {
      const response = await fetch("https://hedbugg.kesug.com/sendOrderTodb.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),
          total: total,
        }),
      });

      const text = await response.text();
      console.log("RAW ORDER RESPONSE:", text);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Server returned invalid JSON");
      }

      if (data.success) {
        window.alert(`Order saved successfully! Total: $${total.toFixed(2)}`);
        handleClear();
      } else {
        window.alert("Failed to save order: " + (data.message || "Unknown error"));
      }

    } catch (error) {
      console.error("Order error:", error);
      window.alert("Error: " + error.message);
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
            AfterClick={AfterClick}
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

      {/* Show disabled OrderSection when cart empty */}
      {cartItems.length === 0 && (
        <OrderSection
          total={total}
          handleClear={handleClear}
          handleOrder={handleOrder}
          disabled={true}
        />
      )}
    </div>
  );
}

export default Sell;
