import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import navbarStyle from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={navbarStyle.navbarContainer}>
      <ul>
        

        <li className="nav-item">
          <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
            Excel File Uploads
          </Link>
        </li>

        <li className="nav-item">
          <Link to={"/create-ad-posts"} style={{ textDecoration: "none", color: "white" }}>
          Create Ad Posts
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Navbar;
