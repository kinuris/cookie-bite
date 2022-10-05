/**@jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { background, foreground, textcolor } from "../Colors";
import { motion } from "framer-motion"

import homeLogo from "./../assets/home.svg"
import menuLogo from "./../assets/menu.svg"
import cartLogo from "./../assets/cart.svg"
import inventoryLogo from "./../assets/inventory.svg"
import aboutusLogo from "./../assets/about_us.svg"
import rightArrow from "./../assets/right_arrow.svg"
import { Link } from "react-router-dom";


export function Sidebar() {
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
            <Link to="/" style={{ textDecoration: 'none' }}>
                <li>
                    <section>
                        <img src={homeLogo} alt="Home" />
                        <p>Home</p>
                    </section>
                </li>
            </Link>
            <Link to="/menu" style={{ textDecoration: 'none' }}>
                <li>
                    <section>
                        <img src={menuLogo} alt="Menu" />
                        <p>Menu</p>
                    </section>
                    <motion.img initial={{ rotateZ: 90 }} src={rightArrow} alt="Expand" />
                </li>
            </Link>
            <li>
                <section>
                    <img src={cartLogo} alt="Order & Invoice" />
                    <p>Order & Invoice</p>
                </section>
                <motion.img initial={{ rotateZ: 90 }} src={rightArrow} alt="Expand" />
            </li>
            <Link to="/inventory" style={{ textDecoration: 'none' }}>
                <li>
                    <section>
                        <img src={inventoryLogo} alt="Inventory" />
                        <p>Inventory</p>
                    </section>
                    <motion.img initial={{ rotateZ: 90 }} src={rightArrow} alt="Expand" />
                </li>
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
                <li>
                    <section>
                        <img src={aboutusLogo} alt="About us" />
                        <p>About us</p>
                    </section>
                </li>
            </Link>
        </ul>
    )
}