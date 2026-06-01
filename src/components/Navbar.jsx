import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  History 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <ShoppingBag size={28} color="#818cf8" />
        <span>Antigravity Shop</span>
      </Link>

      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Sản phẩm
        </NavLink>

        {user && (
          <>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <ShoppingCart size={20} />
              <span>Giỏ hàng</span>
              {getItemCount() > 0 && (
                <span className="nav-cart-badge">{getItemCount()}</span>
              )}
            </NavLink>

            <NavLink 
              to="/orders" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <History size={20} />
              <span>Đơn mua</span>
            </NavLink>

            {isAdmin() && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={20} />
                <span>Quản trị</span>
              </NavLink>
            )}
          </>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
            <Link to="/profile" className="nav-item" style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserIcon size={18} />
              <span>{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '14px' }}>
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', marginLeft: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
