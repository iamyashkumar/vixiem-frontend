import React from 'react';

export const PageTransition = ({ children }) => {
  return (
    <div className="w-full transition-opacity duration-150 ease-out">
      {children}
    </div>
  );
};

export default PageTransition;
