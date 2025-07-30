# DreamQuilt

**Creator:** Dorian Gulley

## Description

DreamQuilt is a collaborative platform for creators to weave together fictional universes. Users can post their own creative ideas as "quilts" and invite others to contribute "patches" (story segments) that expand the narrative. The platform features an interactive node-based visualization system that displays story relationships in a tree structure, making it ideal for writers, artists, and fans to expand and enrich stories together.

## Features

### **Core Functionality**

- **User Authentication:** Secure sign up, log in, and profile management with bcrypt password hashing
- **Quilt Creation:** Create stories with titles, descriptions, categories, and tags
- **Interactive Story Visualization:** Tree-structured display of patches using ReactFlow with custom node components
- **Patch System:** Add story segments with rich text content, tags, and parent-child relationships
- **Ownership & Moderation:** Quilt owners can directly publish patches while others submit suggestions for review

### **Advanced Features**

- **Dynamic Tree Layout:** Recursive positioning algorithm for intuitive story progression visualization
- **Patch Suggestions:** Non-owners can submit patch suggestions that require owner approval
- **Rich Text Editor:** ReactQuill integration for formatted patch content with HTML support
- **Tagging System:** Flexible tagging for both quilts and patches using PostgreSQL JSONB
- **Responsive Design:** Mobile-first design with glass morphism effects and modern animations

### **User Experience**

- **Separate Views:** Owner and public quilt views with appropriate permissions and interactions
- **Real-time Navigation:** Dynamic routing between quilt views, patch creation, and user profiles
- **Modern UI:** Sleek design with animated components, smooth transitions, and intuitive interactions
- **Notification System:** Bell icon for pending patch suggestions (ready for implementation)

## Tech Stack

### **Frontend**

- **React.js** with functional components and hooks
- **React Router DOM** for client-side routing
- **ReactFlow** for interactive node-based visualization
- **ReactQuill** for rich text editing
- **React Icons** for UI icons
- **CSS3** with modern features (backdrop-filter, animations, gradients)

### **Backend**

- **Node.js** with Express.js framework
- **PostgreSQL** database with comprehensive schema
- **bcrypt** for password hashing
- **CORS** for cross-origin requests
- **RESTful API** design with proper error handling

### **Database Schema**

- **Users:** Authentication and profile data
- **Quilts:** Story metadata and content
- **Patches:** Story segments with relationships
- **Patch Links:** Parent-child patch relationships
- **Patch Tags:** Flexible tagging system
- **Patch Suggestions:** Moderation system for non-owners
- **Quilt Tags:** Story categorization

## Setup Instructions

### **Prerequisites**

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### **Installation**

1. **Clone the repository:**

   ```bash
   git clone <repo-url>
   cd DreamQuilt
   ```

2. **Set up the database:**

   ```bash
   # Run the SQL script to create tables
   psql -d your_database -f "PG Local.session.sql"
   ```

3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the backend server:**

   ```bash
   cd ../backend
   node server.js
   # Server runs on http://localhost:4000
   ```

6. **Start the frontend development server:**
   ```bash
   cd ../frontend
   npm start
   # App runs on http://localhost:3000
   ```

## API Endpoints

### **Authentication**

- `POST /signup` - User registration
- `POST /login` - User authentication

### **Quilts**

- `GET /quilts` - Fetch all quilts
- `POST /quilts` - Create new quilt
- `GET /quilts/:id` - Fetch specific quilt
- `GET /quilts/:quiltId/patches` - Fetch quilt patches
- `GET /quilts/:quiltId/patches/count` - Get patch count

### **Patches**

- `POST /patches` - Create new patch (owners only)
- `POST /patch-suggestions` - Submit patch suggestion (non-owners)
- `GET /patches/:patchId` - Fetch specific patch
- `GET /patch-suggestions/pending/:userId` - Fetch pending suggestions

## Project Structure

```
DreamQuilt/
├── backend/
│   ├── server.js              # Express server
│   ├── database_structure     # Schema documentation
│   └── utils/                 # Helper functions
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/          # User context
│   │   └── utils/            # Frontend utilities
│   └── public/               # Static assets
└── PG Local.session.sql      # Database setup script
```

## Completed Features ✅

- [x] **User Authentication:** Complete signup/login system with bcrypt
- [x] **Quilt Creation:** Full CRUD operations with categories and tags
- [x] **Patch System:** Rich text editor with parent-child relationships
- [x] **Interactive Visualization:** ReactFlow tree structure with custom nodes
- [x] **Ownership System:** Separate owner/public views with appropriate permissions
- [x] **Patch Suggestions:** Moderation system for non-owners
- [x] **Responsive Design:** Mobile-first with modern UI/UX
- [x] **Database Schema:** Comprehensive PostgreSQL setup with relationships
- [x] **RESTful API:** Complete backend with proper error handling
- [x] **Dynamic Routing:** Client-side routing with React Router
- [x] **Modern Styling:** Glass morphism, animations, and sleek design

## Future Enhancements 🚀

- [ ] **Email Verification:** User email confirmation system
- [ ] **Password Reset:** Secure password recovery functionality
- [ ] **Real-time Features:** WebSocket integration for live collaboration
- [ ] **Advanced Search:** Filter and search quilts/patches by tags, content, author
- [ ] **Following System:** Follow users and quilts for notifications
- [ ] **Media Upload:** Image and file upload for patches
- [ ] **Export Features:** Export quilts as PDF, markdown, or other formats
- [ ] **Analytics Dashboard:** User engagement and story statistics
- [ ] **Mobile App:** React Native version for mobile devices

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

### **Development Guidelines**

- Follow the existing code style and structure
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design compatibility

---

**DreamQuilt: Weave your worlds together.** 🌟
