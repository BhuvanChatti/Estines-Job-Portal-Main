import React, { useState } from 'react'
import '../../styles/Layout.css'
import { userMenu } from './Menu/userMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Layout = ({ children, defaultCollapsed = false }) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const userType = user?.type || '';
    const sidebarMenu = userMenu.filter(m => !m.role || m.role === userType);
    const fullName = user ? `${user.name || ''} ${user.lastName || ''}`.trim() : 'Guest';

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <div className="sidebar-header">
                    {!collapsed && <div className='logo'>Estines Jobs</div>}
                    <button
                        className="sidebar-toggle"
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        <i className={`fa-solid ${collapsed ? 'fa-bars' : 'fa-chevron-left'}`}></i>
                    </button>
                </div>

                {!collapsed && (
                    <>
                        <hr />
                        <p className='text text-center'>Welcome, {fullName}</p>
                    </>
                )}

                <div className='menu'>
                    {sidebarMenu.map(menu => {
                        const isActive = location.pathname === menu.path;
                        return (
                            <div
                                key={menu.path}
                                className={`menu-item ${isActive ? 'active' : ''} ${collapsed ? 'menu-item-collapsed' : ''}`}
                                title={collapsed ? menu.name : ''}
                            >
                                <Link to={menu.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                                    <i className={menu.icon}></i>
                                    {!collapsed && <span>{menu.name}</span>}
                                </Link>
                            </div>
                        );
                    })}
                    <div
                        className={`menu-item ${collapsed ? 'menu-item-collapsed' : ''}`}
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <i className="fa-solid fa-right-to-bracket"></i>
                        {!collapsed && <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Logout</span>}
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>{children}</div>
        </div>
    );
};

export default Layout;
