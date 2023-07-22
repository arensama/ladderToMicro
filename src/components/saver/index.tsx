import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import useStoreFiles from "../../storage/useStoreFiles";
import { shallow } from "zustand/shallow";
const Saver = () => {
  // fs.writeFileSync("hello.c", code);
  const [logic_c, logic_h, main_c, setStoreFiles] = useStoreFiles(
    (state) => [state.logic_c, state.logic_h, state.main_c, state.setState],
    shallow
  );
  console.log("main.c1", main_c);
  const handleSave2 = (data: string) => {
    save(`${data}/Core/Src/main.c`, main_c);
    save(`${data}/Core/Src/logic.c`, logic_c);
    save(`${data}/Core/Src/logic.h`, logic_h);
  };
  const { IO, emit, save } = useSocket();
  useEffect(() => {
    IO.on("location", function (data) {
      console.log("received front: " + data);
      setStoreFiles([
        {
          key: "projectLocation",
          value: data,
        },
      ]);
      handleSave2(data);
    });
    return () => {
      IO.off("location");
    };
  }, [main_c]);
  const handleSave = async () => {
    emit("getLocation", "salam");
  };
  return (
    <div>
      <button onClick={handleSave}>Save As</button>
    </div>
  );
};
export default Saver;
