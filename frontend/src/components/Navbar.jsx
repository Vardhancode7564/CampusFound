import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, User, LogOut, FileText, ClipboardList, Plus } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, admin, userLogout, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleUserLogout = () => {
    userLogout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleAdminLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">CampusFound</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Browse Items
            </Link>
            
            {user ? (
              /* User Menu */
              <>
                <Link to="/report" className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  <Plus size={18} />
                  <span>Report Item</span>
                </Link>
                <Link to="/my-posts" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Posts
                </Link>
                <Link to="/my-claims" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Claims
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-indigo-600">
                  <div className="bg-indigo-600 p-1.5 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button 
                  onClick={handleUserLogout} 
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : admin ? (
              /* Admin Menu */
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Admin Dashboard
                </Link>
                <div className="flex items-center space-x-2 text-gray-700 px-3 py-2 rounded-md text-sm font-medium border border-gray-300">
                  <div className="bg-indigo-600 p-1.5 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{admin.username}</span>
                </div>
                <button 
                  onClick={handleAdminLogout} 
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* Public Menu */
              <>
                <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/admin/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Admin Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Browse Items
            </Link>
            
            {user ? (
              /* User Mobile Menu */
              <>
                <Link to="/report" onClick={closeMobileMenu} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  <Plus size={18} />
                  <span>Report Item</span>
                </Link>
                <Link to="/my-posts" onClick={closeMobileMenu} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  <FileText size={18} />
                  <span>My Posts</span>
                </Link>
                <Link to="/my-claims" onClick={closeMobileMenu} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  <ClipboardList size={18} />
                  <span>My Claims</span>
                </Link>
                <Link to="/profile" onClick={closeMobileMenu} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Logged in as: <span className="font-medium">{user.name}</span>
                </div>
                <button onClick={handleUserLogout} className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : admin ? (
              /* Admin Mobile Menu */
              <>
                <Link to="/admin/dashboard" onClick={closeMobileMenu} className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  <User size={18} />
                  <span>Admin Dashboard</span>
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Logged in as: <span className="font-medium">{admin.username}</span>
                </div>
                <button onClick={handleAdminLogout} className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              /* Public Mobile Menu */
              <>
                <Link to="/contact" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Contact
                </Link>
                <Link to="/login" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/admin/login" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 text-center">
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
