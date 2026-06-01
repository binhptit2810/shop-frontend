import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Search, Grid, Eye, ShoppingBag } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="catalog-container">
      {/* Premium Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Nâng Tầm Trải Nghiệm Mua Sắm Công Nghệ</h1>
          <p>
            Khám phá những thiết bị công nghệ đỉnh cao, phụ kiện cao cấp và giải pháp kỹ thuật số mới nhất. Giao dịch an toàn, tiện lợi và giao hàng siêu tốc.
          </p>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button 
              onClick={() => document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn btn-primary"
            >
              Mua ngay
            </button>
            <button 
              onClick={() => document.getElementById('catalog-start')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn btn-secondary"
            >
              Xem sản phẩm
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-circle-deco"></div>
          <div className="hero-image-placeholder">
            <ShoppingBag size={48} />
            <span style={{ fontSize: '15px' }}>Antigravity Shop</span>
          </div>
        </div>
      </div>

      <div id="catalog-start" style={{ scrollMarginTop: '100px' }}></div>

      {/* Modern Search & Category Filter Bar */}
      <div className="search-filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={22} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm theo tên hoặc từ khóa mô tả..." 
            className="input-field" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Lọc theo danh mục:
          </span>
          <div className="category-filter-list">
            <button 
              className={`category-chip ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => handleCategorySelect(null)}
            >
              Tất cả sản phẩm
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {/* Discount Badge */}
                <span style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  background: 'var(--accent)', 
                  color: '#fff', 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  padding: '3px 8px', 
                  borderRadius: '6px', 
                  zIndex: 2,
                  boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)'
                }}>
                  -20%
                </span>

                {product.imageUrl ? (
                  <img 
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080'}${product.imageUrl}`} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="no-image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
                  <Grid size={32} />
                  <span>Chưa có ảnh</span>
                </div>
              </div>

              <div className="product-info">
                <span className="product-card-category">{product.categoryName}</span>
                <h3 className="product-name" title={product.name}>{product.name}</h3>
                <p className="product-desc">{product.description || 'Chưa có mô tả chi tiết cho sản phẩm.'}</p>
                <div className="product-meta">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="product-price">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 500 }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.25)}
                    </span>
                  </div>
                  {product.quantity > 0 ? (
                    <Link to={`/products/${product.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}>
                      <Eye size={15} />
                      <span>Chi tiết</span>
                    </Link>
                  ) : (
                    <span className="product-badge-outofstock">Hết hàng</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel empty-state">
          <h3>Không tìm thấy sản phẩm</h3>
          <p>Không tìm thấy sản phẩm nào khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
