import React, { useState } from "react";
import logo from "../assets/logo.png";
import Button from "./Button";
import LogoutButton from "./LogoutButton";
import "../css/Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  return (
    <header>
      <nav className="maxWidth">
        <img src={logo} alt="logo" />
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to={`/home/${query}`}>
            <Button label={"Search"} />
          </Link>
        </div>
        <LogoutButton />
      </nav>
    </header>
  );
};

export default Header;
