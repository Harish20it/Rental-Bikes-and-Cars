import React from "react";

const NotFound = () => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      background: "#f4f4f4",
      color: "#333",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>Page Not Found</p>
      <a 
        href="/" 
        style={{
          textDecoration: "none",
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px"
        }}
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
