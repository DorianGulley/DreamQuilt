import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreatePatchPage.css";
import { useUser } from "../../context/UserContext";

const patchTypes = [
  { value: "plot", label: "Plot Development" },
  { value: "character", label: "Character Development" },
  { value: "world_building", label: "World Building" },
  { value: "dialogue", label: "Dialogue" },
  { value: "art", label: "Concept Art" },
  { value: "music", label: "Music/Sound" },
];

const CreatePatchPage = () => {
  const { user } = useUser();
  const { quiltId, parentPatchId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    patchType: patchTypes[0].value,
    tags: "",
    content: "",
    image: null,
    imagePreview: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Header state
  const [quiltName, setQuiltName] = useState("");
  const [patchCount, setPatchCount] = useState(null);
  const [parentPatchName, setParentPatchName] = useState("");
  const [loadingHeader, setLoadingHeader] = useState(true);
  const [quiltOwner, setQuiltOwner] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingHeader(true);
    // Fetch quilt name and owner
    const fetchQuilt = fetch(`http://localhost:4000/quilts/${quiltId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setQuiltName(data.title || "");
          setQuiltOwner(data.user_id);
          setIsOwner(user && data.user_id === user.id);
        }
      });
    // Fetch patch count
    const fetchCount = fetch(
      `http://localhost:4000/quilts/${quiltId}/patches/count`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setPatchCount(data.count);
      });
    // Fetch parent patch name if applicable
    let fetchParent = Promise.resolve();
    if (parentPatchId) {
      fetchParent = fetch(`http://localhost:4000/patches/${parentPatchId}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setParentPatchName(data.title || "");
        });
    } else {
      setParentPatchName("");
    }
    Promise.all([fetchQuilt, fetchCount, fetchParent]).finally(() => {
      if (isMounted) setLoadingHeader(false);
    });
    return () => {
      isMounted = false;
    };
  }, [quiltId, parentPatchId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null, imagePreview: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || !user.id) {
      alert("You must be logged in to create a patch.");
      setIsSubmitting(false);
      return;
    }

    const user_id = user.id;
    const patchData = {
      quilt_id: quiltId,
      user_id,
      title: formData.title,
      content_html: formData.content,
      ...(parentPatchId ? { parent_patch_id: parentPatchId } : {}),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    };

    try {
      const endpoint = isOwner ? "/patches" : "/patch-suggestions";
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchData),
      });

      if (!response.ok) {
        throw new Error("Failed to create patch");
      }

      if (isOwner) {
        navigate(`/quilt/owner/${quiltId}`);
      } else {
        alert(
          "Patch suggestion submitted! It will be reviewed by the quilt owner."
        );
        navigate(`/quilt/public/${quiltId}`);
      }
    } catch (error) {
      alert(error.message || "Error creating patch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Header logic
  let header = "";
  if (loadingHeader) {
    header = "Loading...";
  } else if (quiltName && patchCount !== null) {
    const patchNumber = parentPatchId
      ? patchCount + 1
      : patchCount === 0
      ? 1
      : patchCount + 1;
    if (!parentPatchId && patchCount === 0) {
      header = `${quiltName} Patch #1 (seed)`;
    } else if (parentPatchId) {
      header = `${quiltName} Patch #${patchNumber} (under ${
        parentPatchName || "..."
      })`;
    } else {
      header = `[${quiltName}] Patch #${patchNumber}`;
    }
  }

  return (
    <div className="create-patch-page">
      <div className="create-patch-container">
        <h1>{header}</h1>
        <form className="patch-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Patch Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter patch title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="patchType">Patch Type</label>
            <select
              id="patchType"
              name="patchType"
              value={formData.patchType}
              onChange={handleChange}
              required
            >
              {patchTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas"
            />
            <small>Tags help others discover your patch</small>
          </div>

          <div className="form-group">
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {formData.imagePreview && (
              <div className="image-preview">
                <img src={formData.imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Patch Content</label>
            <ReactQuill
              value={formData.content}
              onChange={handleQuillChange}
              placeholder="Write your patch..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "blockquote", "code-block"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "blockquote",
                "code-block",
              ]}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Patch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatchPage;
