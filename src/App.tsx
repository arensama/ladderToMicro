import React from "react";

import "./app.css";
import OverviewFlow from "./ladder";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { themeProvider } from "./themeProvider";
import Ladder2Logic from "./ladder2logic";
export default function App() {
  return (
    <ConfigProvider
      // direction="rtl"
      // @ts-ignore
      // locale={locale}
      theme={themeProvider}
    >
      <div className="App">
        <OverviewFlow />
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            top: 200,
            background: "red",
          }}
        >
          <Ladder2Logic />
        </div>
      </div>
    </ConfigProvider>
  );
}
