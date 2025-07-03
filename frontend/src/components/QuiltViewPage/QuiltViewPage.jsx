import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlow, Handle, Position } from "@xyflow/react";
import { FaPlus } from "react-icons/fa";
import "@xyflow/react/dist/style.css";
import "./QuiltViewPage.css";

// Custom node component with plus button
const CustomNode = ({ id, data }) => {
  const { id: quiltId } = useParams();
  const navigate = useNavigate();

  const handleAddPatch = useCallback(
    (event) => {
      event.stopPropagation();
      if (id === "create-first-patch") {
        navigate(`/create-patch/${quiltId}`);
      } else {
        navigate(`/create-patch/${quiltId}/${id}`);
      }
    },
    [navigate, id, quiltId]
  );

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content" title={data.snippet}>
        <div className="node-label">
          <strong>{data.label}</strong>
          <br />
          <span className="node-author">by {data.author}</span>
        </div>
        <button className="add-patch-btn" onClick={handleAddPatch} title="Add patch">
          <FaPlus />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const QuiltViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quilt");
  const [quilt, setQuilt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/quilts`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((q) => String(q.id) === String(id));
        setQuilt(found);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load quilt");
        setLoading(false);
      });
  }, [id]);

  // Fetch patches and links for this quilt
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/quilts/${id}/patches`)
      .then((res) => res.json())
      .then((data) => {
        const { patches, links } = data;
        if (!patches || patches.length === 0) {
          setNodes([
            {
              id: "create-first-patch",
              position: { x: 250, y: 100 },
              data: { label: "Create First Patch" },
              type: "custom",
            },
          ]);
          setEdges([]);
        } else {
          // Lay out nodes vertically for now
          const nodeSpacing = 120;
          const nodes = patches.map((patch, idx) => ({
            id: String(patch.id),
            position: { x: 250, y: 100 + idx * nodeSpacing },
            data: {
              label: patch.title,
              author: patch.author,
              snippet: patch.content_html
                .replace(/<[^>]+>/g, '') // strip HTML tags
                .slice(0, 100) + '...', // show a brief preview
            },
            type: "custom",
          }));
          const edges = links.map((link) => ({
            id: `${link.from_patch_id}->${link.to_patch_id}`,
            source: String(link.from_patch_id),
            target: String(link.to_patch_id),
          }));
          setNodes(nodes);
          setEdges(edges);
        }
      })
      .catch((err) => {
        setNodes([]);
        setEdges([]);
      });
  }, [id]);

  return (
    <div className="quilt-view-page">
      <div className="quilt-tabs">
        <button
          className={activeTab === "quilt" ? "tab active" : "tab"}
          onClick={() => setActiveTab("quilt")}
        >
          Quilt View
        </button>
        <button
          className={activeTab === "description" ? "tab active" : "tab"}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
      </div>
      <div className="quilt-tab-content">
        {activeTab === "quilt" ? (
          <div className="quilt-flow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          <div className="quilt-description-mock">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : quilt ? (
              <div
                className="quilt-description-html"
                dangerouslySetInnerHTML={{ __html: quilt.description }}
              />
            ) : (
              <p>No description found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuiltViewPage;
