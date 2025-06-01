import React, { useState, useRef, useEffect } from "react";

export default function Home() {
  const username = "anupam";
  const hostname = "luffy";
  const startTime = React.useRef(Date.now());

  // Virtual filesystem with some fake files
  const files = {
    "readme.txt": "Welcome to your simulated Arch Linux terminal.\nFeel free to explore.",
    "todo.txt": "- Learn React\n- Build more commands\n- Master Linux shell",
    "notes.md": "# Notes\nThis is a virtual file system for demo purposes.",
  };

  const [history, setHistory] = useState([
    `Welcome to Arch Linux ${new Date().toLocaleString()}`,
    `Last login: ${new Date().toLocaleString()} on tty1`,
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [cwd, setCwd] = useState("~"); // current working directory

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  function getUptime() {
    const diff = Date.now() - startTime.current;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  function runCommand(cmd) {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return "";

    const parts = trimmedCmd.split(" ");
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case "neofetch":
        return `
anupam@luffy
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
        `.trim();

      case "clear":
        setHistory([]);
        return "";

      case "ls":
        // List all files in the current directory (cwd is always "~" for now)
        return Object.keys(files).join("  ");

      case "pwd":
        return cwd;

      case "cat":
        if (args.length === 0) return "Usage: cat [filename]";
        const fileName = args[0];
        if (files[fileName]) {
          return files[fileName];
        } else {
          return `cat: ${fileName}: No such file or directory`;
        }

      case "whoami":
        return username;

      case "uptime":
        return `up ${getUptime()}`;

      case "history":
        return history
          .filter((line) => line.startsWith(`[${username}@${hostname}`))
          .map((line, i) => `${i + 1}  ${line.replace(`[${username}@${hostname} ~]$ `, "")}`)
          .join("\n");

      case "shutdown":
        return "System is shutting down... Goodbye!";

      case "reboot":
        return "System is rebooting... See you soon!";

      default:
        return `${baseCmd}: command not found`;
    }
  }

  function handleInput(e) {
    if (e.key === "Enter") {
      const newHistory = [...history, `[${username}@${hostname} ~]$ ${input}`];

      const result = runCommand(input);
      if (result) newHistory.push(result);

      setHistory(newHistory);
      setInput("");
    }
  }

  return (
    <div
      className="h-screen w-screen bg-black text-green-400 font-mono text-sm p-4"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}

        <div>
          [{username}@{hostname} ~]${" "}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            autoComplete="off"
            spellCheck="false"
            className="bg-black text-green-400 font-mono outline-none border-none p-0 m-0 w-[60ch]"
            style={{ caretColor: "lime" }}
          />
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
