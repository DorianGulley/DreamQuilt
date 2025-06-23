import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { FaUserPlus, FaEdit, FaBook, FaPlusSquare } from "react-icons/fa";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quilts, setQuilts] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [activeTab, setActiveTab] = useState("quilts");

  // Mock data - replace with API calls
  useEffect(() => {
    // Mock user data
    const mockUser = {
      username: "alexchen",
      bio: 'Sci-fi author and world-builder. Fascinated by floating cities and dystopian futures. Currently weaving the "Aethelgard" universe.',
      profilePicture: "https://i.pravatar.cc/150?u=alexchen",
      followers: 1250,
      following: 340,
      quiltCount: 5,
    };

    // Mock quilts data
    const mockQuilts = [
      {
        id: 1,
        title: "The Last City in the Sky",
        category: "sci-fi",
        likes: 24,
        comments: 8,
      },
      {
        id: 4,
        title: "Cybernetic Serenade",
        category: "sci-fi",
        likes: 45,
        comments: 15,
      },
    ];

    // Mock contributions data
    const mockContributions = [
      {
        id: 1,
        quiltTitle: "Whispers of the Ancient Forest",
        type: "plot_twist",
        content:
          "The ancient threat is revealed to be a sentient, crystalline entity that feeds on memories.",
      },
      {
        id: 2,
        quiltTitle: "The Memory Thief",
        type: "character_art",
        content:
          "Concept art for the protagonist, a detective with glowing, empty eyes.",
      },
    ];

    setUser(mockUser);
    setQuilts(mockQuilts);
    setContributions(mockContributions);
  }, [username]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="profile-picture"
        />
        <div className="profile-info">
          <div className="profile-title">
            <h2>{user.username}</h2>
            <div className="profile-actions">
              <button className="follow-btn">
                <FaUserPlus /> Follow
              </button>
              <button className="edit-profile-btn">
                <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
          <div className="profile-stats">
            <span>
              <strong>{user.quiltCount}</strong> quilts
            </span>
            <span>
              <strong>{user.followers}</strong> followers
            </span>
            <span>
              <strong>{user.following}</strong> following
            </span>
          </div>
          <p className="profile-bio">{user.bio}</p>
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
                    <span>{quilt.likes} Likes</span>
                    <span>{quilt.comments} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "contributions" && (
            <div className="contributions-list">
              {contributions.map((contrib) => (
                <div key={contrib.id} className="profile-contribution-card">
                  <p>
                    Contribution to <strong>{contrib.quiltTitle}</strong>
                  </p>
                  <p className="contribution-type">Type: {contrib.type}</p>
                  <p className="contribution-content">"{contrib.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
