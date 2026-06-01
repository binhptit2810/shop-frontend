import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag as TagIcon, 
  ClipboardList, 
  Users, 
  TrendingUp, 
  LogOut, 
  User as UserIcon,
  Store
} from 'lucide-react';
import { showToast } from '../services/toast';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* 1. Sidebar Left */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Store size={24} color="var(--primary)" />
          <span>Shop Admin</span>
        </div>

        <nav className="admin-sidebar-menu">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Tổng quan (KPIs)</span>
          </NavLink>

          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>Quản lý sản phẩm</span>
          </NavLink>

          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <TagIcon size={18} />
            <span>Quản lý danh mục</span>
          </NavLink>

          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <ClipboardList size={18} />
            <span>Quản lý đơn hàng</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Quản lý thành viên</span>
          </NavLink>

          <NavLink 
            to="/admin/revenue" 
            className={({ isActive }) => `admin-sidebar-item ${isActive ? 'active' : ''}`}
          >
            <TrendingUp size={18} />
            <span>Doanh thu & Báo cáo</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content area on the right */}
      <div className="admin-main-viewport">
        {/* Topbar */}
        <header className="admin-topbar">
          <div></div>
          
          <div className="admin-topbar-user">
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserIcon size={16} color="var(--primary)" />
              {user?.username} (Administrator)
            </span>
          </div>
        </header>

        {/* Content wrapper */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
