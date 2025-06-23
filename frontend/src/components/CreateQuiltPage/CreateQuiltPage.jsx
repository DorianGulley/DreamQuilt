import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateQuiltPage.css";
import { FaArrowLeft, FaSave, FaTag, FaBook } from "react-icons/fa";

const CreateQuiltPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "sci-fi",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const quiltData = {
        ...formData,
        tags: tagsArray,
      };

      // TODO: Replace with actual API call
      console.log("Creating quilt:", quiltData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to home page
      navigate("/home");
    } catch (error) {
      console.error("Error creating quilt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "sci-fi", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "mystery", label: "Mystery" },
    { value: "romance", label: "Romance" },
    { value: "horror", label: "Horror" },
    { value: "adventure", label: "Adventure" },
    { value: "drama", label: "Drama" },
    { value: "comedy", label: "Comedy" },
  ];

  return (
    <div className="create-quilt-page">
      <div className="create-quilt-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/home")}>
            <FaArrowLeft /> Back to Home
          </button>
          <h1>Create New Quilt</h1>
        </div>

        <form onSubmit={handleSubmit} className="quilt-form">
          <div className="form-group">
            <label htmlFor="title">
              <FaBook /> Quilt Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your quilt title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              <FaBook /> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <FaBook /> Quilt Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your quilt idea, concept, or plot outline..."
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              <FaTag /> Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., space, adventure, AI)"
            />
            <small>Tags help others discover your quilt</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FaSave />
              {isSubmitting ? "Creating..." : "Create Quilt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiltPage;
