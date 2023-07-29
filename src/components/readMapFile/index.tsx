import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import useStoreFiles from "../../storage/useStoreFiles";
import { shallow } from "zustand/shallow";
import { Button, Col, Modal, Row } from "antd";
import useStoreGlobalData from "../../storage/useStoreGlobalData";
const ReadMapFile = () => {
  const [
    logic_c,
    logic_h,
    main_c,
    projectName,
    projectLocation,
    inputAdress,
    outputAdress,
    setStoreFiles,
  ] = useStoreFiles(
    (state) => [
      state.logic_c,
      state.logic_h,
      state.main_c,
      state.projectName,
      state.projectLocation,
      state.inputAdress,
      state.outputAdress,
      state.setState,
    ],
    shallow
  );
  const { IO, emit } = useSocket();
  const [mapModal, setGlobalData] = useStoreGlobalData(
    (state) => [state.mapModal, state.setState],
    shallow
  );
  // const handleReadMapfile = () => {
  //   emit("openMapFile", {
  //     location: `${projectLocation}/Debug/${projectName}.map`,
  //   });
  // };
  useEffect(() => {
    IO.on("mapfile", function (data) {
      console.log("mapfile : " + data);
      setStoreFiles([
        {
          key: "projectLocation",
          value: data,
        },
      ]);
    });
    IO.on("memoryLocations", function (data) {
      setStoreFiles([
        {
          key: "inputAdress",
          value: data?.inputAdress,
        },
        {
          key: "outputAdress",
          value: data?.outputAdress,
        },
      ]);
    });
    return () => {
      IO.off("mapfile");
      IO.off("memoryLocations");
    };
  }, [main_c]);
  const handleReadMap = async () => {
    emit("openMapFile", {
      location: `${projectLocation}/Debug/${projectName}.map`,
    });
  };
  return (
    <Row>
      <Col>
        <Button onClick={handleReadMap}>Read Map</Button>
      </Col>
      <Col>
        <Button
          onClick={() =>
            setGlobalData([
              {
                key: "mapModal",
                value: true,
              },
            ])
          }
        >
          Show Map
        </Button>
      </Col>
      <Modal
        open={mapModal}
        onCancel={() =>
          setGlobalData([
            {
              key: "mapModal",
              value: false,
            },
          ])
        }
      >
        <Row>
          <Col>{`input address : ${inputAdress}`}</Col>
          <Col>{`output address : ${outputAdress}`}</Col>
        </Row>
      </Modal>
    </Row>
  );
};
export default ReadMapFile;
