import "./../Style/Sell.css";
import { useState, useEffect } from "react"; //useState like fuction
import Header from "./Header";
import ProductCard from "./ProductCard";
import OrderSection from "./OrdereSection";

function Sell() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // 🛒 store added items

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

  // 🧩 Fetch product data from database
  useEffect(() => {
    fetch("https://hedbugg.kesug.com/getProducts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Failed to load products");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // ➕ Add item to cart and sum price
  const handleAdd = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    setTotal((prevTotal) => prevTotal + Number(product.price));
  };

  // ❌ Clear order
  const handleClear = () => {
    setTotal(0);
    setCartItems([]); // clear all added items
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
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_name: item.name,
            price: Number(item.price),
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.alert(`Order saved successfully! Total: $${total.toFixed(2)}`);
        setCartItems([]);
        setTotal(0);
      } else {  
        window.alert("Failed to save order: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Error connecting to server");
    }
  };

  return (
    <div className="sell-container">
      {/* Header */}
      <Header time={time} />

      {/* Product Grid */}
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
            


      {/* Optional: show added items */}
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
                {/* Order Section */} 
       <OrderSection
        total={total}
        handleClear={handleClear}
        handleAdd={handleAdd}
        handleOrder={handleOrder}
      />
        </div>
      )}


      
    </div>
  );
}

export default Sell;
