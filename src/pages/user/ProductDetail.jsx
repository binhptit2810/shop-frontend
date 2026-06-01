import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { showToast } from '../../services/toast';
import { ShoppingCart, ArrowLeft, Grid } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      showToast('Không tìm thấy sản phẩm!', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= (product?.quantity || 1)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
      navigate('/login');
      return;
    }

    const res = await addToCart(product.id, quantity);
    if (res.success) {
      showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } else {
      showToast(res.message, 'error');
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (!product) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={18} />
        <span>Quay lại trang chủ</span>
      </Link>

      <div className="glass-panel detail-container" style={{ padding: '40px' }}>
        {/* Left Side: Product Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="detail-image-wrapper">
            {product.imageUrl ? (
              <img 
                src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080'}${product.imageUrl}`} 
                alt={product.name} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="no-image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
              <Grid size={48} />
              <span>Chưa có hình ảnh</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details info */}
        <div className="detail-info">
          <span className="detail-category">{product.categoryName}</span>
          <h1 className="detail-title">{product.name}</h1>
          
          <div className="detail-price-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
              <span className="detail-price">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              <span style={{ fontSize: '15px', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 500 }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.25)}
              </span>
              <span style={{ 
                fontSize: '11px', 
                background: 'var(--accent)', 
                color: '#fff', 
                padding: '3px 8px', 
                borderRadius: '4px', 
                fontWeight: 800 
              }}>
                -20% GIẢM
              </span>
            </div>
            <span className={`detail-stock ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`} style={{ marginTop: '4px' }}>
              {product.quantity > 0 ? `Còn hàng (Tồn: ${product.quantity})` : 'Hết hàng'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontWeight: 700 }}>Mô tả sản phẩm:</h4>
            <p className="detail-description">{product.description || 'Chưa có mô tả chi tiết cho sản phẩm.'}</p>
          </div>

          {product.quantity > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Số lượng mua:</span>
                <div className="quantity-selector">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="qty-btn"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="qty-btn"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary" style={{ width: '100%', padding: '14px 20px', fontSize: '16px' }}>
                <ShoppingCart size={20} />
                <span>Thêm vào giỏ hàng</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
