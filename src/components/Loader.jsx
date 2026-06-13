function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Loader;
