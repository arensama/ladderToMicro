import React from "react";

import "./app.css";
import OverviewFlow from "./ladder";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { themeProvider } from "./themeProvider";
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
      </div>
    </ConfigProvider>
  );
}
