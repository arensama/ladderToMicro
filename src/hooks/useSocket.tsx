import { useContext, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";
import { Socket } from "socket.io";
import { io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IoContext, IoDispatcherContext } from "../providers/ioProvider";

export const useSocket = () => {
  const setIO = useContext(IoDispatcherContext);
  const IO = useContext(IoContext);
  useEffect(() => {
    IO.on("connect", () => {
      console.log("connect");
    });
    IO.on("error", (error) => {
      console.log("er2r", error);
    });
    IO.on("connect_error", (err) => {
      console.log("err", err.name, err.cause, err.message, err.stack);
    });
    IO.on("disconnect", () => {
      console.log("disconnect");
    });

    return () => {
      if (IO) {
        IO.off("connect");
        IO.off("error");
        IO.off("connect_error");
        IO.off("disconnect");
      }
    };
  }, [IO]);
  const emit = (url: string, data: any = {}) =>
    new Promise(async (resolve, reject) => {
      try {
        IO?.emit(url, data, (res: any) => {
          if (res?.status == "success") return resolve(res);
          return reject(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  const save = (location: string, data: string) => {
    emit("saveToLocation", {
      location,
      data,
    });
  };
  return { save, IO, emit };
};
