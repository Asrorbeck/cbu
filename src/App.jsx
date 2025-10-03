import React, { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Routes from "./Routes";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Success toast options
          success: {
            duration: 4000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
            },
          },
          // Error toast options
          error: {
            duration: 5000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444",
            },
          },
        }}
      />
    </Suspense>
  );
}

export default App;
