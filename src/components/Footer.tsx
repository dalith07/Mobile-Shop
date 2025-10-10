import React from "react";

const Footer = () => {
  return (
    <footer className="relative bottom-0 w-full bg-background border-t border-gray-800 dark:border-gray-200 mt-12">
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="p-4">
          <p className="text-center p-4 sm:text-sm text-[0.6rem]">
            &copy; 2024 WorkShare. Connecting remote workers with great spaces.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
