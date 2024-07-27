import React, { useState } from "react";

const FileContainer = ({ setCurrentLang }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [isOpen, setIsOpen] = useState(false);

  const languages = ["JavaScript", "Python", "Java"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setCurrentLang(language);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-between items-center">
      <div className="text-lg font-semibold flex items-center">
        File Name
        <div className="relative ml-4">
          <button
            onClick={toggleDropdown}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            {selectedLanguage}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
              <ul>
                {languages.map((language) => (
                  <li
                    key={language}
                    onClick={() => selectLanguage(language)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Button
      </button>
    </div>
  );
};

export default FileContainer;
