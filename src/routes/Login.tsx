/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { background, foreground, textcolor } from "../Colors"
import { URI } from "../main"
import logo from "./../assets/logo.svg"

export function Login() {
    const loginForm = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const login = loginForm.current as HTMLFormElement

        async function onSubmitHandler(event: SubmitEvent) {
            event.preventDefault()

            const target = event.target as any
            const email = target.email.value
            const password = target.password.value

            const result = await fetch(URI + '/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            const state = await result.text()
            if (state === "Login successful") {
                document.location.replace("/cookie-bite/")
            } else {
                alert(state)
            }
        }

        login.addEventListener("submit", onSubmitHandler)

        return () => {
            login.removeEventListener("submit", onSubmitHandler)
        }
    }, [])

    return (
        <div css={css`
            height: 100vh;
            display: flex;
            place-items: center;
            justify-content: space-between;
            font-family: "Montserrat";
            color: ${textcolor};
        `}>
            <div css={css`
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding: 0 6em;

                @media screen and (max-width: 1280px) {
                    padding: 0 3em;
                }

                h1 {
                    text-align: center;
                    margin: 1em 0;
                    letter-spacing: 6px;
                }
            `}>
                <h1>USER LOGIN</h1>
                <form ref={loginForm} css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    input {
                        border: none;
                        background-color: ${background};
                        font-size: 1.2em;
                        width: 100%;
                        max-width: 440px;
                        border-radius: 999px;
                        padding: 0.7em 1em;
                        margin: 0.3em;
                    }

                    hr {
                        width: 100%;
                        margin: 1em 0;
                        max-width: 520px;
                    }
                `}>
                    <input type="email" name="email" placeholder="Email Address" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <hr />
                    <motion.input css={css`
                        color: white;
                        background-color: ${foreground} !important;
                        padding: 0.4em 2em !important;
                        width: fit-content !important;
                    `} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" value="Sign In" />
                </form>
            </div>
            <div css={css`
                display: flex;
                flex-direction: column;
                place-items: center;
                justify-content: center;

                background-color: ${foreground};
                height: 100%;
                width: 100%;
                max-width: 580px;
                padding: 0 2em;

                @media screen and (max-width: 1160px) {
                    max-width: 450px;
                }

                img {
                    width: 540px;

                    @media screen and (max-width: 1160px) {
                        width: 450px;
                    }   
                }

                h1 {
                    color: white;
                    font-size: 3.5em;
                    margin-bottom: 0.5em;
                    letter-spacing: 6px;

                    @media screen and (max-width: 1160px) {
                        font-size: 2.8em;
                    }   
                }

                p {
                    font-size: 2.5em;
                    text-align: center;
                    letter-spacing: 3px;

                    @media screen and (max-width: 1160px) {
                        font-size: 2em;
                    }   
                }
            `}>
                <img src={logo} alt="Logo" />
                <h1>WELCOME!</h1>
                <p>Grab your cookie with Cookie Bite</p>
            </div>
        </div>
    )
}