import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Dashboard({ user }) {
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
    const quantity = quantities[productId] || 1; // Default to 1 if no quantity selected
    try {
      const storedUser = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
      if (!storedUser) {
        displayMessage('Please log in to add products to the cart.', 'error');
        return;
      }

      const userId = storedUser.id; // Get the user ID from the stored user data

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || 'User'}!</h2>

        {/* Button container */}
        <div className="button-group">
          <Link to="/cart">
            <button className="btn btn-cart">Cart</button>
          </Link>
          <Link to="/browse-category">
            <button className="btn btn-back">Search</button>
          </Link>
          <button
            className="btn btn-remove"
            onClick={() => {
              localStorage.removeItem('user'); // Clear user data
              window.location.href = '/login'; // Redirect to login page
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Display success or error message */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
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
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={quantities[product._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product._id, parseInt(e.target.value, 10))
                  }
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

export default Dashboard;