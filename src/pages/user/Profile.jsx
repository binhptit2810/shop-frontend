import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { 
  User, 
  Mail, 
  Shield, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await API.get('/orders/my');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải thông tin đơn hàng cá nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING': return '🟡 Chờ xử lý';
      case 'CONFIRMED': return '🔵 Đã xác nhận';
      case 'SHIPPING': return '🟠 Đang giao hàng';
      case 'DELIVERED': return '🟢 Đã giao hàng';
      case 'COMPLETED': return '✅ Hoàn thành';
      case 'CANCELLED': return '🔴 Đã hủy';
      default: return status;
    }
  };

  const totalSpent = orders
    .filter(o => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const lastOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Hồ sơ cá nhân</h1>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
        {/* Avatar */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)'
        }}>
          <User size={56} />
        </div>

        {/* User Info details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '240px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.username}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Mail size={16} />
              <span>Email: <strong>{user?.email || 'Chưa cập nhật'}</strong></span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Shield size={16} />
              <span>Vai trò: 
                <strong style={{ 
                  marginLeft: '6px',
                  fontSize: '12px',
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: 'var(--primary)', 
                  padding: '4px 10px', 
                  borderRadius: '12px' 
                }}>
                  {user?.role}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel kpi-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>ĐƠN HÀNG ĐÃ ĐẶT</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{orders.length}</h3>
          </div>
        </div>

        <div className="glass-panel kpi-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>TỔNG MUA SẮM</span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px', color: '#34d399' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSpent)}
            </h3>
          </div>
        </div>
      </div>

      {/* Last Order Preview */}
      {lastOrder && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Đơn hàng gần đây nhất</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 700 }}>Mã đơn hàng: #{lastOrder.id}</span>
              <span className={`order-status status-${lastOrder.orderStatus.toLowerCase()}`} style={{ fontWeight: 700 }}>
                {translateStatus(lastOrder.orderStatus)}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                <span>Thời gian: <strong>{new Date(lastOrder.createdAt).toLocaleString('vi-VN')}</strong></span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} />
                <span>Liên hệ: <strong>{lastOrder.phoneNumber}</strong></span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} />
                <span>Địa chỉ nhận: <strong>{lastOrder.shippingAddress}</strong></span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
