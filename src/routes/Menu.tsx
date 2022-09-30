/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { background2 } from "../Colors"

export function Menu() {
    return (
        <section css={css`
            /* height: 100%; */
            background-color: ${background2};
          `}>
            <p>Menu</p>
        </section>
    )
}