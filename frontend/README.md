# CampusFound Frontend

React + Vite + TailwindCSS frontend for CampusFound platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
├── context/         # React Context (Auth)
├── pages/           # Page components
├── utils/           # Utility functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🎨 Components

- **Navbar** - Navigation header with auth state
- **Footer** - Site footer with links
- **ItemCard** - Display item in grid
- **LoadingSpinner** - Loading indicator

## 📄 Pages

- **Home** - Landing page
- **Login** - User login
- **Register** - User registration
- **Dashboard** - Browse all items
- **ItemDetails** - Single item view
- **ReportItem** - Create/edit item
- **MyPosts** - User's posted items
- **MyClaims** - User's claims
- **Profile** - User profile management

## 🔧 Configuration

The frontend is configured to proxy API requests to `https://campusfound.onrender.com` in development mode via `vite.config.js`.

For production, update the API base URL in `src/utils/api.js`.

## 🎨 Styling

Using TailwindCSS with custom utility classes defined in `src/index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outline button style
- `.input-field` - Input field style
- `.card` - Card container style

## 📱 Responsive Design

All components and pages are fully responsive using TailwindCSS breakpoints:

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🚀 Build

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment.
