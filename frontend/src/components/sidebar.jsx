import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">RCE</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <li className="p-2 hover:bg-gray-700">
            <a href="#">Dashboard</a>
          </li>
          <li className="p-2 hover:bg-gray-700">
            <a href="#">New File</a>
          </li>
          <li className="p-2 hover:bg-gray-700">
            <a href="#">Community</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
