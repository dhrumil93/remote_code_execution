import { useState } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import FileContainer from "./components/filecontainer.jsx";
import CodeInput from "./components/condeInput.jsx";

export function App() {
  const [currentLang, setCurrentLang] = useState("JavaScript");
  return (
    <>
      <FileContainer setCurrentLang={setCurrentLang} />
      <CodeInput language={currentLang} />
    </>
  );
}
