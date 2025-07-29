import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import {
  FaSearch,
  FaPlus,
  FaUser,
  FaHeart,
  FaComment,
  FaShare,
  FaBook,
  FaPalette,
  FaLightbulb,
  FaBell,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

// Utility to strip HTML tags and convert to plain text
const stripHtml = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Utility to truncate text with ellipses
const truncate = (text, maxLength = 300) =>
  text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [quilts, setQuilts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch quilts from backend
    fetch("http://localhost:4000/quilts")
      .then((res) => res.json())
      .then((data) => setQuilts(data))
      .catch((err) => {
        console.error("Failed to fetch quilts:", err);
        setQuilts([]);
      });
  }, []);

  // Fetch pending suggestions when user is logged in
  useEffect(() => {
    if (user && user.id) {
      setLoadingNotifications(true);
      fetch(`http://localhost:4000/patch-suggestions/pending/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
          setLoadingNotifications(false);
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);
          setNotifications([]);
          setLoadingNotifications(false);
        });
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateQuilt = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/create-quilt");
  };

  const handleUserButton = () => {
    if (user) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredQuilts = quilts.filter((quilt) => {
    const matchesSearch =
      quilt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quilt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

          {user && (
            <div className="notification-container" ref={notificationRef}>
              <button
                className="notification-btn"
                onClick={handleNotifications}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Pending Suggestions</h4>
                    <span className="notification-count">
                      {notifications.length}
                    </span>
                  </div>
                  <div className="notification-list">
                    {loadingNotifications ? (
                      <div className="notification-item loading">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="notification-item empty">
                        No pending suggestions
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="notification-item"
                        >
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title}
                            </div>
                            <div className="notification-details">
                              <span className="quilt-name">
                                {notification.quilt_title}
                              </span>
                              <span className="author">
                                by {notification.author_name}
                              </span>
                              {notification.parent_patch_title && (
                                <span className="parent-patch">
                                  → {notification.parent_patch_title}
                                </span>
                              )}
                            </div>
                            <div className="notification-preview">
                              {truncate(
                                stripHtml(notification.content_html),
                                100
                              )}
                            </div>
                            <div className="notification-time">
                              {formatTimeAgo(notification.created_at)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="user-controls">
            <button className="create-quilt-btn" onClick={handleCreateQuilt}>
              <FaPlus /> New Quilt
            </button>
            <button
              className="user-profile-btn create-quilt-btn"
              onClick={handleUserButton}
            >
              <FaUser className="user-icon-white" />
              {user ? user.username : "Log In"}
            </button>
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
                    <h4>
                      <Link
                        to={
                          user && user.id === quilt.user_id
                            ? `/quilt/owner/${quilt.id}`
                            : `/quilt/public/${quilt.id}`
                        }
                        className="quilt-title-link"
                      >
                        {quilt.title}
                      </Link>
                    </h4>
                    <span className="quilt-category">{quilt.category}</span>
                  </div>

                  <p className="quilt-content">
                    {truncate(stripHtml(quilt.description))}
                  </p>

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
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
