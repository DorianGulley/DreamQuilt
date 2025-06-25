import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateQuiltPage.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTag,
  FaBook,
  FaUsers,
  FaLock,
  FaGlobe,
  FaCheck,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateQuiltPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "sci-fi",
    tags: "",
    structure: "linear",
    description: "",
    allowedPatchTypes: ["plot", "character", "world_building"],
    moderators: [],
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);

  // Track currentStep changes
  useEffect(() => {
    console.log("currentStep changed to:", currentStep);
  }, [currentStep]);

  console.log(
    "CreateQuiltPage render - currentStep:",
    currentStep,
    "formData:",
    formData
  );

  // ReactQuill modules and formats configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "blockquote",
    "code-block",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("handleChange called:", { name, value, type, checked });
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDescriptionChange = (content) => {
    console.log(
      "handleDescriptionChange called with content length:",
      content.length
    );
    setFormData({
      ...formData,
      description: content,
    });
  };

  const handlePatchTypeChange = (patchType) => {
    console.log("handlePatchTypeChange called:", patchType);
    const currentTypes = formData.allowedPatchTypes;
    if (currentTypes.includes(patchType)) {
      setFormData({
        ...formData,
        allowedPatchTypes: currentTypes.filter((type) => type !== patchType),
      });
    } else {
      setFormData({
        ...formData,
        allowedPatchTypes: [...currentTypes, patchType],
      });
    }
  };

  const nextStep = () => {
    console.log("nextStep called - current step:", currentStep);

    // Validate current step before proceeding
    if (currentStep === 1) {
      console.log("Validating step 1 - title:", formData.title);
      if (!formData.title.trim()) {
        console.log("Step 1 validation failed - no title");
        alert("Please enter a quilt title");
        return;
      }
    } else if (currentStep === 2) {
      // Strip HTML tags for validation
      const plainTextDescription = formData.description
        .replace(/<[^>]*>/g, "")
        .trim();
      console.log(
        "Validating step 2 - description length:",
        plainTextDescription.length
      );
      if (!plainTextDescription) {
        console.log("Step 2 validation failed - no description");
        alert("Please enter a quilt description");
        return;
      }
    }

    if (currentStep < 3) {
      console.log("Moving to next step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("prevStep called - current step:", currentStep);
    if (currentStep > 1) {
      console.log("Moving to previous step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit called - preventing default");
    e.preventDefault();

    // Only proceed if the submit button was actually clicked
    if (!submitButtonClicked) {
      console.log("Form submission blocked - submit button not clicked");
      return;
    }

    console.log("Form submission started");
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
        creatorId: user?.id,
      };

      console.log("Creating quilt with data:", quiltData);

      // TODO: Replace with actual API call
      console.log("Creating quilt:", quiltData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Quilt created successfully, navigating to home");
      // Navigate back to home page
      navigate("/home");
    } catch (error) {
      console.error("Error creating quilt:", error);
    } finally {
      console.log("Form submission finished");
      setIsSubmitting(false);
      setSubmitButtonClicked(false); // Reset the flag
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

  const structures = [
    {
      value: "linear",
      label: "Linear",
      description: "Story progresses in a straight line",
    },
    {
      value: "nonlinear",
      label: "Non-Linear",
      description: "Story can branch and loop",
    },
    {
      value: "hierarchical",
      label: "Hierarchical",
      description: "Story has main plot with sub-plots",
    },
  ];

  const patchTypes = [
    {
      value: "plot",
      label: "Plot Development",
      description: "Main story progression",
    },
    {
      value: "character",
      label: "Character Development",
      description: "Character backstories and arcs",
    },
    {
      value: "world_building",
      label: "World Building",
      description: "Setting and lore",
    },
    {
      value: "dialogue",
      label: "Dialogue",
      description: "Character conversations",
    },
    {
      value: "art",
      label: "Concept Art",
      description: "Visual representations",
    },
    { value: "music", label: "Music/Sound", description: "Audio elements" },
  ];

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Basic Information</h2>
      <p className="step-description">
        Let's start with the fundamentals of your quilt.
      </p>

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

      <div className="form-group">
        <label>Story Structure</label>
        <div className="structure-options">
          {structures.map((structure) => (
            <div
              key={structure.value}
              className={`structure-option ${
                formData.structure === structure.value ? "selected" : ""
              }`}
              onClick={() =>
                setFormData({ ...formData, structure: structure.value })
              }
            >
              <div className="structure-header">
                <input
                  type="radio"
                  name="structure"
                  value={structure.value}
                  checked={formData.structure === structure.value}
                  onChange={handleChange}
                />
                <span className="structure-label">{structure.label}</span>
              </div>
              <p className="structure-description">{structure.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>Description</h2>
      <p className="step-description">
        Tell others about your quilt and what you're looking for.
      </p>

      <div className="form-group">
        <label htmlFor="description">
          <FaBook /> Quilt Description
        </label>
        <ReactQuill
          id="description"
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Describe your quilt idea, what you're looking for in contributions, and any specific themes or elements you want to explore..."
        />
        <small>
          This will be the main description that others see when browsing quilts
        </small>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>Settings & Permissions</h2>
      <p className="step-description">
        Configure how others can contribute to your quilt.
      </p>

      <div className="form-group">
        <label>Allowed Patch Types</label>
        <div className="patch-types-grid">
          {patchTypes.map((patchType) => (
            <div
              key={patchType.value}
              className={`patch-type-option ${
                formData.allowedPatchTypes.includes(patchType.value)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handlePatchTypeChange(patchType.value)}
            >
              <div className="patch-type-header">
                <input
                  type="checkbox"
                  checked={formData.allowedPatchTypes.includes(patchType.value)}
                  onChange={() => handlePatchTypeChange(patchType.value)}
                />
                <span className="patch-type-label">{patchType.label}</span>
              </div>
              <p className="patch-type-description">{patchType.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="moderators">
          <FaUsers /> Moderators (Optional)
        </label>
        <input
          type="text"
          id="moderators"
          name="moderators"
          placeholder="Enter usernames separated by commas"
        />
        <small>Moderators can approve or reject contributions</small>
      </div>

      <div className="form-group">
        <label className="privacy-label">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          <span className="privacy-text">
            {formData.isPublic ? <FaGlobe /> : <FaLock />}
            {formData.isPublic ? " Public Quilt" : " Private Quilt"}
          </span>
        </label>
        <small>
          {formData.isPublic
            ? "Anyone can view and contribute to this quilt"
            : "Only invited users can view and contribute to this quilt"}
        </small>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="create-quilt-page">
      <div className="create-quilt-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/home")}>
            <FaArrowLeft /> Back to Home
          </button>
          <h1>Create New Quilt</h1>
        </div>

        <div className="progress-bar">
          <div className="progress-step">
            <div className={`step-number ${currentStep >= 1 ? "active" : ""}`}>
              1
            </div>
            <span className="step-title">Basic Info</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className={`step-number ${currentStep >= 2 ? "active" : ""}`}>
              2
            </div>
            <span className="step-title">Description</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className={`step-number ${currentStep >= 3 ? "active" : ""}`}>
              3
            </div>
            <span className="step-title">Settings</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="quilt-form"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.type !== "textarea") {
              e.preventDefault();
            }
          }}
        >
          {renderCurrentStep()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="nav-btn prev-btn"
                onClick={() => {
                  console.log("Previous button clicked");
                  prevStep();
                }}
              >
                <FaArrowLeft /> Previous
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                className="nav-btn next-btn"
                onClick={() => {
                  console.log("Next button clicked");
                  nextStep();
                }}
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                onClick={() => {
                  console.log("Submit button clicked");
                  setSubmitButtonClicked(true);
                }}
              >
                <FaSave />
                {isSubmitting ? "Creating..." : "Create Quilt"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiltPage;
