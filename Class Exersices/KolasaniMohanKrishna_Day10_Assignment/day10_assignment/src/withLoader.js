import React, { useState } from "react";

function withLoader(WrappedComponent) {
  return function EnhancedComponent(props) {
    const [isLoading, setLoading] = useState(false);

    return (
      <>
        {isLoading && <p>Loading...</p>}
        <WrappedComponent
          {...props}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      </>
    );
  };
}

export default withLoader;