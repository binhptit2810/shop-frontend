import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { showToast } from '../../services/toast';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Phone, MapPin, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCartLocal } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      if (!isSuccess) {
        showToast('Giỏ hàng trống! Không thể tiến hành thanh toán.', 'error');
        navigate('/');
      }
    }
  }, [cart, navigate, isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin giao hàng!', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/orders/checkout', {
        shippingAddress,
        phoneNumber
      });
      
      setOrderInfo(response.data);
      setIsSuccess(true);
      clearCartLocal();
      
      // Bắn pháo hoa ăn mừng đặt hàng thành công!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      showToast('Đặt hàng thành công!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess && orderInfo) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <div className="glass-panel text-center" style={{ padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <CheckCircle size={64} color="var(--accent)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Cảm Ơn Bạn Đã Mua Sắm!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Đơn hàng của bạn đã được tiếp nhận thành công. Trạng thái đơn hàng hiện tại là <strong>PENDING</strong> (Chờ xử lý).
          </p>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', marginBottom: '24px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Thông tin đơn hàng
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <p>Mã đơn hàng: <strong style={{ color: 'var(--text-primary)' }}>#{orderInfo.id}</strong></p>
              <p>Tổng thanh toán: <strong style={{ color: '#34d399' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.totalPrice)}</strong></p>
              <p>Người nhận: <strong style={{ color: 'var(--text-primary)' }}>{orderInfo.username}</strong></p>
              <p>Số điện thoại: <strong style={{ color: 'var(--text-primary)' }}>{orderInfo.phoneNumber}</strong></p>
              <p>Địa chỉ: <strong style={{ color: 'var(--text-primary)' }}>{orderInfo.shippingAddress}</strong></p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/" className="btn btn-secondary" style={{ flex: 1 }}>Tiếp tục mua</Link>
            <Link to="/orders" className="btn btn-primary" style={{ flex: 1 }}>Xem đơn hàng</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={18} />
        <span>Quay lại giỏ hàng</span>
      </Link>

      <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Thanh toán đơn hàng</h1>

      <div className="cart-page-grid">
        {/* Checkout Shipping Form */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={20} color="var(--primary)" />
            <span>Thông tin giao hàng</span>
          </h3>

          <div className="form-group">
            <label htmlFor="phone" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} />
              <span>Số điện thoại liên hệ</span>
            </label>
            <input 
              type="text" 
              id="phone" 
              className="input-field"
              placeholder="Nhập số điện thoại nhận hàng..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="address" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              <span>Địa chỉ nhận hàng</span>
            </label>
            <textarea 
              id="address" 
              className="input-field"
              placeholder="Nhập địa chỉ giao hàng chi tiết..."
              rows={4}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Đang thực hiện thanh toán...' : 'Xác nhận Đặt hàng'}
          </button>
        </form>

        {/* Mini Order Summary */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Tóm tắt đơn hàng</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {cart.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span style={{ maxWidth: '70%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.productName} <span style={{ fontWeight: 600 }}>x{item.quantity}</span>
                  </span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', color: '#34d399' }}>
              <span>Tổng thanh toán:</span>
              <span>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cart.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
