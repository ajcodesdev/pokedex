import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import SearchedPokemon from "./pages/SearchedPokemon";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path={"/"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />

          {/* Protected routes */}
          <Route
            path={"/home"}
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path={"/home/:pokemon"}
            element={<ProtectedRoute element={<SearchedPokemon />} />}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
