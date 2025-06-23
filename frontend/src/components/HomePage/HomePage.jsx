import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import {
  FaSearch,
  FaPlus,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaComment,
  FaShare,
  FaBook,
  FaPalette,
  FaLightbulb,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quilts, setQuilts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate fetching user data
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Mock quilts data
    const mockQuilts = [
      {
        id: 1,
        title: "The Last City in the Sky",
        author: "Alex Chen",
        content:
          "A floating metropolis where the wealthy live above the clouds while the poor struggle in the polluted depths below. The city's energy source is failing, and only a young engineer from the depths can save it.",
        category: "sci-fi",
        likes: 24,
        comments: 8,
        shares: 3,
        timestamp: "2 hours ago",
        tags: ["floating city", "class divide", "energy crisis"],
      },
      {
        id: 2,
        title: "Whispers of the Ancient Forest",
        author: "Maya Rodriguez",
        content:
          "Deep in an enchanted forest, trees communicate through a network of roots and fungi. A young botanist discovers she can hear their conversations and learns of an ancient threat awakening beneath the earth.",
        category: "fantasy",
        likes: 31,
        comments: 12,
        shares: 5,
        timestamp: "5 hours ago",
        tags: ["enchanted forest", "nature magic", "ancient threat"],
      },
      {
        id: 3,
        title: "The Memory Thief",
        author: "Jordan Kim",
        content:
          "In a world where memories can be extracted and sold, a detective with no memories of her own must solve the case of disappearing childhoods while uncovering her own forgotten past.",
        category: "mystery",
        likes: 18,
        comments: 6,
        shares: 2,
        timestamp: "1 day ago",
        tags: ["memory manipulation", "detective", "identity"],
      },
    ];
    setQuilts(mockQuilts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateQuilt = () => {
    // Navigate to quilt creation page
    navigate("/create-quilt");
  };

  const filteredQuilts = quilts.filter((quilt) => {
    const matchesSearch =
      quilt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quilt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quilt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || quilt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", name: "All Quilts", icon: <FaBook /> },
    { id: "sci-fi", name: "Science Fiction", icon: <FaLightbulb /> },
    { id: "fantasy", name: "Fantasy", icon: <FaPalette /> },
    { id: "mystery", name: "Mystery", icon: <FaSearch /> },
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>DreamQuilt</h1>
            <span>Collaborative Storytelling</span>
          </div>

          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search quilts, tags, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="user-controls">
            <button className="create-quilt-btn" onClick={handleCreateQuilt}>
              <FaPlus /> Create Quilt
            </button>
            <div className="user-menu">
              <FaUser className="user-icon" />
              <span>{user?.username || "User"}</span>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Weave Stories Together</h2>
          <p>
            Join a community of creators building extraordinary worlds. Share
            your ideas, expand on others' stories, and bring fictional universes
            to life through collaboration.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1,247</span>
              <span className="stat-label">Quilts Created</span>
            </div>
            <div className="stat">
              <span className="stat-number">5,892</span>
              <span className="stat-label">Contributions</span>
            </div>
            <div className="stat">
              <span className="stat-number">2,341</span>
              <span className="stat-label">Active Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="category-filter">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${
                      selectedCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Quilt Feed */}
          <section className="quilt-feed">
            <div className="feed-header">
              <h3>Latest Quilt Ideas</h3>
              <span className="quilt-count">
                {filteredQuilts.length} quilts
              </span>
            </div>

            <div className="quilts-grid">
              {filteredQuilts.map((quilt) => (
                <article key={quilt.id} className="quilt-card">
                  <div className="quilt-header">
                    <h4>{quilt.title}</h4>
                    <span className="quilt-category">{quilt.category}</span>
                  </div>

                  <p className="quilt-content">{quilt.content}</p>

                  <div className="quilt-tags">
                    {quilt.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="quilt-meta">
                    <div className="author-info">
                      <FaUser className="author-icon" />
                      <Link
                        to={`/profile/${quilt.author.toLowerCase()}`}
                        className="author-link"
                      >
                        <span>{quilt.author}</span>
                      </Link>
                      <span className="timestamp">{quilt.timestamp}</span>
                    </div>

                    <div className="quilt-actions">
                      <button className="action-btn">
                        <FaHeart /> {quilt.likes}
                      </button>
                      <button className="action-btn">
                        <FaComment /> {quilt.comments}
                      </button>
                      <button className="action-btn">
                        <FaShare /> {quilt.shares}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredQuilts.length === 0 && (
              <div className="no-quilts">
                <p>No quilts found matching your criteria.</p>
                <button
                  className="create-quilt-btn"
                  onClick={handleCreateQuilt}
                >
                  <FaPlus /> Create the first quilt!
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
