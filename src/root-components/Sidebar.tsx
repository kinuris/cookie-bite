/**@jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { background, backgroundMenuItem, foreground, textcolor } from "../Colors";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"

import homeLogo from "./../assets/home.svg"
import menuLogo from "./../assets/menu.svg"
import cartLogo from "./../assets/cart.svg"
import inventoryLogo from "./../assets/inventory.svg"
import aboutusLogo from "./../assets/about_us.svg"
import rightArrow from "./../assets/right_arrow.svg"
import { Link } from "react-router-dom";
import { useState } from "react";


export function Sidebar() {
    const [menuActive, setMenuActive] = useState(false)
    const [inventoryActive, setInventoryActive] = useState(false)

    return (
        <ul css={css`
            list-style-type: none;
            width: 260px;
            padding: 0;

            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: ${background};
                margin: 12px;
                padding: 16px;
                font-family: "Montserrat";
                border-radius: 5px;

                section {
                    display: flex;
                    align-items: center;

                    p {
                        color: ${textcolor};
                        font-size: 1em;
                    }
    
                    img {
                        width: 30px;
                        margin-right: 16px;
                        transform: none;
                    }
    
                }
                
                :hover {
                    box-shadow: -5px 0px ${foreground};
                }

                img {
                    width: 8px;
                }
            }
            `}>
            <LayoutGroup>
                <Link key="Home" to="/" style={{ textDecoration: 'none' }}>
                    <motion.li>
                        <motion.section>
                            <motion.img src={homeLogo} alt="Home" />
                            <motion.p>Home</motion.p>
                        </motion.section>
                    </motion.li>
                </Link>
                <Link key="Menu" to="/menu" style={{ textDecoration: 'none' }}>
                    <motion.li layout>
                        <motion.section>
                            <motion.img src={menuLogo} alt="Menu" />
                            <motion.p>Menu</motion.p>
                        </motion.section>
                        <motion.img whileHover={{ scale: 1.3 }} initial={{ rotateZ: 90 }} animate={{ rotateZ: menuActive ? 270 : 90 }} src={rightArrow} alt="Expand" onClick={() => setMenuActive(!menuActive)} />
                    </motion.li>
                </Link>
                <AnimatePresence>
                    {menuActive && (
                        <>
                            <motion.li layout initial={{ opacity: 0, backgroundColor: backgroundMenuItem }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <section>
                                    <p>{">"} Cookies</p>
                                </section>
                            </motion.li>
                            <motion.li layout initial={{ opacity: 0, backgroundColor: backgroundMenuItem }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <section>
                                    <p>{">"} Beverages</p>
                                </section>
                            </motion.li>
                        </>
                    )}
                </AnimatePresence>
                <Link key={"Order & Invoice"} to="/order_and_invoice" style={{ textDecoration: 'none' }}>
                    <motion.li layout>
                        <section>
                            <img src={cartLogo} alt={"Order & Invoice"} />
                            <p>{"Order & Invoice"}</p>
                        </section>
                        <motion.img whileHover={{ scale: 1.3 }} initial={{ rotateZ: 90 }} src={rightArrow} alt="Expand" />
                    </motion.li>
                </Link>
                <Link key="Inventory" to="/inventory" style={{ textDecoration: 'none' }}>
                    <motion.li layout>
                        <section>
                            <img src={inventoryLogo} alt="Inventory" />
                            <p>Inventory</p>
                        </section>
                        <motion.img whileHover={{ scale: 1.3 }} initial={{ rotateZ: 90 }} animate={{ rotateZ: inventoryActive ? 270 : 90 }} src={rightArrow} alt="Expand" onClick={() => setInventoryActive(!inventoryActive)} />
                    </motion.li>
                </Link>
                <Link key="About" to="/about" style={{ textDecoration: 'none' }}>
                    <motion.li layout>
                        <section>
                            <img src={aboutusLogo} alt="About us" />
                            <p>About us</p>
                        </section>
                    </motion.li>
                </Link>
            </LayoutGroup>
        </ul>
    )
}