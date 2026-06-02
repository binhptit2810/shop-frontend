import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  History,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getItemCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" onClick={() => setIsMenuOpen(false)}>
        <ShoppingBag size={28} color="#818cf8" />
        <span>Antigravity Shop</span>
      </Link>

      <button 
        className="mobile-toggle-btn" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        >
          Sản phẩm
        </NavLink>

        {user && (
          <>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
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
              onClick={() => setIsMenuOpen(false)}
            >
              <History size={20} />
              <span>Đơn mua</span>
            </NavLink>

            {isAdmin() && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Quản trị</span>
              </NavLink>
            )}
          </>
        )}

        {user ? (
          <div className="nav-user-section">
            <Link to="/profile" className="nav-item nav-user-profile" onClick={() => setIsMenuOpen(false)}>
              <UserIcon size={18} />
              <span>{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary nav-logout-btn">
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="nav-auth-section">
            <Link to="/login" className="btn btn-secondary nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-primary nav-register-btn" onClick={() => setIsMenuOpen(false)}>
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="navbar-backdrop" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;
