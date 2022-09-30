/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { background2 } from "../Colors"

export function AboutUs() {
    return (
        <section css={css`
            /* height: 100%; */
            background-color: ${background2};
          `}>
            <h1>About Us</h1>
        </section>
    )
}