import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from "react-toastify";

import "./App.css";
import Home from "./pages/Home";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

        </Routes>
        <ToastContainer autoClose={8000} />
      </BrowserRouter>
  );
};

export default App;
