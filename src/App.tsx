import React from "react";

import "./app.css";
import OverviewFlow from "./ladder";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { themeProvider } from "./themeProvider";
import Compiler from "./components/compiler";
import Debugger from "./components/debugger";
import Navbar from "./components/navbar";
import { IoProvider } from "./providers/ioProvider";
export default function App() {
  return (
    <IoProvider>
      <ConfigProvider
        // direction="rtl"
        // @ts-ignore
        // locale={locale}
        theme={themeProvider}
      >
        <div className="App">
          <Navbar />
          <OverviewFlow />
          <Compiler />
          <Debugger />
        </div>
      </ConfigProvider>
    </IoProvider>
  );
}
