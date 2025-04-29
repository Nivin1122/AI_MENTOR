import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiBook, 
  FiUsers, 
  FiDollarSign, 
  FiSettings, 
  FiLogOut,
  FiBarChart2,
  FiMessageSquare,
  FiChevronRight
} from 'react-icons/fi';

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubmenus, setActiveSubmenus] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <FiHome />,
      path: '/admin/dashboard',
    },
    {
      title: 'Courses',
      icon: <FiBook />,
      path: '/admin/courses',
      submenu: [
        { title: 'All Courses', path: '/admin/courses' },
        {
          title: 'Course Management',
          path: '/admin/courses/management',
          submenu: [
            { title: 'Add Course', path: '/admin/courses/add' },
            { title: 'Edit Courses', path: '/admin/courses/edit' }
          ]
        },
        {
          title: 'Categories',
          path: '/admin/courses/categories',
          submenu: [
            { title: 'All Categories', path: '/admin/courses/categories' },
            { title: 'Add Category', path: '/admin/category/create' },
            { title: 'Edit Categories', path: '/admin/courses/categories/edit' }
          ]
        }
      ]
    },
    {
      title: 'Users',
      icon: <FiUsers />,
      path: '/admin/users',
    },
    {
      title: 'Sales',
      icon: <FiDollarSign />,
      path: '/admin/sales',
    },
    {
      title: 'Analytics',
      icon: <FiBarChart2 />,
      path: '/admin/analytics',
    },
    {
      title: 'Messages',
      icon: <FiMessageSquare />,
      path: '/admin/messages',
    },
    {
      title: 'Settings',
      icon: <FiSettings />,
      path: '/admin/settings',
    },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setActiveSubmenus([]); // Clear all active submenus when collapsing
    }
  };

  const toggleSubmenu = (menuPath) => {
    setActiveSubmenus(prev => {
      const isActive = prev.includes(menuPath);
      if (isActive) {
        return prev.filter(path => !path.startsWith(menuPath));
      } else {
        return [...prev, menuPath];
      }
    });
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isActiveParent = (item) => {
    if (isActivePath(item.path)) return true;
    if (item.submenu) {
      return item.submenu.some(subItem => 
        isActivePath(subItem.path) || 
        (subItem.submenu && isActiveParent(subItem))
      );
    }
    return false;
  };

  // Enhanced animation variants
  const sidebarVariants = {
    expanded: {
      width: '280px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'beforeChildren'
      }
    },
    collapsed: {
      width: '80px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        when: 'afterChildren'
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.1
      }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const submenuVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        },
        opacity: {
          duration: 0.25,
          ease: 'easeInOut'
        },
        staggerChildren: 0.05
      }
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
          ease: 'easeInOut'
        },
        opacity: {
          duration: 0.2
        }
      }
    }
  };

  const submenuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const iconVariants = {
    expanded: { rotate: 0 },
    collapsed: { rotate: 180 }
  };

  const glowVariants = {
    active: {
      boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)',
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    },
    inactive: {
      boxShadow: '0 0 0px rgba(37, 99, 235, 0)'
    }
  };

  const renderSubmenuItems = (items, parentPath = '') => {
    return items.map((subItem, subIndex) => {
      const currentPath = `${parentPath}-${subIndex}`;
      
      return (
        <motion.div
          key={subItem.title}
          variants={submenuItemVariants}
          custom={subIndex}
        >
          {subItem.submenu ? (
            <div className="ml-2">
              <motion.button
                onClick={() => toggleSubmenu(currentPath)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  isActiveParent(subItem)
                    ? 'bg-gray-800/50 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                }`}
              >
                <span>{subItem.title}</span>
                <FiChevronRight
                  className={`h-3 w-3 transform transition-transform ${
                    activeSubmenus.includes(currentPath) ? 'rotate-90' : ''
                  }`}
                />
              </motion.button>
              <AnimatePresence>
                {activeSubmenus.includes(currentPath) && (
                  <motion.div
                    variants={submenuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="ml-4"
                  >
                    {renderSubmenuItems(subItem.submenu, currentPath)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to={subItem.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                isActivePath(subItem.path)
                  ? 'bg-gray-800/50 text-blue-400'
                  : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
              }`}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-current mr-3"
                animate={isActivePath(subItem.path) ?
                  { scale: [1, 1.5, 1], opacity: [1, 0.8, 1] } :
                  { scale: 1, opacity: 1 }
                }
                transition={{
                  repeat: isActivePath(subItem.path) ? Infinity : 0,
                  duration: 2
                }}
              />
              {subItem.title}
            </Link>
          )}
        </motion.div>
      );
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isExpanded && windowWidth < 1024 && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button */}
      <motion.button 
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700 transition-colors"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiMenu className="h-6 w-6" />
      </motion.button>

      {/* Sidebar */}
      <motion.div
        className="fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 overflow-hidden z-30 shadow-xl flex flex-col lg:relative"
        variants={sidebarVariants}
        initial={windowWidth < 1024 ? { x: '-100%' } : "expanded"}
        animate={windowWidth < 1024 
          ? isExpanded 
            ? mobileVariants.open 
            : mobileVariants.closed
          : isExpanded 
            ? sidebarVariants.expanded 
            : sidebarVariants.collapsed
        }
      >
        {/* Header with subtle animation */}
        <motion.div 
          className="flex items-center justify-between p-4 border-b border-gray-700/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="flex items-center gap-3"
            variants={itemVariants}
            initial="collapsed"
            animate={isExpanded ? 'expanded' : 'collapsed'}
          >
            <motion.div 
              className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              A
            </motion.div>
            {isExpanded && (
              <motion.h1 
                className="text-xl font-bold text-white"
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
              >
                Admin Panel
              </motion.h1>
            )}
          </motion.div>
          <motion.button 
            onClick={toggleSidebar} 
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800/50"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            variants={iconVariants}
            animate={isExpanded ? 'expanded' : 'collapsed'}
          >
            {isExpanded ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </motion.button>
        </motion.div>
        
        {/* Navigation with staggered animation */}
        <motion.div 
          className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item, index) => (
              <motion.div 
                key={item.title} 
                className="mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                {/* Main menu item */}
                {item.submenu ? (
                  <motion.button
                    onClick={() => toggleSubmenu(index.toString())}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-md transition-colors duration-200 ${
                      isActiveParent(item) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    variants={isActiveParent(item) ? glowVariants : {}}
                    animate={isActiveParent(item) ? "active" : "inactive"}
                  >
                    <div className="flex items-center">
                      <motion.span 
                        className="text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {item.icon}
                      </motion.span>
                      {isExpanded && (
                        <motion.span 
                          className="ml-4 font-medium"
                          variants={itemVariants}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <motion.div
                        variants={itemVariants}
                        className="transform transition-transform duration-200"
                      >
                        <motion.div
                          animate={{ rotate: activeSubmenus.includes(index.toString()) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronRight className="h-4 w-4" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.button>
                ) : (
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    variants={isActivePath(item.path) ? glowVariants : {}}
                    animate={isActivePath(item.path) ? "active" : "inactive"}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-3 rounded-md transition-colors duration-200 ${
                        isActivePath(item.path) 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <motion.span 
                        className="text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {item.icon}
                      </motion.span>
                      {isExpanded && (
                        <motion.span 
                          className="ml-4 font-medium"
                          variants={itemVariants}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                )}
                
                {/* Submenu with enhanced animation */}
                {item.submenu && isExpanded && (
                  <AnimatePresence>
                    {activeSubmenus.includes(index.toString()) && (
                      <motion.div
                        variants={submenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="overflow-hidden ml-8 mt-1"
                      >
                        {renderSubmenuItems(item.submenu, index.toString())}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </nav>
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          className="border-t border-gray-700/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button 
            className="w-full flex items-center px-3 py-3 rounded-md text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
            onClick={() => {
              // Handle logout logic here
              console.log('Logging out...');
            }}
            whileHover={{ x: 3, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span 
              className="text-xl"
              whileHover={{ rotate: 15 }}
            >
              <FiLogOut />
            </motion.span>
            {isExpanded && (
              <motion.span 
                className="ml-4 font-medium"
                variants={itemVariants}
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminSidebar; 