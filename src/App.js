import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthProvider";
import Pages from "./Pages";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Pages />
      </AuthProvider>
    </BrowserRouter>
  );
}
