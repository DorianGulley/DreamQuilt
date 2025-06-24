import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import {
  FaUserPlus,
  FaEdit,
  FaBook,
  FaPlusSquare,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: activeUser, logout } = useUser();
  const [profile, setProfile] = useState(null);
  const [quilts, setQuilts] = useState([]);
  const [contributions, setContributions] = useState([]); // Placeholder for future
  const [activeTab, setActiveTab] = useState("quilts");

  useEffect(() => {
    // Fetch user profile
    fetch(`http://localhost:4000/users/${username}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));

    // Fetch user's quilts
    fetch(`http://localhost:4000/users/${username}/quilts`)
      .then((res) => res.json())
      .then((data) => setQuilts(data))
      .catch(() => setQuilts([]));
  }, [username]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Only show edit button and log out if this is the active user's profile
  const isOwnProfile = activeUser && activeUser.username === profile.username;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt={profile.username}
            className="profile-picture"
          />
        ) : (
          <div
            className="profile-picture"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eee",
              width: 150,
              height: 150,
              borderRadius: "50%",
            }}
          >
            <FaUser size={80} color="#aaa" />
          </div>
        )}
        <div className="profile-info">
          <div className="profile-title">
            <h2>{profile.username}</h2>
            <div className="profile-actions">
              {isOwnProfile ? (
                <>
                  <button className="edit-profile-btn">
                    <FaEdit /> Edit Profile
                  </button>
                  <button className="logout-profile-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Log Out
                  </button>
                </>
              ) : (
                <button className="follow-btn">
                  <FaUserPlus /> Follow
                </button>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <span>
              <strong>{quilts.length}</strong> quilts
            </span>
            <span>
              <strong>{profile.followers || 0}</strong> followers
            </span>
            <span>
              <strong>{profile.following || 0}</strong> following
            </span>
          </div>
          <p className="profile-bio">{profile.bio || "No bio yet."}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "quilts" ? "active" : ""}`}
            onClick={() => setActiveTab("quilts")}
          >
            <FaBook /> Quilts
          </button>
          <button
            className={`tab-btn ${
              activeTab === "contributions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("contributions")}
          >
            <FaPlusSquare /> Contributions
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "quilts" && (
            <div className="quilts-list">
              {quilts.map((quilt) => (
                <div key={quilt.id} className="profile-quilt-card">
                  <h3>{quilt.title}</h3>
                  <p>Category: {quilt.category}</p>
                  <div className="quilt-card-stats">
                    <span>{quilt.likes || 0} Likes</span>
                    <span>{quilt.comments || 0} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contributions" && (
            <div className="contributions-list">
              {/* Future: List user contributions here */}
              <p>No contributions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
