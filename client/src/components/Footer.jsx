import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Jointly. All Rights Reserved.</p>
        <p>
          Built with{" "}
          <span role="img" aria-label="love">
            ❤️
          </span>{" "}
          by <a href="http://google.com">Shubham Kumar</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
