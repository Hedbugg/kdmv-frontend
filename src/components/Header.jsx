function Header({ time }) {
  return (
    <header className="sell-header">
      <span className="time">{time}</span>
      <h1 className="logo">kdmv</h1>
      <span className="cart">Tinh Muoy Tov</span>
    </header>
  );
}

export default Header;
