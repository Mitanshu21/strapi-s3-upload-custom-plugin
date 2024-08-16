import React, { useState, useEffect } from "react";
import { Alert } from "@strapi/design-system";

const AlertComponent = ({
  message = "",
  title = "",
  variant = "success",
  duration = 3000,
  closeAlert,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeAlert(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const closeAlertHandle = () => {
    closeAlert(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <Alert
        closeLabel="Close"
        onClose={closeAlertHandle}
        title={title}
        variant={variant}
      >
        {message}
      </Alert>
    </div>
  );
};

export default AlertComponent;
