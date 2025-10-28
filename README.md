# Labour Mobility Management System

A comprehensive full-stack web application for managing labour mobility processes including candidate registration, training, vetting, and placement.

## 🚀 Features

### Core Modules
- **Authentication & Authorization**: JWT-based auth with role-based access control (RBAC)
- **User Management**: Multi-role system (Admin, Trainer, Candidate, Agent, Broker, Recruiter)
- **Candidate Management**: Registration, document uploads, progress tracking
- **Training System**: Course creation, enrollment, attendance tracking, assessments
- **Vetting Process**: Medical, police, interview, and language test management
- **Placement System**: Job matching, interview scheduling, visa processing
- **Dashboard & Analytics**: Role-based dashboards with charts and reports
- **Activity Logging**: Comprehensive audit trail for all actions

### Technical Features
- **Frontend**: React.js + Vite, TailwindCSS, React Router, Zustand state management
- **Backend**: Node.js + Express, Prisma ORM, MariaDB, JWT authentication
- **Security**: Bcrypt password hashing, rate limiting, CORS protection
- **API Documentation**: Swagger/OpenAPI integration
- **File Uploads**: Multer for document management
- **Validation**: Joi schema validation

## 🏗️ Architecture

```
Labour Mobility/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & JWT configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema & migrations
│   └── uploads/           # File storage
├── frontend/              # React.js SPA
│   ├── src/
│   │   ├── api/           # API client configuration
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── layouts/       # Page layouts
│   │   ├── store/         # Zustand state management
│   │   └── utils/         # Utility functions
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MariaDB with Prisma ORM
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Joi
- **File Uploads**: Multer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Charts**: Recharts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MariaDB 10.6+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Backend will be available at `http://localhost:5000`
   API Documentation at `http://localhost:5000/api-docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All reports and analytics

### Trainer
- Course management
- Candidate enrollment
- Attendance tracking
- Assessment management

### Candidate
- Profile management
- Document uploads
- Progress tracking
- Application status

### Agent
- Candidate registration
- Document verification
- Placement coordination

### Broker
- Candidate referrals
- Commission tracking
- Referral management

### Recruiter (Employer)
- Candidate shortlisting
- Job posting
- Interview scheduling
- Placement management

## 🔐 Default Credentials

After running the seed script, you can login with:

- **Admin**: `admin@labourmobility.com` / `admin123`
- **Trainer**: `trainer@labourmobility.com` / `trainer123`

## 📊 Database Schema

### Core Tables
- **Users**: User accounts with role-based access
- **Roles**: Permission definitions
- **Sessions**: JWT refresh token management
- **ActivityLogs**: System audit trail

### Future Tables (Phase 3+)
- **Candidates**: Candidate profiles and documents
- **Courses**: Training programs and schedules
- **Enrollments**: Course registrations
- **Placements**: Job placements and tracking
- **Vetting**: Medical, police, and interview records

## 🚀 Development Workflow

### Phase 1: Backend Foundation ✅
- [x] Node.js + Express setup
- [x] Prisma ORM with MariaDB
- [x] JWT authentication system
- [x] Role-based access control
- [x] Swagger API documentation

### Phase 2: Frontend Foundation ✅
- [x] React + Vite setup
- [x] TailwindCSS styling
- [x] React Router navigation
- [x] Zustand state management
- [x] Protected routes

### Phase 3: Core Modules (Next)
- [ ] Candidate Management
- [ ] Course & Training System
- [ ] Vetting Process
- [ ] Placement System
- [ ] Agent/Broker Management

### Phase 4: Advanced Features
- [ ] Dashboard Analytics
- [ ] Report Generation
- [ ] File Management
- [ ] Notification System

### Phase 5: Deployment
- [ ] Docker Configuration
- [ ] Nginx Setup
- [ ] SSL Certificates
- [ ] Production Deployment

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password

### Health Check
- `GET /health` - System health status

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/labour_mobility_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Labour Mobility Management System
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Start backend: `npm start`
3. Configure reverse proxy (Nginx)
4. Setup SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api-docs`

---

**Built with ❤️ for Labour Mobility Management**
