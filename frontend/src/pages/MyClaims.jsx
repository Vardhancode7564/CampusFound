import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import API_BASE_URL from '../config/api';

const MyClaims = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const fetchMyClaims = async () => {
    try {
      const token = localStorage.getItem('userToken');
      console.log('Fetching claims with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_BASE_URL}/api/claims/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Claims API response status:', response.status);
      const data = await response.json();
      console.log('Claims data:', data);
      
      if (response.ok) {
        setClaims(data.claims || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch claims');
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredClaims = claims.filter(claim => {
    // Filter out claims where itemId was not populated or is null
    if (!claim.itemId || !claim.itemId._id) return false;
    if (filter === 'all') return true
    return claim.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Claims</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchMyClaims();
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Claims</h1>
        <p className="text-gray-600">Track your item claim requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({claims.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved ({claims.filter(c => c.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected ({claims.filter(c => c.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length > 0 ? (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div key={claim._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Item Image */}
                <div className="md:w-48 flex-shrink-0">
                  <Link to={`/items/${claim.itemId._id}`}>
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 h-32 md:h-full">
                      {claim.itemId.imageURL ? (
                        <img
                          src={claim.itemId.imageURL}
                          alt={claim.itemId.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ClipboardList size={48} />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Claim Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link 
                        to={`/items/${claim.itemId._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {claim.itemId.title}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          claim.itemId.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {claim.itemId.type.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{claim.itemId.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Claimed on {format(new Date(claim.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Your Message:</p>
                    <p className="text-sm text-gray-600">{claim.message}</p>
                  </div>

                  {claim.verificationDetails && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Owner's Response:</p>
                          <p className="text-sm text-blue-800">{claim.verificationDetails}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {claim.status === 'approved' && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900">
                        🎉 Claim Approved! Please contact the item owner to arrange pickup.
                      </p>
                    </div>
                  )}

                  {claim.status === 'rejected' && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-900">
                        Claim was not approved. The item owner may need additional verification.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No claims yet</h3>
          <p className="text-gray-600 mb-6">Browse items and submit a claim when you find yours</p>
          <Link to="/dashboard" className="btn-primary">
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No claims match the selected filter</p>
        </div>
      )}
    </div>
  )
}

export default MyClaims
