import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from "react-toastify";

import "./App.css";
import Home from "./pages/Home";
import ExcelFileUpload from "./pages/ExcelFileUpload/ExcelFileUpload";


const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExcelFileUpload />} />
          <Route path="/create-ad-posts" element={<Home />} />

        </Routes>
        <ToastContainer autoClose={8000} />
      </BrowserRouter>
  );
};

export default App;
