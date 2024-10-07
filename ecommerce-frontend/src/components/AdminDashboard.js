import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const displayMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleAddToCart = async (productId) => {
    const quantity = quantities[productId] || 1;
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        displayMessage('Please log in to add products to the cart.', 'error');
        return;
      }

      const userId = storedUser.id;
      await axios.post(`http://localhost:3000/api/cart/${userId}`, {
        productId,
        quantity,
      });
      displayMessage('Product added to cart!', 'success');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      displayMessage('Error adding product to cart.', 'error');
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from local storage
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-welcome">Welcome, {user?.name || 'Admin'}!</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="button-group-container">
        {/* Left-aligned buttons */}
        <div className="button-group-left">
          <Link to="/create-product">
            <button className="btn btn-cart">Add Product</button>
          </Link>
          <Link to="/update-product">
            <button className="btn btn-back">Update Product</button>
          </Link>
          <Link to="/delete-product">
            <button className="btn btn-remove">Delete Product</button>
          </Link>
        </div>

        {/* Right-aligned buttons */}
        <div className="button-group-right">
          <Link to="/cart">
            <button className="btn btn-cart">Cart</button>
          </Link>
          <Link to="/browse-category">
            <button className="btn btn-back">Search</button>
          </Link>
          <button className="btn btn-remove" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Product ID</th>
            <th>Price</th>
            <th>Category</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product._id}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantities[product._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product._id, parseInt(e.target.value, 10))
                  }
                  className="quantity-input"
                />
              </td>
              <td>
                <button
                  className="btn btn-add"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;