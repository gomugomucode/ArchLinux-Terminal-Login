import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [booted, setBooted] = useState(false);
  const [step, setStep] = useState("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    setLines(["Arch Linux 6.8.2 (tty1)"]);
    setTimeout(() => setBooted(true), 1000);
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [lines]);

  const handleSubmit = () => {
    if (step === "username") {
      setUsername(inputValue);
      setLines((prev) => [...prev, `login: ${inputValue}`]);
      setInputValue("");
      setStep("password");
    } else {
      setPassword(inputValue);
      setLines((prev) => [...prev, `Password:`]);
      if (username === "anupam" && inputValue === "archlinux") {
        setTimeout(() => {
          setLines((prev) => [...prev, "Welcome to Arch Linux!", ""]);
          setTimeout(() => navigate("/home"), 1500);
        }, 500);
      } else {
        setUsername("");
        setPassword("");
        setInputValue("");
        setStep("username");
        // Show "Login incorrect" and one blank line before the new login prompt
        setLines((prev) => [
          ...prev,
          "Login incorrect",
          "", 
          `login:`,
        ]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Backspace") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setInputValue((prev) => prev + e.key);
    }
  };

  return (
    <div
      className="bg-black text-green-400 h-screen w-screen font-mono text-base p-6 overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div className="h-full overflow-y-auto whitespace-pre-wrap space-y-1">
        {lines.map((line, i) => (
          <div key={i}>
            {line === "archlinux login:" ? (
              <>
                archlinux login: {inputValue}
                <span className="animate-pulse">_</span>
              </>
            ) : (
              line
            )}
          </div>
        ))}
        {booted && !lines.some((line) => line === "archlinux login:") && (
          <div>
            {step === "username" && (
              <span>
                archlinux login: {inputValue}
                <span className="animate-pulse">_</span>
              </span>
            )}
            {step === "password" && (
              <span>
                Password: {"*".repeat(inputValue.length)}
                <span className="animate-pulse">_</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
