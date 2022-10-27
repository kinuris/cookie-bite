/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { Sidebar } from "../root-components/Sidebar";
import { foreground } from "../Colors";
import { motion } from "framer-motion"

import navMenu from "./../assets/menu_nav.svg"
import logo from "./../assets/logo.svg"
import searchLogo from "./../assets/search.svg"
import { Usernav } from "../root-components/Usernav";
import { Home } from "./Home";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "./Menu";
import { Inventory } from "./Inventory";
import { AboutUs } from "./AboutUs";
import { useState } from "react";
import { ManageMenuItems } from "./ManageMenuItems";

export default function Root() {
    const [loggedIn, setLoggedIn] = useState(false)

    return (
      <div css={css`
        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: row;
      `}>
        <div css={css`
          box-shadow: 7px 0px 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
        `}>
          <nav css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: ${foreground};
            height: 65px;
          `}>

            <Link to="/" css={css`
              display: flex;
              place-items: center;
            `}>
              <motion.img css={css`
                width: 100px;
                margin-top: 3px;
                margin-left: 16px;
              `} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} src={logo} alt="Logo" />
            </Link>

            <img css={css`
              width: 30px;
              margin-right: 16px;
            `} src={navMenu} alt="Nav Menu" />
          </nav>
          <section>
            <Sidebar />
          </section>
        </div>

        <div css={css`
            width: 100%;
            height: 100%;
          `}>
          <nav css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: ${foreground};
            height: 65px;

            section {
              display: flex;
              align-items: center;
              padding: 0 12px;
              font-family: "Montserrat";
              color: white;

              * {
                margin: 0 12px;
              }

              input {
                background-color: ${foreground};
                border: none;
                color: white;
                font-size: 2em;
              }
            }
          `}>
            <section>
              <img css={css`
                width: 30px;
              `} src={searchLogo} alt="Search" />
              <input type="text" name="search" placeholder="Search"/>
            </section>
            <Usernav setLogin={setLoggedIn} />
          </nav>
          <Routes>
            <Route element={<AnimationLayout />}>
              <Route path="/" element={<Home />} /> 
              <Route path="/menu" element={<Menu loggedIn={loggedIn} />} /> 
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/manage-menu-items" element={<ManageMenuItems />} />
            </Route>
          </Routes>
        </div>
      </div>
    );
  }

const AnimationLayout = () => {
  const { pathname } = useLocation()
  return (
    <motion.div
      style={{ height: 'calc(100% - 65px)' }}
      key={pathname}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Outlet />
    </motion.div>
  )
}