import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/ui/Navbar";
import ProfileHeader from "./components/ProfileHeader";
import ProfileActions from "./components/ProfileActions";

const Profile = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Telegram Web App dan user ma'lumotlarini olish
    const getTelegramUserData = () => {
      try {
        // Telegram Web App mavjudligini tekshirish
        if (window.Telegram && window.Telegram.WebApp) {
          console.log("Telegram WebApp found:", window.Telegram.WebApp);

          // Telegram Web App ni ishga tushirish
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();

          // initDataUnsafe ni tekshirish
          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            console.log("Telegram user data:", user);

            setUserData({
              id: user.id,
              firstName: user.first_name || "Foydalanuvchi",
              lastName: user.last_name || "",
              username: user.username || null,
              photoUrl: user.photo_url || null,
              languageCode: user.language_code || "uz",
            });
            return;
          }

          // initData ni tekshirish (agar initDataUnsafe ishlamasa)
          if (window.Telegram.WebApp.initData) {
            console.log(
              "Telegram initData found:",
              window.Telegram.WebApp.initData
            );
            // Bu yerda initData ni parse qilish kerak
          }
        }

        // Agar Telegram Web App mavjud bo'lmasa yoki ma'lumot olinmasa
        console.log("Telegram WebApp not available, using fallback data");
        setUserData({
          id: Math.floor(Math.random() * 1000000000),
          firstName: "Test",
          lastName: "Foydalanuvchi",
          username: "test_user",
          photoUrl: null,
          languageCode: "uz",
        });
      } catch (error) {
        console.error("Error getting Telegram user data:", error);
        setUserData({
          id: Math.floor(Math.random() * 1000000000),
          firstName: "Xatolik",
          lastName: "Yuz berdi",
          username: null,
          photoUrl: null,
          languageCode: "uz",
        });
      }
    };

    // Kichik kechikish bilan ishga tushirish
    const timer = setTimeout(getTelegramUserData, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("profile.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("profile.subtitle")}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <ProfileHeader userData={userData} />

            <ProfileActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
