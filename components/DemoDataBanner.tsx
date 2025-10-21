import React from 'react';

const DemoDataBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-2 text-center text-sm" role="alert">
      <p>
        <span className="font-bold">Demo Mode:</span> The API call failed or is in cooldown. Showing mock data.
      </p>
    </div>
  );
};

export default DemoDataBanner;
