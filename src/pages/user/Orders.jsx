import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { showToast } from '../../services/toast';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Check, 
  XCircle,
  HelpCircle,
  Eye
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await API.get('/orders/my');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử đơn hàng:', error);
      showToast('Không thể tải lịch sử đơn hàng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'SHIPPING': return 'status-shipping';
      case 'DELIVERED': return 'status-delivered';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  // Stepper timeline definition
  const getStepperSteps = (status) => {
    const steps = [
      { key: 'PENDING', label: 'Đặt đơn', icon: Clock },
      { key: 'CONFIRMED', label: 'Xác nhận', icon: CheckCircle2 },
      { key: 'SHIPPING', label: 'Đang giao', icon: Truck },
      { key: 'DELIVERED_COMPLETED', label: 'Hoàn thành', icon: Check }
    ];

    if (status === 'CANCELLED') {
      return [
        { key: 'PENDING', label: 'Đặt đơn', icon: Clock, completed: true },
        { key: 'CANCELLED', label: 'Đã hủy', icon: XCircle, active: true, error: true }
      ];
    }

    let activeIndex = 0;
    if (status === 'PENDING') activeIndex = 0;
    else if (status === 'CONFIRMED') activeIndex = 1;
    else if (status === 'SHIPPING') activeIndex = 2;
    else if (status === 'DELIVERED' || status === 'COMPLETED') activeIndex = 3;

    return steps.map((step, idx) => ({
      ...step,
      active: idx === activeIndex,
      completed: idx <= activeIndex
    }));
  };

  const filterOrders = () => {
    if (activeTab === 'ALL') return orders;
    if (activeTab === 'PENDING') return orders.filter(o => o.orderStatus === 'PENDING');
    if (activeTab === 'CONFIRMED') return orders.filter(o => o.orderStatus === 'CONFIRMED');
    if (activeTab === 'SHIPPING') return orders.filter(o => o.orderStatus === 'SHIPPING');
    if (activeTab === 'DELIVERED_COMPLETED') return orders.filter(o => o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED');
    if (activeTab === 'CANCELLED') return orders.filter(o => o.orderStatus === 'CANCELLED');
    return orders;
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  const filteredOrders = filterOrders();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Đơn hàng của tôi</h1>
        <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Xem và quản lý thông tin trạng thái các đơn hàng bạn đã mua.
        </span>
      </div>

      {/* Tabs Filter (Shopee Style) */}
      <div className="order-tabs">
        <button className={`order-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
          Tất cả ({orders.length})
        </button>
        <button className={`order-tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveTab('PENDING')}>
          Chờ xử lý ({orders.filter(o => o.orderStatus === 'PENDING').length})
        </button>
        <button className={`order-tab-btn ${activeTab === 'CONFIRMED' ? 'active' : ''}`} onClick={() => setActiveTab('CONFIRMED')}>
          Đã xác nhận ({orders.filter(o => o.orderStatus === 'CONFIRMED').length})
        </button>
        <button className={`order-tab-btn ${activeTab === 'SHIPPING' ? 'active' : ''}`} onClick={() => setActiveTab('SHIPPING')}>
          Đang giao ({orders.filter(o => o.orderStatus === 'SHIPPING').length})
        </button>
        <button className={`order-tab-btn ${activeTab === 'DELIVERED_COMPLETED' ? 'active' : ''}`} onClick={() => setActiveTab('DELIVERED_COMPLETED')}>
          Hoàn thành ({orders.filter(o => o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED').length})
        </button>
        <button className={`order-tab-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`} onClick={() => setActiveTab('CANCELLED')}>
          Đã hủy ({orders.filter(o => o.orderStatus === 'CANCELLED').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass-panel empty-state" style={{ padding: '60px 20px' }}>
          <Package size={54} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3>Không tìm thấy đơn hàng nào</h3>
          <p>Bạn không có đơn hàng nào thuộc trạng thái này.</p>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => {
            const steps = getStepperSteps(order.orderStatus);
            return (
              <div key={order.id} className="glass-panel order-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                
                {/* Order Topbar Info */}
                <div className="order-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <span className="order-id" style={{ fontSize: '18px', fontWeight: 800 }}>Đơn hàng #{order.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <Calendar size={14} />
                      <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  <span className={`order-status ${getStatusClass(order.orderStatus)}`} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                    {order.orderStatus === 'PENDING' && '🟡 '}
                    {order.orderStatus === 'CONFIRMED' && '🔵 '}
                    {order.orderStatus === 'SHIPPING' && '🟠 '}
                    {(order.orderStatus === 'DELIVERED' || order.orderStatus === 'COMPLETED') && '🟢 '}
                    {order.orderStatus === 'CANCELLED' && '🔴 '}
                    {translateStatus(order.orderStatus)}
                  </span>
                </div>

                {/* Progress Stepper Timeline */}
                <div className="order-stepper" style={{ marginBottom: '28px' }}>
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <React.Fragment key={step.key}>
                        {idx > 0 && (
                          <div className={`step-line ${step.completed ? 'completed' : ''} ${step.error ? 'error' : ''}`} />
                        )}
                        <div className={`step-item ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''} ${step.error ? 'error' : ''}`}>
                          <div className="step-icon-wrapper">
                            <StepIcon size={16} />
                          </div>
                          <span className="step-label">{step.label}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Main Order Items details (with images!) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  {order.items?.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#fff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.imageUrl ? (
                          <img 
                            src={`${import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080'}${item.imageUrl}`} 
                            alt={item.productName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="no-image-placeholder" style={{ display: item.imageUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="var(--text-muted)" />
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                          {item.productName}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <span>Số lượng: <strong>x{item.quantity}</strong></span>
                          <span>|</span>
                          <span>Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</span>
                        </div>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery and Pricing row */}
                <div className="order-details-grid" style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', margin: 0 }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>Địa chỉ nhận hàng: <strong>{order.shippingAddress}</strong></span>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', margin: 0 }}>
                      <Phone size={14} color="var(--primary)" />
                      <span>Số điện thoại: <strong>{order.phoneNumber}</strong></span>
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Thành tiền:</span>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
