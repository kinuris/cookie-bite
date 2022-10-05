/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { useQuery } from "@apollo/client"
import { motion } from "framer-motion"
import { User, UsernavProps } from "../vite-env"
import { Link } from "react-router-dom"

import gql from "graphql-tag"
import rightArrow from "./../assets/right_arrow.svg"
import userdefaultLogo from "./../assets/user_default_profile.svg"
import { RefObject, useEffect, useRef, useState } from "react"
import { background, foreground, textcolor } from "../Colors"
import { URI } from "../main"
import { SyncLoader } from "react-spinners"
import useComponentVisible from "../custom-hooks/useComponentVisible"

const FETCH_USERDATA = gql`
    query FetchUserdata {
        getUserData {
            userID
            email
            admin
            username
            profileImageLink
        }
    }
`

export function Usernav({ setLogin, setCurrentUser }: UsernavProps) {
    const { loading, error, data } = useQuery<{ getUserData: User }>(FETCH_USERDATA)

    if (loading) {
        return <SyncLoader color={background} size={10} cssOverride={{ marginRight: '2em' }} />
    }

    if (error) {
        return <h3>Error</h3>
    }

    const user = data?.getUserData

    if (user != null) {
        setLogin(true)
    }

    return (
        <section>
            <img css={css`
                width: 40px;
                border-radius: 50%;
            `} src={user?.profileImageLink ? user.profileImageLink : userdefaultLogo} alt="Profile" />
            <motion.div css={css`
                display: flex;
                place-items: center;
                margin: 0 !important;

                p {
                    margin: 0 !important;
                }
            `} whileHover={{ cursor: 'pointer' }}>
                {
                    user ? 
                    <>
                        <p>{user?.username}</p>
                        <MyDropDown user={user as User} />
                    </>
                    : 
                    <>
                        <Link to="/login" style={{ textDecoration: 'none', margin: 0, color: 'white' }}>
                            <motion.p whileHover={{ scale: 1.1 }}>Log In</motion.p>
                        </Link>
                        <p css={css`color: ${textcolor}; font-size: 2em;`}>|</p>
                        <Link to="/signup" style={{ textDecoration: 'none', margin: 0, color: 'white' }}>
                            <motion.p whileHover={{ scale: 1.1 }}>Sign up</motion.p>
                        </Link>
                    </>
                }
            </motion.div>
        </section>
    )
}

function MyDropDown({ user }: { user: User }) {
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

    const logout = useRef<HTMLLIElement>(null)
   
    useEffect(() => {
        const logoutBtn = logout.current as HTMLLIElement
        const clearAll = async () => {
            await fetch(URI + "/clear-all", { method: 'POST' })

            alert("Logging Out")
            document.location.replace("/cookie-bite/")
        }

        logoutBtn.addEventListener('click', clearAll)
        return () => {
            logoutBtn.removeEventListener('click', clearAll)
        }
    }, [isComponentVisible])

    return (
        <div ref={ref as RefObject<HTMLDivElement> | undefined}>
            <motion.img css={css`
                margin: 0 !important;
                padding: 12px !important;
            `} initial={{ rotateZ: 90, scale: 0.5 }} animate={isComponentVisible ? { rotateZ: 270 } : { rotateZ: 90 } } whileHover={{ scale: 0.6 }} src={rightArrow} onClick={() => setIsComponentVisible(!isComponentVisible)} alt="DropDown" />

            <motion.div
                    initial={{ x: 250 }}
                    transition={{ ease: "linear", duration: 0.15 }}
                    animate={isComponentVisible ? { x: 0 } : { x: 250 }}
                    css={css`
                        margin: 0 !important; 
                        position: fixed;
                        z-index: 20;
                        top: 65px;
                        right: 0;
                        width: 250px;
                        height: 400px;
                        background-color: ${foreground};
                        border-bottom-left-radius: 8px;
                    `}>
                <motion.ul css={css`
                    margin: 0 !important;
                    padding: 0;
                    list-style-type: none;

                    li {
                        margin: 0;
                        padding: 10px;
                        color: white;

                        :hover {
                            color: ${textcolor};
                            background-color: ${background};
                        }
                    }
                `}>
                    {user?.admin && <Link to="/manage-menu-items" style={{ textDecoration: 'none', margin: 0 }}>
                        <motion.li>
                            <p>Manage Items (ADMIN)</p>
                        </motion.li>
                    </Link>}
                    <motion.li ref={logout}>
                        <p>Log out</p>
                    </motion.li>
                </motion.ul>
            </motion.div>
        </div>
    )
}