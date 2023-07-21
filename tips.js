import { useState } from "react";
import { exec } from "child_process";

function App() {
  const [output, setOutput] = useState("");

  const runCommand = () => {
    exec("ls", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      setOutput(stdout);
    });
  };

  return (
    <div>
      <button onClick={runCommand}>Run Command</button>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
