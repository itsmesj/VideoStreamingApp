import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import StartingPage from "./pages/StartingPage";
import UpdateVideo from "./components/UpdateVideo";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/" element={<StartingPage />}></Route>

          <Route path="/update/:id" element={<UpdateVideo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
