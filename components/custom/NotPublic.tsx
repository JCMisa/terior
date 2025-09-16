import React from "react";

const NotPublic = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold tracking-wider">
        This room is not publicly available
      </h1>
      <span className="text-sm text-muted-foreground">
        Please ask owner permission first to visit this page.
      </span>
    </div>
  );
};

export default NotPublic;
