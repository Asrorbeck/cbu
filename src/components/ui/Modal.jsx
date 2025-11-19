import React, { useEffect } from "react";
import Icon from "../AppIcon";
import Button from "./Button";

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget && closeOnOverlayClick) {
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
      />
      {/* Modal Content */}
      <div
        className={`
        relative bg-popover border border-border rounded-xl shadow-xl 
        w-full ${sizeClasses?.[size]} max-h-[90vh] overflow-hidden
        animate-scale-in theme-transition mx-4 md:mx-0 ${className}
      `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && (
              <h2 className="text-xl font-semibold text-popover-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-muted"
                aria-label="Close modal"
              >
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
