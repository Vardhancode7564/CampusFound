import { Link } from 'react-router-dom'
import { MapPin, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

const ItemCard = ({ item }) => {
  const getTypeColor = (type) => {
    return type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link to={`/items/${item._id}`} className="card hover:shadow-lg transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 h-48">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
            {item.type.toUpperCase()}
          </span>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
            {item.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {item.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
            {item.category}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{format(new Date(item.date), 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {item.postedBy && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <User size={14} />
            <span>by {item.postedBy.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ItemCard
