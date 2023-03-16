import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import navbarStyle from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={navbarStyle.navbarContainer}>
      <ul>
        <li className="nav-item">
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            Home
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Navbar;
