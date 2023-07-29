import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import useStoreFiles from "../../storage/useStoreFiles";
import { shallow } from "zustand/shallow";
import { Button } from "antd";
const SaveCCode = () => {
  // fs.writeFileSync("hello.c", code);
  const [logic_c, logic_h, main_c, setStoreFiles] = useStoreFiles(
    (state) => [state.logic_c, state.logic_h, state.main_c, state.setState],
    shallow
  );
  console.log("main.c1", main_c);
  const handleSave2 = (data: string) => {
    emit("saveToLocation", {
      location: `${data}/Core/Src/main.c`,
      data: main_c,
    });
    emit("saveToLocation", {
      location: `${data}/Core/Src/logic.c`,
      data: logic_c,
    });
    emit("saveToLocation", {
      location: `${data}/Core/Src/logic.h`,
      data: logic_h,
    });
  };
  const { IO, emit } = useSocket();
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
  return <Button onClick={handleSave}>Save As</Button>;
};
export default SaveCCode;
