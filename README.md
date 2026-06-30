# 🏠 Rent Management Web App

A comprehensive full-stack web application for managing rental properties, tenants, and payments. Built with React, Node.js/Express, and SQLite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **Dashboard**: View key statistics and recent payment activity at a glance
- **Property Management**: Add, edit, delete, and track rental properties
- **Tenant Management**: Manage tenant information and lease agreements
- **Payment Tracking**: Record and monitor rent payments with multiple payment methods
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Modern CSS** - Responsive styling with CSS custom properties

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Better-SQLite3** - Database driver
- **SQLite** - Embedded database

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## 🛠️ Installation

1. **Clone or download the repository**
   ```bash
   cd rent-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🎯 Usage

### Development Mode

To run both the frontend and backend servers concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Individual Services

Run only the backend server:
```bash
npm run server
```

Run only the frontend:
```bash
npm run client
```

### Production Build

Build the frontend for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
rent-management-app/
├── server/
│   ├── index.js              # Express server and API routes
│   ├── database.js           # Database initialization and schema
│   └── rentmanagement.db     # SQLite database (created on first run)
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx     # Dashboard with stats and recent payments
│   │   ├── Properties.jsx    # Property management component
│   │   ├── Tenants.jsx       # Tenant management component
│   │   └── Payments.jsx      # Payment tracking component
│   ├── App.jsx               # Main app component with routing
│   ├── App.css               # App-specific styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🗄️ Database Schema

### Properties Table
- `id` - Unique identifier
- `name` - Property name
- `address` - Property address
- `type` - Property type (Apartment, House, Studio, Condo)
- `rent_amount` - Monthly rent amount
- `created_at` - Creation timestamp

### Tenants Table
- `id` - Unique identifier
- `name` - Tenant name
- `email` - Tenant email (unique)
- `phone` - Contact phone number
- `property_id` - Associated property (foreign key)
- `lease_start` - Lease start date
- `lease_end` - Lease end date
- `created_at` - Creation timestamp

### Payments Table
- `id` - Unique identifier
- `tenant_id` - Associated tenant (foreign key)
- `property_id` - Associated property (foreign key)
- `amount` - Payment amount
- `payment_date` - Date of payment
- `payment_method` - Method of payment (Bank Transfer, Check, Cash, etc.)
- `status` - Payment status (completed, pending, failed)
- `notes` - Optional notes
- `created_at` - Creation timestamp

## 🔌 API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get single tenant
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 💡 Sample Data

The application comes with sample data including:
- 3 sample properties
- 2 sample tenants
- 3 sample payments

This data is automatically created when the database is initialized on first run.

## 🎨 Features in Detail

### Dashboard
- Total properties count
- Total tenants count
- Total revenue calculation
- Recent payments table with full details

### Property Management
- Create new properties with name, address, type, and rent amount
- Edit existing property information
- Delete properties (with confirmation)
- View tenant count and total revenue per property

### Tenant Management
- Add tenants with contact information
- Assign tenants to properties
- Track lease start and end dates
- Edit and delete tenant records

### Payment Tracking
- Record payments with tenant and property association
- Support multiple payment methods
- Track payment status (completed, pending, failed)
- Add optional notes to payments
- View payment history with filtering

## 🔒 Security Notes

This is a demonstration application. For production use, consider implementing:
- User authentication and authorization
- Input validation and sanitization
- SQL injection prevention (using prepared statements - already implemented)
- HTTPS for secure communication
- Environment variables for configuration
- Rate limiting
- CORS configuration
- Data backup strategies

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Port already in use
If ports 3000 or 5000 are already in use, modify the port numbers in:
- `vite.config.js` (frontend port)
- `server/index.js` (backend port)

### Database issues
If you encounter database errors, delete the `rentmanagement.db` file and restart the server to recreate it.

### Dependencies not installing
Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

## 📧 Support

For questions or issues, please open an issue on the repository.

---

**Built with ❤️ using React and Node.js**
