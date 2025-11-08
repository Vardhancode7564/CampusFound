import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Phone, Mail, Tag, MessageSquare, Clock } from 'lucide-react';
import API_BASE_URL from '../config/api';

const ItemDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [claimMessage, setClaimMessage] = useState('')
  const [submittingClaim, setSubmittingClaim] = useState(false)

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
      const data = await response.json();
      if (response.ok) {
        setItem(data.item);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to claim items');
      navigate('/login');
      return;
    }

    setSubmittingClaim(true);
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch(`${API_BASE_URL}/api/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          message: claimMessage,
          verificationDetails: claimMessage
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Claim submitted successfully! The item owner has been notified via email.');
        setShowClaimModal(false);
        setClaimMessage('');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit claim');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit claim');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const canClaim = user && item.status === 'active'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="relative rounded-lg overflow-hidden bg-gray-100 h-96">
              {item.imageURL ? (
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.type.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                  item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>

            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Tag size={14} />
                <span>{item.category}</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center space-x-1">
                <MapPin size={14} />
                <span>{item.location}</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 flex items-center space-x-1">
                <Clock size={14} />
                <span>Posted {new Date(item.createdAt || item.date).toLocaleDateString()}</span>
              </span>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-3">
              {item.contactInfo?.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Mail size={18} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <a
                      href={`mailto:${item.contactInfo.email}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {item.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}
              
              {item.contactInfo?.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <a
                      href={`tel:${item.contactInfo.phone}`}
                      className="text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      {item.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {!item.contactInfo?.email && !item.contactInfo?.phone && (
                <p className="text-sm text-gray-500 text-center py-4">No contact information available</p>
              )}
            </div>
          </div>

          {/* Claim Button */}
          {canClaim && (
            <button
              onClick={() => setShowClaimModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md flex items-center justify-center space-x-2"
            >
              <MessageSquare size={18} />
              <span>Claim This Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Claim This Item</h3>
            <form onSubmit={handleClaim}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Owner
                </label>
                <textarea
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows="4"
                  placeholder="Describe why this item belongs to you and provide any identifying details..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  disabled={submittingClaim}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  disabled={submittingClaim}
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetails
