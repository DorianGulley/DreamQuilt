# DreamQuilt

**Creator:** Dorian Gulley

## Description

DreamQuilt is a collaborative platform for creators to weave together fictional universes. Users can post their own creative ideas as "quilts" and invite others to contribute—whether that's plot development, concept art, or world-building. The platform is designed for writers, artists, and fans to expand and enrich stories together, making it ideal for everything from novels and manga to documentaries.

## Features

- **User Accounts:** Sign up, log in, and manage your profile (username, bio, profile picture).
- **Quilt Creation:** Start a new quilt (story) and set its category, content, and tags.
- **Quilt Feed:** Browse, search, and filter all quilts on the home page.
- **Contributions:** Add ideas, art, or plot twists to any quilt.
- **Profile Pages:** View your own and others' profiles, including bios, created quilts, and contributions.
- **Following System:** Follow users or specific quilts to keep up with new contributions (in progress).
- **Modern UI:** Responsive, beautiful design with a focus on community and creativity.

## Tech Stack

- **Frontend:** React (with React Router, React Icons)
- **Backend:** Node.js/Express (planned)
- **Database:** PostgreSQL

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd storytelling-platform
   ```
2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   # (Repeat in backend/ if applicable)
   ```
3. **Start the development server:**
   ```bash
   npm start
   ```
4. **Configure your database:**
   - Use the provided SQL scripts to set up the required tables (see `/PG Local.session.sql`).
   - Update environment variables as needed for your local setup.

## Roadmap / Todo

- [x] User authentication (sign up, log in)
- [x] Quilt creation and feed
- [x] Profile page with bio and list of quilts/contributions
- [x] Consistent "quilt" terminology throughout the app
- [ ] Email verification and password reset
- [ ] Remember me functionality
- [ ] Terms of use and privacy policy pages
- [ ] Error handling and validation improvements
- [ ] User sessions/tokens
- [ ] Color scheme and logo design
- [ ] Backend API endpoints for real data
- [ ] Following system (users and quilts)
- [ ] Quilt detail and contribution pages

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

_DreamQuilt: Weave your worlds together._
