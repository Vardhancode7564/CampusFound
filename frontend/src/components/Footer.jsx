import { Link } from 'react-router-dom'
import { Mail, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">CampusFound</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your trusted platform for finding and returning lost items on campus. 
              Building a connected and responsible student community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-primary-400 transition-colors">
                  Report Item
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="hover:text-primary-400 transition-colors">
                  My Posts
                </Link>
              </li>
              <li>
                <Link to="/my-claims" className="hover:text-primary-400 transition-colors">
                  My Claims
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <a href="mailto:support@campusfound.com" className="hover:text-primary-400 transition-colors">
                  support@campusfound.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Github size={16} />
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  GitHub
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Linkedin size={16} />
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CampusFound. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
