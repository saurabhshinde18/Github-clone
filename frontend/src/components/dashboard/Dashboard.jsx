import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]); // Ensure this is an array by default
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]); // Ensure this is an array by default
  const [loadingRepositories, setLoadingRepositories] = useState(true);
  const [loadingSuggestedRepositories, setLoadingSuggestedRepositories] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Fetch the user's repositories
    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []); // Ensure we set an empty array if no repositories
        setLoadingRepositories(false);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setLoadingRepositories(false);
      }
    };

    // Fetch suggested repositories
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []); // Ensure we set an empty array if no data
        setLoadingSuggestedRepositories(false);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
        setLoadingSuggestedRepositories(false);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  // Filter repositories based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {loadingSuggestedRepositories ? (
            <p>Loading suggested repositories...</p>
          ) : suggestedRepositories.length === 0 ? (
            <p>No suggested repositories available.</p>
          ) : (
            suggestedRepositories.map((repo) => {
              return (
                <div key={repo._id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
              );
            })
          )}
        </aside>

        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loadingRepositories ? (
            <p>Loading your repositories...</p>
          ) : repositories.length === 0 ? (
            <p>You have no repositories yet. Start by creating or exploring some!</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((repo) => {
              return (
                <div key={repo._id}>
                  <h4>{repo.name}</h4>
                  <h4>{repo.description}</h4>
                </div>
              );
            })
          ) : (
            <p>No repositories found matching your search.</p>
          )}
        </main>

        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
