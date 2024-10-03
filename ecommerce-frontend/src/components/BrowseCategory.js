import axios from 'axios';
import { useState } from 'react';

function BrowseCategory() {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/products/category?category=${category}`);
      if (data.length > 0) {
        setProducts(data);
        setMessage('');
      } else {
        setProducts([]);
        setMessage('No products found for this category.');
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setMessage('Error fetching products by category.');
    }
  };

  return (
    <div className="browse-container">
      <div className="header-buttons">
        <button className="btn-back" onClick={() => window.history.back()}>Back to Home</button>
      </div>
      <h2 className="browse-title">Search Products</h2>
      <div className="search-container">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category..."
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-search">Search</button>
      </div>

      {message && <p className="error-message">{message}</p>}

      {products.length > 0 && (
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BrowseCategory;