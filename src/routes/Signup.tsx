/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { background, foreground, textcolor } from "../Colors"
import { useLazyQuery } from "@apollo/client"
import { URI } from "../main"
import gql from "graphql-tag"

import logo from "./../assets/logo.svg"

const CHECK_USERNAME_AND_EMAIL = gql`
    query GetUserData($email: String!, $username: String!) {
        isAvailableEmail(email: $email)
        isAvailableUsername(username: $username)
    }
`

export function Signup() {
    const signupForm = useRef<HTMLFormElement>(null)
    const [checkUsernameEmail] = useLazyQuery(CHECK_USERNAME_AND_EMAIL)

    useEffect(() => {
        const signup = signupForm.current as HTMLFormElement

        async function onSubmitHandler(event: SubmitEvent) {
            event.preventDefault()

            const target = event.target as any
            const email = target.email.value
            const username = target.username.value
            const { data } = await checkUsernameEmail({ variables: { email, username }})
            const { isAvailableEmail, isAvailableUsername } = data
            
            if (!isAvailableEmail) {
                alert("Email already taken!")
                return
            }

            if (!isAvailableUsername) {
                alert("Username already taken!")
                return
            }

            const password = target.password.value
            const profileImageLink = target["profile-image-link"].value

            const result = await fetch(URI + '/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    profile_img_link: profileImageLink
                })
            })

            const state = await result.text()
            if (result.status === 200) {
                alert("You have successfully signed up")
                document.location.replace("/cookie-bite/login")
            } else {
                alert(state)
            }
        }

        signup.addEventListener("submit", onSubmitHandler)

        return () => {
            signup.removeEventListener("submit", onSubmitHandler)
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
                <h1>USER SIGNUP</h1>
                <form ref={signupForm} css={css`
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
                    <input type="text" name="username" placeholder="Username" required/>
                    <input type="email" name="email" placeholder="Email Address" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <input type="url" name="profile-image-link" placeholder="Proile Picture Link" />
                    <hr />
                    <motion.input css={css`
                        color: white;
                        background-color: ${foreground} !important;
                        padding: 0.4em 2em !important;
                        width: fit-content !important;
                    `} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" value="Sign Up" />
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