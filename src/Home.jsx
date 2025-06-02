import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const username = "anupam";
  const hostname = "luffy";

  const startTime = useRef(Date.now());

  // Virtual filesystem (static for now)
  const files = {
    "readme.txt": "Welcome to your simulated Arch Linux terminal.\nFeel free to explore.",
    "todo.txt": "- Learn React\n- Build more commands\n- Master Linux shell",
    "notes.md": "# Notes\nThis is a virtual file system for demo purposes.",
  };

  // Prompts: Each prompt has input and output lines
  const [prompts, setPrompts] = useState([{ input: "", output: [], id: 0 }]);

  // Command history for up/down arrow navigation
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Current working directory (static ~ for now)
  const [cwd] = useState("~");

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input on prompts change
  useEffect(() => {
    inputRef.current?.focus();
  }, [prompts]);

  // Scroll terminal to bottom on history change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [prompts]);

  // Uptime calculation
  function getUptime() {
    const diff = Date.now() - startTime.current;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Supported commands for tab completion
  const supportedCommands = [
    "neofetch", "echo", "date", "help", "clear", "ls",
    "pwd", "cat", "whoami", "uptime", "history", "shutdown", "reboot", "exit"
  ];

  // Main command handler
  function runCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return "";

    const parts = trimmed.split(" ");
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case "neofetch":
        return `
${username}@${hostname}
------------
OS: Arch Linux x86_64
Kernel: 6.8.2
Uptime: ${getUptime()}
Packages: 1200 (pacman)
Shell: bash
Resolution: 1366x768
WM: Hyperland
Terminal: tty1
CPU: AMD E1 (2) @ 1.4GHz
Memory: 450MiB / 1992MiB
        `.trim();

      case "echo":
        return args.join(" ").replace(/^["']|["']$/g, "");

      case "date":
        return new Date().toString();

      case "help":
        return `
Supported commands:
- neofetch
- echo [text]
- date
- help
- clear
- ls
- pwd
- cat [filename]
- whoami
- uptime
- history
- shutdown
- reboot
- exit
        `.trim();

      case "clear":
        // Clearing resets prompts to initial state
        setPrompts([{ input: "", output: [], id: 0 }]);
        setCommandHistory([]);
        setHistoryIndex(-1);
        return "";

      case "ls":
        return Object.keys(files).join("  ");

      case "pwd":
        return cwd;

      case "cat":
        if (args.length === 0) return "Usage: cat [filename]";
        const fileName = args[0];
        if (files[fileName]) return files[fileName];
        return `cat: ${fileName}: No such file or directory`;

      case "whoami":
        return username;

      case "uptime":
        return `up ${getUptime()}`;

      case "history":
        return commandHistory
          .map((cmd, i) => `${i + 1}  ${cmd}`)
          .join("\n") || "No commands in history.";

      case "shutdown":
        navigate("/login");
        return "System is shutting down... Goodbye!";

      case "reboot":
        navigate("/login");
        return "System is rebooting... See you soon!";

      case "exit":
        navigate("/login");
        return "Exiting...";

      default:
        return `${baseCmd}: command not found`;
    }
  }

  // Update input in prompts array at index
  function updatePromptInput(index, value) {
    setPrompts(prev =>
      prev.map((p, i) => (i === index ? { ...p, input: value } : p))
    );
  }

  // Handle key events on input
  function handleInput(e, index) {
    const currentPrompt = prompts[index];
    if (e.key === "Enter") {
      e.preventDefault();
      const input = currentPrompt.input.trim();
      const output = input ? runCommand(input).split("\n") : [];

      // Append output and add new prompt line
      setPrompts(prev => [
        ...prev.slice(0, index),
        { ...currentPrompt, output },
        { input: "", output: [], id: prev.length }
      ]);

      // Add to history if command entered
      if (input) {
        setCommandHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
      }

    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      // Move up in history but not below 0
      const newIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
      setHistoryIndex(newIndex);
      updatePromptInput(index, commandHistory[newIndex]);

    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      // Move down in history or clear input if at end
      const newIndex = historyIndex === -1 ? -1 : Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      updatePromptInput(index, newIndex === -1 ? "" : commandHistory[newIndex]);

    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = supportedCommands.find(cmd => cmd.startsWith(currentPrompt.input));
      if (match) {
        updatePromptInput(index, match);
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap">
        <div>
          Welcome to Arch Linux {new Date().toLocaleString()}
          <br />
          Last login: {new Date().toLocaleString()} on tty1
          <br /><br />
        </div>

        {prompts.map((prompt, i) => (
          <div key={prompt.id} className="mb-1">
            <div>
              [{username}@{hostname} ~]${" "}
              <input
                ref={i === prompts.length - 1 ? inputRef : null}
                type="text"
                value={prompt.input}
                onChange={e => updatePromptInput(i, e.target.value)}
                onKeyDown={e => handleInput(e, i)}
                autoComplete="off"
                spellCheck="false"
                className="bg-black text-green-400 font-mono outline-none border-none p-0 m-0 w-[60ch]"
                style={{ caretColor: "lime" }}
                aria-label="terminal command input"
              />
              <span className="animate-pulse">_</span>
            </div>
            {prompt.output.map((line, j) => (
              <div key={j}>{line}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



