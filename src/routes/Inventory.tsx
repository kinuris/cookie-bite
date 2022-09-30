/**@jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { background2 } from "../Colors"

export function Inventory() {
    return (
        <section css={css`
            /* height: 100%; */
            background-color: ${background2};
          `}>
            <p>Inventory</p>
        </section>
    )
}