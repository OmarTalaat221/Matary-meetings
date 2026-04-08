// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/index.css";

function App() {
  return (
    <ConfigProvider
      direction="ltr"
      locale={enUS}
      theme={{
        token: {
          colorPrimary: "#5046c4",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: 8,
        },
        components: {
          Table: {
            headerBg: "#f8fafc",
            headerColor: "#374151",
            rowHoverBg: "#f0f0ff",
          },
          Input: {
            borderRadius: 8,
          },
          Button: {
            borderRadius: 8,
          },
          Modal: {
            borderRadius: 12,
          },
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
