import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, User, Plus } from 'lucide-react';
import useMobile from '../../hooks/useMobile';
import { useAuth } from '../../utils/AuthContext';

const MobileBottomNav = ({ onAddClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useMobile();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Ana Sayfa',
      icon: Home,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'clients',
      label: 'Müşteriler',
      icon: Users,
      path: '/clients/list',
      color: 'text-green-600'
    },
    {
      id: 'add',
      label: 'Ekle',
      icon: Plus,
      action: () => onAddClick ? onAddClick() : navigate('/clients/new'),
      color: 'text-primary-600',
      isAction: true
    },
    {
      id: 'lessons',
      label: 'Dersler',
      icon: Calendar,
      path: '/lessons',
      color: 'text-purple-600'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      path: '/profile',
      color: 'text-orange-600'
    }
  ];

  const isActive = (item) => {
    if (item.id === 'clients' && location.pathname.startsWith('/clients')) {
      return true;
    }
    return location.pathname === item.path;
  };

  const handleItemClick = (item) => {
    if (item.isAction && item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Long press handler for profile to show logout
  const handleProfileLongPress = () => {
    // Disabled as auth is removed
  };

  return (
    <>
      {/* Bottom padding for content to not overlap with fixed nav */}
      <div className="h-20 mobile-show" />
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav mobile-safe-area bg-white/80 backdrop-blur-lg border-t border-gray-200/50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (item.id === 'profile') handleProfileLongPress();
                }}
                className={`nav-item group relative ${
                  active ? 'active' : 'text-gray-600'
                } transition-all duration-300 touch-manipulation`}
              >
                {/* Special styling for Add button */}
                {item.isAction ? (
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-active:scale-90 transform hover:scale-105">
                    <Icon className="h-7 w-7" />
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <>
                    <div className={`p-3 rounded-2xl group-active:scale-90 transition-all duration-300 relative overflow-hidden ${
                      active ? 'bg-primary-50 shadow-md' : 'hover:bg-gray-50'
                    }`}>
                      {/* Background glow for active state */}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl animate-pulse" />
                      )}
                      
                      <Icon className={`h-6 w-6 relative z-10 transition-all duration-300 ${
                        active ? `${item.color} transform scale-110` : 'text-gray-500 group-hover:text-gray-700'
                      }`} />
                    </div>
                    
                    <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                      active ? `${item.color} font-semibold` : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
                
                {/* Active indicator with animation */}
                {active && !item.isAction && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-600 rounded-full animate-pulse shadow-md" />
                )}

                {/* Ripple effect */}
                <div className="absolute inset-0 bg-primary-600/20 rounded-2xl transform scale-0 group-active:scale-100 transition-transform duration-200 opacity-50" />


              </button>
            );
          })}
        </div>
      </nav>

    </>
  );
};

export default MobileBottomNav;
