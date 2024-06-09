import React from "react";

const NavBar = () => {
  return (
    <nav
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
        }}
      >
        <div>
          <a
            href="#"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            My App
          </a>
        </div>
        <div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              margin: 0,
              padding: 0,
            }}
          >
            <li style={{ marginRight: "20px" }}>
              <a href="#" style={{ color: "#666", textDecoration: "none" }}>
                Home
              </a>
            </li>
            <li style={{ marginRight: "20px" }}>
              <a href="#" style={{ color: "#666", textDecoration: "none" }}>
                About
              </a>
            </li>
            <li style={{ marginRight: "20px" }}>
              <a href="#" style={{ color: "#666", textDecoration: "none" }}>
                Services
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "#666", textDecoration: "none" }}>
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
