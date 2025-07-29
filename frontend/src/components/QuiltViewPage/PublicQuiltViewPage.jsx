import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactFlow, Handle, Position } from "@xyflow/react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";
import "@xyflow/react/dist/style.css";
import "./QuiltViewPage.css";

// Custom node component with plus button for public view
const PublicNode = ({ id, data }) => {
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
        <button
          className="add-patch-btn"
          onClick={handleAddPatch}
          title="Add patch"
        >
          <FaPlus />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: PublicNode,
};

const PublicQuiltViewPage = () => {
  const { id } = useParams();
  const [quilt, setQuilt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showDescription, setShowDescription] = useState(false);

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
          // Organize nodes in a tree structure
          const nodeSpacing = 200;
          const levelSpacing = 150;

          // Create a map of patch relationships
          const childrenMap = new Map();
          const parentMap = new Map();

          // Build relationship maps
          links.forEach((link) => {
            const fromId = String(link.from_patch_id);
            const toId = String(link.to_patch_id);

            if (!childrenMap.has(fromId)) {
              childrenMap.set(fromId, []);
            }
            childrenMap.get(fromId).push(toId);
            parentMap.set(toId, fromId);
          });

          // Find root nodes (nodes with no parents)
          const allPatchIds = new Set(patches.map((p) => String(p.id)));
          const rootNodes = patches.filter(
            (patch) => !parentMap.has(String(patch.id))
          );

          // Position nodes in tree structure
          const positionedNodes = new Map();
          let nextX = 0;

          const positionNode = (patchId, level, xOffset = 0) => {
            const patch = patches.find((p) => String(p.id) === patchId);
            if (!patch || positionedNodes.has(patchId)) return;

            const children = childrenMap.get(patchId) || [];
            let totalWidth = 0;

            // Calculate positions for children first
            if (children.length > 0) {
              const childWidths = children.map((childId) => {
                const childPatch = patches.find(
                  (p) => String(p.id) === childId
                );
                return childPatch ? 1 : 0;
              });
              totalWidth =
                childWidths.reduce((sum, width) => sum + width, 0) *
                nodeSpacing;
            }

            // Position this node
            const x = xOffset + totalWidth / 2;
            const y = 100 + level * levelSpacing;

            positionedNodes.set(patchId, {
              id: String(patch.id),
              position: { x, y },
              data: {
                label: patch.title,
                author: patch.author,
                snippet:
                  patch.content_html
                    .replace(/<[^>]+>/g, "") // strip HTML tags
                    .slice(0, 100) + "...", // show a brief preview
              },
              type: "custom",
            });

            // Position children
            let childXOffset = xOffset;
            children.forEach((childId) => {
              positionNode(childId, level + 1, childXOffset);
              childXOffset += nodeSpacing;
            });
          };

          // Position all root nodes
          rootNodes.forEach((rootPatch, idx) => {
            positionNode(String(rootPatch.id), 0, nextX);
            nextX += nodeSpacing * 2;
          });

          // Handle orphaned nodes (nodes with no relationships)
          patches.forEach((patch) => {
            const patchId = String(patch.id);
            if (!positionedNodes.has(patchId)) {
              positionedNodes.set(patchId, {
                id: patchId,
                position: { x: nextX, y: 100 },
                data: {
                  label: patch.title,
                  author: patch.author,
                  snippet:
                    patch.content_html
                      .replace(/<[^>]+>/g, "") // strip HTML tags
                      .slice(0, 100) + "...", // show a brief preview
                },
                type: "custom",
              });
              nextX += nodeSpacing;
            }
          });

          const nodes = Array.from(positionedNodes.values());
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
      <div className="quilt-header">
        <h2>{quilt?.title || "Loading..."}</h2>
        <button
          className="description-btn"
          onClick={() => setShowDescription(!showDescription)}
          title="View quilt description"
        >
          <FaInfoCircle />
          Description
        </button>
      </div>
      <div className="quilt-content">
        <div className="quilt-flow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {showDescription && (
          <div className="description-overlay">
            <div className="description-modal">
              <div className="description-header">
                <h3>Quilt Description</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowDescription(false)}
                >
                  ×
                </button>
              </div>
              <div className="description-content">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicQuiltViewPage;
