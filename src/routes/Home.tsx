/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { background2, foreground } from "../Colors"
import { useRef, useState } from "react"

import rightArrow from "./../assets/right_arrow_white.svg"
import homepageCoffee from "./../assets/homepagecoffee.jpg"
import ReactPaginate from "react-paginate"
import { HashLoader } from "react-spinners"

const urls = [
    homepageCoffee,
    'https://picsum.photos/1280/721',
    'https://picsum.photos/1280/722',
    'https://picsum.photos/1280/723',
    'https://picsum.photos/1280/724',
    'https://picsum.photos/1280/725'
]

export function Home() {
    const [selectedPage, changeSelectedPage] = useState(3)
    const [loading, setLoading] = useState(true)
    const counter = useRef(0)

    function checkImageLoaded() {
        counter.current++
        if (counter.current >= urls.length) {
            setLoading(false)
        }
    }

    return (
        <section css={css`
            height: 100%;
            background-color: ${background2};
            display: flex;
            justify-content: center;
            position: relative;

            ---upper-part-percentage: 60%;
          `}>
            <>
                <div css={css`
                    display: ${loading ? 'flex' : 'none'};
                    background-color: rgba(0, 0, 0, 0.02);
                    border-radius: 5px;
                    justify-content: center;
                    place-items: center;
                    margin-top: 4em;
                    width: calc(100% - 8em);
                    height: calc(var(---upper-part-percentage) - 4em);
                `}>
                    <HashLoader color={foreground} size="150px" cssOverride={{ height: '60%' }} />
                </div>
                <div css={css`
                    display: ${loading ? 'none' : 'flex'};
                    justify-content: center;
                 
                    width: calc(100% - 8em);
                    height: var(---upper-part-percentage);
                `}>
                    {urls.map((url, index) => <img css={css`
                        display: ${selectedPage === index ? 'block' : 'none'};
                        object-fit: cover;
                        width: 100%;
                        margin-top: 4em;
                        box-shadow: 0px 0px 10px grey;
                        user-select: none;
                        border-radius: 5px;
                    `} src={url} key={index} onLoad={checkImageLoaded} />)}
                </div>
            </>
            <ReactPaginate 
                css={css`
                    position: absolute;
                    padding: 0;
                    top: calc(var(---upper-part-percentage) - 4em - 70px);
                    width: 100%;
                    list-style-type: none;
                    display: ${loading ? 'none' : 'flex'};
                    justify-content: space-evenly;

                    @media screen and (max-height: 720px) {
                        top: calc((var(---upper-part-percentage)/2) - 2em);
                    }


                    .previous {
                        transform: rotateZ(180deg);

                        :hover {
                            transform: scale(1.3) rotateZ(180deg);
                        }
                    }

                    .next {
                        :hover {
                            transform: scale(1.3);
                        }
                    }

                    .previous, .next {
                        display: flex;

                        a {
                            display: inherit;

                            img {
                                width: 25px
                            }
                        }

                        font-family: "Montserrat";
                        color: black;
                        user-select: none;
                        font-size: 3em;
                        margin: 1em;
                        transition: all 0.2s;
                    }

                    li {
                        display: none;
                    }
                `}
                pageCount={6}
                breakLabel="..."
                nextLabel={<img src={rightArrow} alt="Next"/>}
                previousLabel={<img src={rightArrow} alt="Previous"/>}
                initialPage={selectedPage}
              
                renderOnZeroPageCount={undefined}
                onPageChange={({ selected }) => changeSelectedPage(selected)}
            />
        </section>
    )
}