/* React imports */
import React, { Component } from "react";
/* App imports */
import Snackbar from '../../components/UI/Snackbar/Snackbar'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }
  render() {
    let payload = { type: "error", info: this.state.error };
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Snackbar payload={payload} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary