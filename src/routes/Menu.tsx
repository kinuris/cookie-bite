/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { background2, backgroundMenuItem, foreground, textcolor } from "../Colors"
import gql from "graphql-tag"
import { useQuery } from "@apollo/client"
import { HashLoader } from "react-spinners"
import { useRef, useState } from "react"
import { FetchAll, MenuProps } from "../vite-env"

const FETCH_ALL = gql`
    query FetchAll {
        fetchAll {
            itemID
            name
            imageLink
            category
            variants {
                variantName
                price
            }
        }
    }
`

export function Menu({ loggedIn }: MenuProps) {
    const { error, loading, data } = useQuery<FetchAll>(FETCH_ALL)
    const [cart, setCart] = useState<string[]>([])

    return (
        <section css={css`
            height: 100%;
            background-color: ${background2};
            font-family: "Montserrat";
            font-size: 2em;
            color: ${textcolor};

            p {
                padding: 1em;
                text-align: center;
                letter-spacing: 3px;
            }
          `}>
            <p>Menu (Wala pa na categorize)</p>
            <div css={css`
                display: flex;
                padding: 1em 2em;
                flex-wrap: wrap;
                justify-content: ${ loading ? "center" : "space-between"};
            
                @media screen and (max-width: 1280px) {
                    padding: 1em;
                }
            `}>
                {loading && data ? (
                    <HashLoader color={foreground} size="150px" />
                ) : (
                    data?.fetchAll.map(data => {
                        return (
                            <div key={data.name} css={css`
                                display: flex;
                                flex-direction: row;
                                width: fit-content;
                                min-height: 60px;
                                border-radius: 99px;
                                margin: 0.25em;
                                padding: 5px 0;
                                padding-left: 1em;
                                padding-right: 2em;
                                align-items: center;
                                justify-content: start;
                                background-color: ${backgroundMenuItem};

                                h2 {
                                    font-size: 0.5em;
                                }

                                p {
                                    padding: 0;
                                    font-size: 0.5em;
                                    letter-spacing: 1px;
                                    text-align: left;
                                }

                                img {
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 50%;
                                    margin-right: 1em;
                                }
                            `}>
                                <img src={data.imageLink} alt={data.name} />
                                <section css={css`
                                    div {
                                        display: flex;

                                        .check-box {
                                            accent-color: ${backgroundMenuItem};
                                            margin-left: 5px;
                                        }
                                    }
                                `}>
                                    <h2>{data.name}</h2>
                                    {data.variants.map(variant => {
                                        return (
                                            <div key={`${data.itemID}-${variant.variantName}`}>
                                                <p>{variant.variantName} ₱{variant.price}</p>
                                                <input type="checkbox" checked={loggedIn ? undefined : false} className="check-box" 
                                                onChange={() => {
                                                    if(!loggedIn) {
                                                        alert("Must be logged in")
                                                        return
                                                    }

                                                    if (!cart.includes(`${data.itemID}-${variant.variantName}`)) {
                                                        cart.push(`${data.itemID}-${variant.variantName}`)

                                                        setCart(cart)
                                                    } else {
                                                        const index = cart.indexOf(`${data.itemID}-${variant.variantName}`)

                                                        cart.splice(index, 1)
                                                        setCart(cart)
                                                    }
                                                }} />
                                            </div>
                                        )
                                    })}
                                </section>
                            </div>
                        )
                    })
                )}
            </div>
        </section>
    )
}