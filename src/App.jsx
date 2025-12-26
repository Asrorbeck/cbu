import React, { Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Routes from "./Routes";
import migrateDates from "./utils/migrateDates";
import { chatsAPI } from "./services/api";
import SnowEffect from "./components/SnowEffect";

function App() {
  // Run date migration on app load (only once per version)
  useEffect(() => {
    const MIGRATION_VERSION = "1.0";
    const currentVersion = localStorage.getItem("dateMigrationVersion");

    if (currentVersion !== MIGRATION_VERSION) {
      migrateDates();
      localStorage.setItem("dateMigrationVersion", MIGRATION_VERSION);
    }
  }, []);

  // Register Telegram user data when app loads
  useEffect(() => {
    const registerTelegramUser = async () => {
      try {
        // Check if Telegram Web App is available
        if (window.Telegram && window.Telegram.WebApp) {
          console.log("Telegram WebApp found:", window.Telegram.WebApp);

          // Initialize Telegram Web App
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();

          // Get user data from initDataUnsafe
          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            console.log("Telegram user data:", user);

            // Prepare user data for API
            const userData = {
              user_id: user.id,
              username: user.username || null,
              phone_number: user.phone_number || null,
            };

            // Only send if we have required user_id
            if (userData.user_id) {
              try {
                await chatsAPI.registerUser(userData);
                console.log("User registered successfully:", userData);
              } catch (error) {
                console.error("Error registering user:", error);
                // Don't show error to user, just log it
              }
            }
            return;
          }

          // Check initData if initDataUnsafe doesn't work
          if (window.Telegram.WebApp.initData) {
            console.log(
              "Telegram initData found:",
              window.Telegram.WebApp.initData
            );
            // Here you could parse initData if needed
          }
        }

        // If Telegram Web App is not available, use default user
        console.log("Telegram WebApp not available, registering default user");
        const defaultUserData = {
          user_id: 905770018,
          username: null,
          phone_number: null,
        };

        try {
          await chatsAPI.registerUser(defaultUserData);
          console.log("Default user registered successfully:", defaultUserData);
        } catch (error) {
          console.error("Error registering default user:", error);
        }
      } catch (error) {
        console.error("Error in registerTelegramUser:", error);
      }
    };

    // Run with small delay to ensure Telegram Web App is ready
    const timer = setTimeout(registerTelegramUser, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SnowEffect />
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
