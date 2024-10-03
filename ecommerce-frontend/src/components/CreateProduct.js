import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
  
      if (!storedUser || storedUser.role !== 'admin') {
        setMessage('Only admin users can create products.');
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
  
      await axios.post(
        'http://localhost:3000/api/products',
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      setMessage('Product created successfully!');
      setMessageType('success');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
  
      if (error.response?.status === 401) {
        setMessage('Unauthorized. Please log in as an admin.');
      } else if (error.response?.status === 400) {
        setMessage('Invalid product data. Please try again.');
      } else {
        setMessage('Error creating product. Please try again.');
      }
      setMessageType('error');
    }
  };
  
  return (
    <div className="create-product-container">
        <div className="header-buttons">
        <button className="btn-back" onClick={() => window.history.back()}>Back to Home</button>
      </div>
      <h2 className="page-title">Create a New Product</h2>

      {message && <p className={`message ${messageType}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="create-product-form">
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
        <button type="submit" className="btn-create">Create Product</button>
      </form>
    </div>
  );
}

export default CreateProduct;