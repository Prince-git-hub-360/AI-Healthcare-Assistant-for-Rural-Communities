import React from 'react';

export const Toast = ({ message, type = 'info' }) => {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
    </div>
  );
};
