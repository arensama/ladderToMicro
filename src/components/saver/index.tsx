import fs from "fs";
import { useState } from "react";
const Saver = () => {
  //   fs.writeFileSync("hello.c", code);

  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
};
export default Saver;
