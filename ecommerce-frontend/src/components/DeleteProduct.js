import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeleteProduct() {
  const [productId, setProductId] = useState(''); // Product ID to be manually entered
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // Function to delete the product using DELETE request
  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser || storedUser.role !== 'admin') {
        setMessage('Only admin users can delete products.');
        setMessageType('error');
        return;
      }

      const token = storedUser.token;

      if (!token) {
        setMessage('Unauthorized. Please log in as an admin.');
        setMessageType('error');
        return;
      }

      // DELETE request to delete the product based on productId
      await axios.delete(
        `http://localhost:3000/api/products/${productId}`, // Product ID is entered by the user
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization token in headers
          },
        }
      );

      setMessage('Product deleted successfully!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Error deleting product. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="delete-product-container">
        <div className="header-buttons">
        <button className="btn-back" onClick={() => window.history.back()}>Back to Home</button>
      </div>
      <h2>Delete a Product</h2>

      {/* Display success or error message */}
      {message && <p className={`message ${messageType}`}>{message}</p>}

      <form onSubmit={handleDeleteProduct}>
        {/* Manually enter Product ID */}
        <div className="input-group">
          <label>Product ID</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-delete">Delete Product</button>
      </form>
    </div>
  );
}

export default DeleteProduct;