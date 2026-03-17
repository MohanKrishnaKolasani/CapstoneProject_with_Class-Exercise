import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // BONUS: Log error details
    console.log("Error:", error);
    console.log("Error Info:", info);
  }

  render() {
    if (this.state.hasError) {
      return <h3>Something went wrong. Please refresh.</h3>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;