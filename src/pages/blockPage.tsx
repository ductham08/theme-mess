import React from 'react';

const BlockedPage = () => {
  return (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh"
    }}>
      <h1>Access Denied</h1>
      <p>You are not allowed to access this page from your current location.</p>
    </div>
  );
};

export default BlockedPage;
