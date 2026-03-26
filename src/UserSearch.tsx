import { useState, useMemo } from "react";
import { useUsers } from "./hooks/useUsers";
import "./App.css";

const AVATAR_COUNT = 8;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function UserSearch() {
  const { users, loading, error } = useUsers();
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredUsersByName = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  function copyEmail(email: string, id: number) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  if (loading) {
    return (
      <div className="wrapper">
        <div className="loading-wrap">
          <div className="loading-dot" />
          <span className="loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {/* Header */}
      <div className="header">
        <div>
          <h2 className="title">List of users</h2>
          <p className="subtitle">
            {filteredUsersByName.length > 1
              ? `${filteredUsersByName.length} users`
              : filteredUsersByName.length < 1
              ? "0 users"
              : "1 user"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <svg
          className="search-icon"
          viewBox="0 0 16 16"
          fill="none"
          stroke="#888"
          strokeWidth="1.5"
        >
          <circle cx="6.5" cy="6.5" r="4.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="search-input"
        />
        {search && (
          <button onClick={() => setSearch("")} className="clear-btn">
            ✕
          </button>
        )}
      </div>

      {/* List */}
      {filteredUsersByName.length === 0 ? (
        <div className="empty-wrap">
          <p className="empty-text">No user found " {search} "</p>
        </div>
      ) : (
        <ul className="list">
          {filteredUsersByName.map((user) => (
            <li key={user.id} className="user-row">
              <div className={`avatar avatar--${user.id % AVATAR_COUNT}`}>
                {getInitials(user.name)}
              </div>

              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button
                onClick={() => copyEmail(user.email, user.id)}
                className={`copy-btn${
                  copiedId === user.id ? " copy-btn--copied" : ""
                }`}
                title="Copy email"
              >
                {copiedId === user.id ? "✓ Copied" : "Copy"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
