import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { useEffect } from "preact/hooks";
import axios from "axios";

const CodeInput = ({ language }) => {
  const [activeTab, setActiveTab] = useState("input");
  const [code, setCode] = useState("// Start coding here...");
  const [output, setOutput] = useState(""); // Example output; adjust based on your needs
  const [key, setKey] = useState([]);

  const handleEditorChange = (value) => {
    setCode(value);
  };
  const handleRunCode = async () => {
    // Mock function to process and display code output
    // You should replace this with actual code execution logic
    let langExtension = "";
    if (language === "JavaScript") {
      langExtension = ".js";
    } else if (language === "Python") {
      langExtension = ".py";
    } else if (language === "Java") {
      langExtension = ".java";
    }

    let response = await axios.post(`http://localhost:3000/api/v1/execute`, {
      code,
      lang: langExtension,
    });

    let json = response.data;
    console.log(json);
    setKey([...key, json.key]);

    console.log(json);

    setOutput(`Output of:\n${code}`);
  };

  useEffect(() => {
    setCode("");
  }, [language]);

  async function getOutput() {
    setActiveTab("output");
    let response = await axios.post(
      `http://localhost:3000/api/v1/submission/output`,
      {
        submissionId: key[0],
      }
    );

    if (response.data.statusCode <= 200) {
      key.shift();
    } else {
      setOutput("Please Wait");
    }

    let json = response.response;

    console.log(json);
  }

  return (
    <div className="w-full bg-gray-200 p-4 border-b border-gray-300 z-10 h-full ">
      <div className="mb-4">
        <div className="flex border-b border-gray-300">
          <button
            className={`py-2 px-4 ${
              activeTab === "input"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("input")}
          >
            Input
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "output"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => getOutput()}
          >
            Output
          </button>
        </div>
        <button
          onClick={handleRunCode}
          className="absolute top-20 right-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Run
        </button>
        <div className="mt-4">
          {activeTab === "input" && (
            <div className="relative h-[calc(100vh-150px)]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                // className="w-full h-100"
              />
            </div>
          )}
          {activeTab === "output" && (
            <div className="p-4 bg-white border border-gray-300 rounded">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
