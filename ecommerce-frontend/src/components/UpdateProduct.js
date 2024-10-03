import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UpdateProduct() {
  const [productId, setProductId] = useState(''); // Product ID to be manually entered
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  // Function to update the product using PUT request
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser || storedUser.role !== 'admin') {
        setMessage('Only admin users can update products.');
        setMessageType('error');
        return;
      }

      const token = storedUser.token;

      if (!token) {
        setMessage('Unauthorized. Please log in as an admin.');
        setMessageType('error');
        return;
      }

      const productData = {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
      };

      // PUT request to update the product based on productId
      await axios.put(
        `http://localhost:3000/api/products/${productId}`, // Product ID is entered by the user
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Authorization token in headers
          },
        }
      );

      setMessage('Product updated successfully!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="update-product-container">
        <div className="header-buttons">
        <button className="btn-back" onClick={() => window.history.back()}>Back to Home</button>
      </div>
      <h2>Update Product</h2>

      {/* Display success or error message */}
      {message && <p className={`message ${messageType}`}>{message}</p>}

      <form onSubmit={handleUpdateProduct}>
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

        <div className="input-group">
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-update">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;