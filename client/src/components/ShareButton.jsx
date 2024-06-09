import React from "react";
import toast, { Toaster } from "react-hot-toast";
import "./ShareButton.css";

import { FaShare } from "react-icons/fa";
const ShareButton = () => {
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notify();
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  const notify = () => toast("Link copied! Send this link to your friends");

  return (
    <div>
      <Toaster />
      <button className="share-button" onClick={handleShare}>
        <FaShare className="share-icon" />
        <span>Invite</span>
      </button>
    </div>
  );
};

export default ShareButton;
