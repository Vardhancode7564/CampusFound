import { Link } from 'react-router-dom'
import { Search, Upload, Bell, Shield } from 'lucide-react'

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Lost Something? We've Got You Covered!
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-indigo-100">
              The easiest way to find and return lost items on RGUKT SKLM campus
            </p>
            <p className="text-lg mb-8 text-indigo-200">
              Exclusive for RGUKT SKLM Students
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/dashboard" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Browse Items
              </Link>
              <Link to="/contact" className="bg-indigo-700 hover:bg-indigo-900 text-white font-semibold py-3 px-8 rounded-lg border-2 border-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CampusFound Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, fast, and effective way to reunite lost items with their owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Items</h3>
              <p className="text-gray-600">
                Found or lost something? Create a report with photos and details
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">
                Browse items by category, location, or date to find what you need
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Notified</h3>
              <p className="text-gray-600">
                Receive updates when items matching your description are found
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Claims</h3>
              <p className="text-gray-600">
                Verify ownership through secure in-app messaging and verification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-lg text-gray-600">Items Recovered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-lg text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-lg text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Lost Items?
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join our community and help make campus a better place
          </p>
          <Link to="/contact" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
