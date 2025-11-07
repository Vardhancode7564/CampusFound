import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, CreditCard, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await fetch('https://campusfound.onrender.com/api/user/items', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setItems(data.items || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserItems();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phone: user.phone || ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: '', text: '' });

    const result = await updateUserProfile(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
    }
    
    setUpdateLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and view your reported items</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 w-24 h-24 rounded-full flex items-center justify-center">
            <User className="text-white" size={48} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Edit Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Edit Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Name */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <User className="text-indigo-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Mail className="text-indigo-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              {/* Student ID */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <CreditCard className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Student ID</p>
                  <p className="text-sm font-medium text-gray-900">{user.studentId || 'Not provided'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '2024'}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* My Statistics */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-indigo-600">{items.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Reports</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">{items.filter(i => i.type === 'lost').length}</div>
                <div className="text-sm text-gray-600 mt-1">Lost Items</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{items.filter(i => i.type === 'found').length}</div>
                <div className="text-sm text-gray-600 mt-1">Found Items</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{items.filter(i => i.status === 'active').length}</div>
                <div className="text-sm text-gray-600 mt-1">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
