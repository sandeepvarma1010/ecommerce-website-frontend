import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [quantities, setQuantities] = useState({});
  const [showDropdown, setShowDropdown] = useState({}); // To control when to show the dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
        if (!storedUser) {
          setMessage('Please log in to view your cart.');
          return;
        }

        const userId = storedUser.id; // Get userId from the stored user data

        // Fetch the user's cart from the backend
        const { data } = await axios.get(`http://localhost:3000/api/cart/${userId}`);
        setCartItems(data.products || []);
        setTotalPrice(data.totalPrice || 0);

        // Initialize the quantities for each product in the cart
        const initialQuantities = {};
        data.products.forEach(item => {
          if (item.productId && item.productId._id) {
            initialQuantities[item.productId._id] = item.quantity;
          }
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setMessage('Error fetching cart items.');
      }
    };

    fetchCartItems();
  }, []);

  // Function to handle back to the correct dashboard
  const handleBackToDashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get user data
    if (storedUser?.role === 'admin') {
      navigate('/admin-dashboard'); // Redirect to Admin Dashboard if the user is admin
    } else {
      navigate('/dashboard'); // Redirect to normal Dashboard for regular users
    }
  };

  // Function to toggle the dropdown for quantity removal
  const toggleDropdown = (productId) => {
    setShowDropdown(prev => ({
      ...prev,
      [productId]: !prev[productId], // Toggle the dropdown visibility for each product
    }));
  };

  // Remove specific quantity from cart
  const removeQuantity = async (productId) => {
    const quantityToRemove = quantities[productId]; // Get quantity to remove
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get logged in user

    try {
      await axios.put(`http://localhost:3000/api/cart/${storedUser.id}/${productId}`, { quantity: quantityToRemove });
      setMessage('Product quantity removed successfully!');
      const { data } = await axios.get(`http://localhost:3000/api/cart/${storedUser.id}`);
      setCartItems(data.products || []);
      setTotalPrice(data.totalPrice || 0);
    } catch (error) {
      setMessage('Error removing product quantity.');
    }
    // Hide dropdown after removal
    setShowDropdown(prev => ({
      ...prev,
      [productId]: false,
    }));
  };

  // Remove entire product from cart
  const removeEntireProduct = async (productId) => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Get logged in user

    try {
      await axios.delete(`http://localhost:3000/api/cart/${storedUser.id}/${productId}`);
      setMessage('Product removed from cart successfully!');
      const { data } = await axios.get(`http://localhost:3000/api/cart/${storedUser.id}`);
      setCartItems(data.products || []);
      setTotalPrice(data.totalPrice || 0);
    } catch (error) {
      setMessage('Error removing product from cart.');
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {/* Display message if needed */}
      {message && <p className="error-message">{message}</p>}

      {/* If the cart is empty */}
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                // Check if item.productId is not null or undefined
                <tr key={item.productId?._id || Math.random()}>
                  <td>{item.productId?.name || 'Unknown'}</td>
                  <td>${item.productId?.price || '0'}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {/* Button to toggle dropdown for removing quantity */}
                    <button
                      className="btn-remove-quantity"
                      onClick={() => toggleDropdown(item.productId?._id)}
                      disabled={!item.productId} // Disable if productId is not available
                    >
                      Edit Quantity
                    </button>

                    {/* Dropdown to select quantity to remove, shown only when toggled */}
                    {showDropdown[item.productId?._id] && (
                      <div>
                        <select
                          value={quantities[item.productId?._id] || item.quantity}
                          onChange={(e) =>
                            setQuantities(prev => ({
                              ...prev,
                              [item.productId?._id]: parseInt(e.target.value, 10),
                            }))
                          }
                        >
                          {[...Array(item.quantity).keys()].map((q) => (
                            <option key={q + 1} value={q + 1}>
                              {q + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-remove"
                          onClick={() => removeQuantity(item.productId?._id)}
                        >
                          Confirm
                        </button>
                      </div>
                    )}

                    {/* Button to remove entire product */}
                    <button
                      className="btn btn-remove"
                      onClick={() => removeEntireProduct(item.productId?._id)}
                      disabled={!item.productId} // Disable if productId is not available
                    >
                      Remove Product
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="total-price">Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>
      )}

      {/* Back to Dashboard button */}
      <button className="btn-back" onClick={handleBackToDashboard}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Cart;