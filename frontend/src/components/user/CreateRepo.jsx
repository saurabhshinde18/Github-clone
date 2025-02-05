import React, { useState } from "react";
import axios from "axios";
import { Button, Box } from "@primer/react";
import { useAuth } from "../../authContext"; // Assume useAuth hook is used to get user info
import "./repo.css"; // You can define your styles here

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public"); // Default to public
  const [content, setContent] = useState("");
  const [issues, setIssues] = useState(""); // Just a string initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser } = useAuth(); // Assuming you have user context for current user

  // Get the JWT token from localStorage (assuming it's stored there)
  const token = localStorage.getItem("token");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Ensure required fields are filled
    if (!name || !description || !content) {
      setLoading(false);
      return setError("Please fill all required fields.");
    }

    // Convert the comma-separated string of issues into an array
    const issuesArray = issues.split(",").map(issue => issue.trim());

    // Validate that all issues are valid ObjectIds (24-character string)
    const invalidIssues = issuesArray.filter(issue => issue.length !== 24);

    if (invalidIssues.length > 0) {
      setLoading(false);
      return setError(`Invalid ObjectId(s) found: ${invalidIssues.join(", ")}`);
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/repository/create", // Your updated API endpoint
        {
          owner: currentUser, // Assuming currentUser is the owner (user ID)
          name,
          description,
          visibility: visibility === "public", // Convert to true/false boolean
          content: content.split("\n"), // Convert content into an array of strings (one per line)
          issues: issuesArray, // Pass the issues array (valid ObjectIds)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      if (res.status === 201) {
        setSuccess("Repository created successfully!");
        setLoading(false);
        setName("");
        setDescription("");
        setContent("");
        setIssues("");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Server error occurred");
    }
  };

  return (
    <div className="repo-wrapper">
      <h2>Create New Repository</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Repository Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Repository Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="issues">Issues (comma separated ObjectIds)</label>
          <input
            type="text"
            id="issues"
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            placeholder="Enter issue ObjectIds, separated by commas"
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Repository"}
        </Button>
      </form>
    </div>
  );
};

export default CreateRepo;
