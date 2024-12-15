# HHPW Technical Documentation

## Table of Contents
1. [Core Components](#core-components)
2. [Pages and Routing](#pages-and-routing)
3. [State Management](#state-management)
4. [Utility Functions](#utility-functions)
5. [API Integration](#api-integration)
6. [Styles and Theming](#styles-and-theming)
7. [Forms and Validation](#forms-and-validation)
8. [Event Handling](#event-handling)
9. [Authentication](#authentication)
10. [Development Workflow](#development-workflow)

## Core Components

### Navigation (`components/navbar.js`)
The main navigation component that handles routing and user session management.

**Component Structure:**
```javascript
navBar(user)
// Main navigation component that renders the top navigation bar
// Parameters:
// - user: Object containing user information (displayName, etc.)
```

**Key Features:**
1. Responsive Navigation
   - Collapsible menu for mobile devices
   - Bootstrap-based layout
   - Fixed-top positioning

2. Navigation Items
   - Dashboard (Home)
   - View Orders
   - Create Order
   - Revenue
   - User welcome message
   - Logout button

**Methods:**
```javascript
setActiveLink(clickedId)
// Manages active state of navigation links
// Parameters:
// - clickedId: String - ID of the clicked navigation item

showAdminHome(e)
// Event handler for logo and home link clicks
// - Updates URL hash to 'admin-home'
// - Sets active state
// - Renders admin dashboard
```

**URL Hash Navigation:**
- Automatically sets active state based on URL hash
- Updates URL hash on navigation item clicks
- Defaults to 'admin-home' when no hash is present

**Event Handling:**
- Click events for all navigation links
- Special handling for logo and home links
- Dropdown menu support
- Mobile menu toggle support

### Buttons (`components/buttons/`)
Reusable button components with consistent styling and behavior.

## Pages and Routing

### Order Management Pages

#### Orders Page (`pages/ordersPage.js`)
Main orders dashboard displaying all orders with filtering and search capabilities.

**Key Functions:**
```javascript
showOrders(array, defaultFilter = 'all')
// Renders the orders view with:
// - Search functionality
// - Status filtering (all/open/closed)
// - Order cards grid

updateOrderVisibility(searchTerm = '', statusFilter = 'all')
// Updates order card visibility based on:
// - Search term matching
// - Status filter selection

setupSearch(searchInput)
// Initializes search functionality with real-time filtering

setupFilterButtons()
// Sets up order status filter buttons
```

#### Create Order Page (`pages/createOrderPage.js`)
Handles new order creation with form validation and submission.

**Key Functions:**
```javascript
// Form submission handler
handleOrderSubmit(e)

// Order type selection handler
handleOrderTypeChange(type)
```

#### Close Order Page (`pages/closeOrderPage.js`)
Manages order completion and payment processing.

**Key Functions:**
```javascript
// Payment processing
processPayment(orderDetails)

// Order status update
updateOrderStatus(orderId, status)
```

### Revenue Management (`pages/revenuePage.js`)
Comprehensive revenue tracking and reporting system.

**Key Components:**

1. **Today's Statistics**
   ```javascript
   getTodayStats(orders)
   // Calculates and returns:
   // - Today's order count
   // - Today's revenue
   // - Open order count
   ```

2. **Period Statistics**
   ```javascript
   calculateRevenue(orders, startDate, endDate)
   // Calculates revenue metrics for a date range:
   // - Total revenue
   // - Total tips
   // - Order count
   // - Average order value
   ```

3. **Data Visualization**
   - Revenue breakdown by payment type
   - Order type distribution
   - Period comparisons
   - Real-time updates

**Helper Functions:**
```javascript
formatCurrency(amount)
// Formats numbers as currency strings
// Example: 1000 -> "$1,000.00"

validateDateRange(startDate, endDate)
// Validates date range selections:
// - Both dates must be provided
// - Start date must be before end date
// - End date cannot be in future

renderBreakdownList(data, formatValue, type)
// Renders breakdown statistics for:
// - Payment methods
// - Order types
// Parameters:
// - data: Object containing breakdown data
// - formatValue: Function to format values
// - type: 'amount' or 'count'
```

**State Management:**
```javascript
updateStats(revenueData)
// Updates UI with new revenue data
// Handles loading states and animations

renderLoadingState()
// Shows loading spinner during data fetch

renderErrorState(error)
// Displays error messages with retry option
```

**Date Filtering:**
- Custom date range selection
- Real-time data updates
- Validation and error handling
- Default to last 7 days

**UI Components:**
1. Revenue Overview Cards
   - Today's statistics
   - Period statistics
   - Comparison metrics

2. Breakdown Sections
   - Payment type distribution
   - Order type analysis
   - Trend visualization

3. Interactive Elements
   - Date range picker
   - Filter controls
   - Refresh functionality

**Error Handling:**
- Input validation
- Data loading errors
- Authentication checks
- Network failure recovery

### Admin Dashboard (`pages/adminPage.js`)
Comprehensive administrative interface for system management and monitoring.

**Core Functions:**
```javascript
showAdminDashboard(user)
// Main dashboard rendering function
// Parameters:
// - user: Firebase user object with authentication details

adminPageEvents(user)
// Sets up event handlers for all dashboard interactions
// Parameters:
// - user: Firebase user object for action authorization
```

**Dashboard Components:**

1. **Quick Stats Section**
   ```javascript
   getTodayStats(orders)
   // Displays real-time metrics:
   // - Today's order count
   // - Open orders
   // - Today's revenue
   // - Total unique customers

   refreshStats()
   // Updates dashboard statistics
   // - Shows loading states
   // - Handles errors
   // - Displays success/failure messages
   ```

2. **Order Management Panel**
   - View all orders
   - Create new orders
   - Access closed orders
   - Real-time order count

3. **Admin Controls Panel**
   - Revenue reports access
   - Menu management
   - User management
   - System settings

**Auto-Refresh Functionality:**
```javascript
// Auto-refresh setup
setInterval(() => {
  refreshStats();
}, 300000); // 5-minute refresh
```

**Event Handlers:**
```javascript
// View Orders Handler
'#admin-view-orders' => showOrders(orders, 'all')

// Create Order Handler
'#admin-create-order' => createOrderPage(user)

// Closed Orders Handler
'#admin-closed-orders' => showOrders(orders, 'closed')

// Revenue View Handler
'#admin-view-revenue' => revenuePage()
```

**UI Components:**

1. **Welcome Section**
   - User greeting
   - System name
   - Current date

2. **Statistics Cards**
   - Icon-based representation
   - Real-time updates
   - Loading states
   - Error handling

3. **Action Buttons**
   - Clear categorization
   - Icon integration
   - Status indicators
   - Access control

4. **Recent Activity Feed**
   - Real-time updates
   - Status messages
   - Error notifications
   - Timestamp tracking

**Error Handling:**
```javascript
try {
  // Dashboard operations
} catch (error) {
  // Error display with:
  // - Descriptive message
  // - Refresh option
  // - Support contact
}
```

**State Management:**
- User authentication state
- Order statistics
- Activity tracking
- Auto-refresh lifecycle

**Security Features:**
- User authentication check
- Admin access validation
- Secure API calls
- Protected routes

## State Management

### Firebase Integration
- Real-time database updates
- User authentication state
- Data persistence

**Key Methods:**
```javascript
// Database operations
getOrders()
createOrder(orderData)
updateOrder(orderId, data)
deleteOrder(orderId)
```

## Utility Functions

### DOM Manipulation (`utils/renderToDom.js`)
```javascript
renderToDOM(selector, content)
// Safely updates DOM elements with new content
```

### Data Clearing (`utils/clearDom.js`)
```javascript
clearDom()
// Cleans up DOM elements before new renders
```

## Forms and Validation

### Order Forms
Located in `forms/` directory, handling:
- Customer information
- Order details
- Payment information

**Validation Rules:**
- Required fields
- Phone number format
- Email validation
- Payment details verification

## Event Handling

### Order Events (`events/`)
Manages all order-related events:
- Creation
- Updates
- Deletion
- Status changes

**Event Handlers:**
```javascript
// Order lifecycle events
onOrderCreate(orderData)
onOrderUpdate(orderId, updates)
onOrderDelete(orderId)
```

## Styles and Theming

### SCSS Architecture
The application uses a modular SCSS architecture for maintainable and scalable styling.

### Core Style Files

#### Variables (`styles/_variables.scss`)
Global style configuration.
```scss
// Color palette
$primary-color: #...
$secondary-color: #...
$accent-color: #...

// Typography
$font-family-base: ...
$font-size-base: ...

// Spacing
$spacing-unit: ...
$container-padding: ...

// Breakpoints
$breakpoint-sm: ...
$breakpoint-md: ...
$breakpoint-lg: ...
```

#### Main Styles (`styles/main.scss`)
Primary stylesheet that imports and coordinates all other style modules.
```scss
// Import order:
1. Variables
2. Vendor styles
3. Base styles
4. Components
5. Page-specific styles
6. Utilities
```

### Component Styles

#### Admin Page (`styles/_adminPage.scss`)
Styles for the administrative interface.
```scss
// Dashboard layout
.admin-dashboard { ... }

// Stats cards
.stats-card { ... }

// Action buttons
.admin-action-btn { ... }
```

#### Orders Page (`styles/_orders.scss`)
Order management interface styling.
```scss
// Order cards
.order-card { ... }

// Status indicators
.status-indicator { ... }

// Search and filters
.order-filters { ... }
```

#### Revenue Page (`styles/_revenue.scss`)
Revenue tracking and reporting styles.
```scss
// Revenue charts
.revenue-chart { ... }

// Stats displays
.revenue-stats { ... }

// Date filters
.date-range-picker { ... }
```

#### Navigation (`styles/_navbar.scss`)
Navigation component styling.
```scss
// Main navigation
.main-nav { ... }

// Responsive menu
.nav-menu { ... }

// User controls
.user-controls { ... }
```

#### Login Page (`styles/_loginPage.scss`)
Authentication interface styling.
```scss
// Login form
.login-form { ... }

// Authentication buttons
.auth-buttons { ... }

// Error states
.auth-error { ... }
```

### Responsive Design
The application uses a mobile-first approach with responsive breakpoints:
```scss
// Mobile (default)
.component { ... }

// Tablet
@media (min-width: $breakpoint-md) {
  .component { ... }
}

// Desktop
@media (min-width: $breakpoint-lg) {
  .component { ... }
}
```

### Theme System
Supports light and dark mode with CSS custom properties:
```scss
:root {
  // Light theme (default)
  --background-color: #fff;
  --text-color: #333;
}

[data-theme="dark"] {
  // Dark theme
  --background-color: #333;
  --text-color: #fff;
}
```

### Utility Classes
Common utility classes for spacing, typography, and layout:
```scss
// Spacing
.m-{size} { margin: $spacing-unit * $size; }
.p-{size} { padding: $spacing-unit * $size; }

// Typography
.text-primary { color: $primary-color; }
.text-large { font-size: $font-size-large; }

// Layout
.d-flex { display: flex; }
.grid { display: grid; }
```

## Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_domain
   ```
4. Start development server:
   ```bash
   npm start
   ```

### Build Process
```bash
npm run build
# Outputs production build to /dist
```

### Code Style
The project uses ESLint with the Airbnb base configuration (`eslint-config-airbnb-base`).

**Airbnb Style Guide:**
The Airbnb JavaScript Style Guide is one of the most popular coding style guides in the JavaScript community. It provides a set of rules and best practices for writing clean, maintainable JavaScript code.

**Key Style Rules:**
```javascript
// 1. Use const for all references; avoid using var
const myConstant = 'value';
let myVariable = 'changeable';  // use let if reassignment is needed

// 2. Use camelCase for variables and functions
function calculateTotal() { }
const userProfile = { };

// 3. Use PascalCase for classes and constructors
class UserProfile { }

// 4. Use descriptive variable names
const firstName = 'John';  // good
const fn = 'John';        // bad

// 5. Use single quotes for strings
const name = 'John Doe';

// 6. Add spaces inside curly braces
const obj = { key: 'value' };

// 7. Always use === instead of ==
if (value === 'test') { }
```

**Project-Specific ESLint Configuration:**
```json
{
  "extends": "airbnb-base",
  "rules": {
    "no-console": [1, { "allow": ["error", "warn"] }],
    "comma-dangle": ["error", "only-multiline"],
    "no-debugger": 1,
    "class-methods-use-this": 0,
    "linebreak-style": 0,
    "max-len": [1,600,2],
    "no-plusplus": [2, { "allowForLoopAfterthoughts": true }]
  }
}
```

**Benefits of Using Airbnb Style Guide:**
1. Consistency across the codebase
2. Industry-standard practices
3. Improved code readability
4. Better team collaboration
5. Reduced code review friction

**How to Follow the Style Guide:**
1. Install ESLint extension in your code editor
2. Enable auto-fix on save
3. Review ESLint warnings and errors
4. Follow the style guide documentation

## Version Control

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`

### Commit Guidelines
- Conventional commits
- Descriptive messages
- Reference issues/tickets

## Testing

### Unit Tests
Run tests:
```bash
npm test
```

### E2E Tests
Run end-to-end tests:
```bash
npm run test:e2e
```

## Support and Contact
Development Team:
- Alyssa Cleland - Frontend Lead
- Landon Borrego - Backend Lead
- Omer Ozzy Akben - Full Stack Developer
- Mike McGee - DevOps Engineer

---

Last Updated: December 2023
Version: 1.0.0

## API Integration

### Orders API (`api/orders.js`)
Handles all order-related API operations.

**Key Methods:**
```javascript
getOrders(uid)
// Fetches all orders for a user
// Parameters:
// - uid: User ID for filtering orders

createOrder(orderData)
// Creates a new order
// Parameters:
// - orderData: Order details object

updateOrder(firebaseKey, orderData)
// Updates existing order
// Parameters:
// - firebaseKey: Order identifier
// - orderData: Updated order details

deleteOrder(firebaseKey)
// Deletes an order
// Parameters:
// - firebaseKey: Order identifier
```

### Order Items API (`api/orderItems.js`)
Manages individual items within orders.

**Methods:**
```javascript
getOrderItems(orderId)
// Fetches items for specific order
// Parameters:
// - orderId: Order identifier

createOrderItem(itemData)
// Adds new item to order
// Parameters:
// - itemData: Item details

updateOrderItem(firebaseKey, itemData)
// Updates existing order item
// Parameters:
// - firebaseKey: Item identifier
// - itemData: Updated item details

deleteOrderItem(firebaseKey)
// Removes item from order
// Parameters:
// - firebaseKey: Item identifier
```

### Menu API (`api/menu.js`)
Handles menu item management.

### Users API (`api/users.js`)
Manages user data and authentication.

## Event Handling

### Navigation Events (`events/navigationEvents.js`)
Handles all navigation-related events.

**Event Handlers:**
```javascript
// Navigation event setup
setupNavigationEvents()
// - Logo click handling
// - Menu navigation
// - Route changes
// - Authentication state changes
```

### DOM Events (`events/domEvents.js`)
Manages interactive elements and UI events.

**Key Features:**
```javascript
setupDomEvents()
// Sets up handlers for:
// - Button clicks
// - Form submissions
// - Modal interactions
// - Dynamic content updates
```

### Form Events (`events/formEvents.js`)
Handles form submissions and validation.

**Event Handlers:**
```javascript
setupFormEvents()
// Manages:
// - Order form submission
// - Payment processing
// - Input validation
// - Error handling
```

## Utility Functions

### Helper Functions (`utils/helperFunctions.js`)
Common utility functions used throughout the application.

**Key Functions:**
```javascript
formatCurrency(amount)
// Currency formatting

calculateRevenue(orders, startDate, endDate)
// Revenue calculations

getTodayStats(orders)
// Daily statistics

getUniqueCustomers(orders)
// Customer tracking
```

### Authentication (`utils/auth.js`)
Firebase authentication integration.

**Methods:**
```javascript
checkLoginStatus()
// Checks user authentication state

signIn()
// Handles user sign-in

signOut()
// Handles user sign-out
```

### View Director (`utils/viewDirector.js`)
Manages view routing and rendering.

**Functions:**
```javascript
viewDirector()
// Controls view rendering based on:
// - Authentication state
// - Current route
// - User permissions
```

### Client Setup (`utils/client.js`)
Firebase client configuration and setup.

**Configuration:**
```javascript
client
// Firebase client instance with:
// - API key
// - Auth domain
// - Database URL
// - Project settings
```

## Project Configuration

### Webpack Setup (`webpack.config.js`)
Webpack configuration for building and bundling the application.

**Key Features:**
```javascript
module.exports = {
  // Entry point
  entry: './startApp.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // Development server
  devServer: {
    hot: true,
    port: 8080
  },

  // Loaders and plugins
  module: {
    rules: [
      // JavaScript/JSX
      // SCSS
      // Assets
    ]
  }
}
```

### Package Configuration (`package.json`)
Project dependencies and scripts.

**Key Scripts:**
```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest"
  }
}
```

**Dependencies:**
- Firebase 8.2.0
- Bootstrap 5.1.0
- FontAwesome 5.14.0
- Other development tools

### Environment Configuration (`.env`)
Environment variables for configuration.
```
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
DATABASE_URL=xxx
PROJECT_ID=xxx
```

### ESLint Configuration (`.eslintrc`)
Code style and quality rules.
```json
{
  "extends": "airbnb-base",
  "rules": {
    // Custom rules
  }
}
```

### Application Entry (`startApp.js`)
Application initialization and setup.
```javascript
// Firebase initialization
// Route setup
// Event listeners
// Initial render
```

## Contributing

### Issue Template (`ISSUE_TEMPLATE.md`)
Template for creating new issues:
- Bug reports
- Feature requests
- Documentation updates

### Pull Request Template (`PULL_REQUEST_TEMPLATE.md`)
Template for submitting pull requests:
- Description of changes
- Related issues
- Testing checklist
- Review requirements

## Project Structure

### Root Directory
```
hhpw-team-elpheba/
├── api/            # API endpoints
├── assets/         # Static assets
├── components/     # UI components
├── docs/          # Documentation
├── events/        # Event handlers
├── forms/         # Form components
├── pages/         # Page components
├── public/        # Public assets
├── shared/        # Shared utilities
├── styles/        # SCSS styles
├── utils/         # Utility functions
├── .env           # Environment variables
├── .eslintrc      # ESLint config
├── package.json   # Dependencies
└── webpack.config.js # Build config
```

### Key Directories

#### Public Directory (`public/`)
Static files served directly:
- HTML templates
- Images
- Fonts
- Favicons

#### Assets Directory (`assets/`)
Source assets:
- Images
- Icons
- Media files

#### Shared Directory (`shared/`)
Common utilities and components:
- Constants
- Types
- Shared components
