import React from "react";

const Navbar = () => {
  const handleShare = () => {
    // Logic for share button (e.g., share the URL or content)
    alert("Share button clicked!");
  };

  // Sample data for connected or active users
  const activeUsers = ["User1", "User2", "User3"];

  return (
    <div className="fixed top-0 left-64 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-10 h-16">
      <div className="text-xl font-bold">My Application</div>
      <div className="flex items-center space-x-4">
        <ul className="flex space-x-2">
          {activeUsers.map((user, index) => (
            <li
              key={index}
              className="bg-gray-700 px-2 py-1 rounded-full w-10 h-10 flex items-center justify-center"
            >
              {user}
            </li>
          ))}
        </ul>
        <button onClick={handleShare} className="bg-blue-500 px-4 py-2 rounded">
          Share
        </button>
      </div>
    </div>
  );
};

export default Navbar;
