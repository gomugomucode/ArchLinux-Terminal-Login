

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const bootMessages = [
  "[    0.000000] Initializing cgroup subsys cpuset",
  "[    0.000000] Initializing cgroup subsys cpu",
  "[    0.000000] Linux version 6.8.2-arch (archuser@build)",
  "[    0.000000] BIOS-provided physical RAM map:",
  "[    0.032000] ACPI: Core revision 20240217",
  "[    1.632034] systemd[1]: Starting Journal Service...",
  "[    1.692541] systemd[1]: Mounted /boot.",
  "[    2.010112] Starting NetworkManager...             [  OK  ]",
  "[    2.101332] Starting Login Service...              [  OK  ]",
  "[    2.301245] Reached target Multi-User System.",
  "[    2.401832] Started Update UTMP about System Runlevel Changes.",
  "[    2.592001] archlinux tty1",
];

export default function Boot() {
  const [lines, setLines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setLines((prev) => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => navigate("/login"), 1000); // Redirect to login after boot
      }
    }, 150);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="bg-black text-green-400 h-screen overflow-hidden font-mono p-4">
      <div className="animate-pulse text-xs h-full overflow-y-auto">
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
    </div>
  );
}
