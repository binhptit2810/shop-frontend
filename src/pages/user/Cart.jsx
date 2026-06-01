import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { showToast } from '../../services/toast';
import { Trash2, ShoppingBag, CreditCard, Grid } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useContext(CartContext);

  const handleQtyChange = async (item, val) => {
    const newQty = item.quantity + val;
    if (newQty < 1) return;
    
    const res = await updateQuantity(item.id, newQty);
    if (!res.success) {
      showToast(res.message, 'error');
    }
  };

  const handleRemove = async (itemId) => {
    const res = await removeFromCart(itemId);
    if (res.success) {
      showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (loading && !cart) {
    return <div className="loading-spinner"></div>;
  }

  const items = cart?.items || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="glass-panel empty-state">
          <ShoppingBag size={48} color="var(--text-muted)" />
          <h3>Giỏ hàng trống</h3>
          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '12px' }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="cart-page-grid">
          {/* List of Cart Items */}
          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.id} className="glass-panel cart-item-card">
                {item.productImageUrl ? (
                  <img 
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080'}${item.productImageUrl}`} 
                    alt={item.productName} 
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="no-image-placeholder cart-item-img" style={{ display: item.productImageUrl ? 'none' : 'flex' }}>
                  <Grid size={24} />
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.productName}</h3>
                  <span className="cart-item-price">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productPrice)}
                  </span>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => handleQtyChange(item, -1)} 
                      className="qty-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleQtyChange(item, 1)} 
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="qty-btn"
                    style={{ color: 'var(--error)' }}
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="glass-panel cart-summary-card">
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Tóm tắt đơn hàng</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
                <span style={{ fontWeight: 600 }}>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              
              <div className="summary-row">
                <span>Giao hàng:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Miễn phí</span>
              </div>
              
              <div className="summary-row summary-total">
                <span>Tổng cộng:</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart.totalPrice)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
              <CreditCard size={18} />
              <span>Tiến hành thanh toán</span>
            </Link>
            
            <Link to="/" style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
