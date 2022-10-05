/**@jsxImportSource @emotion/react */

import { useLazyQuery, useMutation } from "@apollo/client"
import { css } from "@emotion/react"
import gql from "graphql-tag"
import { useEffect, useRef, useState } from "react"
import { background, foreground } from "../Colors"
import { Food, FoodVariants } from "../vite-env"

const REGISTER_FOOD_AND_VARIANTS = gql`
    mutation RegisterFoodAndVariants($foodAndVariants: RegisterFoodAndVariants!) {
        registerFoodAndVariants(foodAndVariants: $foodAndVariants) {
            price
        }
    }
`

export function ManageMenuItems() {
    const [stagedFoods, setStagedFoods] = useState<{ food: Food, variants: FoodVariants[] }[]>([])
    const [selectedFood, setSelectedFood] = useState<number>()
    const [registerFoodAndVariants] = useMutation(REGISTER_FOOD_AND_VARIANTS)
    
    const foodForm = useRef<HTMLFormElement>(null)
    const foodVariantForm = useRef<HTMLFormElement>(null)
    const commitAllFoods = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const foodInputForm = foodForm.current as HTMLFormElement
        const foodVariantInputForm = foodVariantForm.current as HTMLElement
        const commitAllFoodsForm = commitAllFoods.current as HTMLInputElement

        async function handleCommitAllFoods(event: MouseEvent) {
            event.preventDefault()

            if(stagedFoods.length === 0) {
                alert("Must have staged Foods")
                return
            }

            await Promise.all(stagedFoods.map(async ({ food, variants }) => {
                console.log(typeof variants[0].price)

                await registerFoodAndVariants({ variables: {
                    foodAndVariants: {
                        food,
                        variants
                    }
                }})
            }))
        }

        function handleFoodForm(event: SubmitEvent) {
            event.preventDefault()

            const target = event.target as any
            const name = target["food-name"].value as string
            const imageLink = target["image-link"].value as string

            setStagedFoods([...stagedFoods, {
                food: {
                    imageLink,
                    name
                },
                variants: []
            }])
        }

        function handleFoodVariantForm(event: SubmitEvent) {
            event.preventDefault()

            const target = event.target as any
            const variantName = target["variant-name"].value as string
            const price = Number(target["price"].value)

            if (selectedFood === undefined) {
                alert("Select Existing Food")
                return
            }

            const stagedFood = stagedFoods[selectedFood]
            stagedFood.variants.push({
                name: variantName,
                price
            })

            setStagedFoods([...stagedFoods.slice(0, selectedFood), {
                food: stagedFood.food,
                variants: stagedFood.variants
            }, ...stagedFoods.slice(selectedFood + 1)])
        }

        foodInputForm.addEventListener("submit", handleFoodForm)
        foodVariantInputForm.addEventListener("submit", handleFoodVariantForm)
        commitAllFoodsForm.addEventListener("click", handleCommitAllFoods)

        return () => {
            foodInputForm.removeEventListener("submit", handleFoodForm)
            foodVariantInputForm.removeEventListener("submit", handleFoodVariantForm)
            commitAllFoodsForm.removeEventListener("click", handleCommitAllFoods)
        }
    })

    return (
        <div>
            <section css={css`
                height: calc(300px);
                padding: 1em;
                margin-bottom: 20px;
                background-color: ${background};
                overflow: auto;
            `} id="top">
                {stagedFoods.map(({ food, variants }, index) => {
                    return (
                        <div key={food.name + index} css={css`
                            display: flex;
                            place-items: center;
                            height: 50px;
                            background-color: ${selectedFood === index ? foreground : background};
                            font-family: "Montserrat";
                            border-radius: 10px;
                            margin: 4px;
                            padding: 4px;

                            transition: all 0.2s;

                            :hover {
                                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            }

                            * {
                                margin: 0 0.2em;
                            }
                        `} onClick={() => setSelectedFood(index)}>
                            <h1>{food.name}</h1>
                            <img css={css`
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                            `} src={food.imageLink} alt={food.name} />
                            {variants.map(variant => {
                                return (
                                    <h4>{variant.name} - {variant.price}</h4>
                                )
                            })}
                        </div>
                    )
                })}

                {/* <div css={css`
                    display: flex;
                    place-items: center;
                    height: 50px;
                    * {
                        margin: 0 0.2em;
                    }
                `}>
                    <h1>Beef</h1>
                    <img css={css`
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    `} src="https://picsum.photos/50/50" alt="Sample" />
                    <h4>small - 400Php</h4>
                </div> */}
            </section>
            <section css={css`
                display: flex;
                justify-content: space-evenly;

                form {
                    display: flex;
                    flex-direction: column;
                    width: 35%;
                }
            `} id="bottom">
                <form id="food" ref={foodForm}>
                    <input type="text" name="food-name" placeholder="Food Name" required />
                    <input type="url" name="image-link" placeholder="Food Image URL" required  />
                    <input type="submit" value="Stage Food" />
                    <br />
                    <input type="button" value="Delete Food" onClick={() => {
                        if(selectedFood !== undefined) {
                            setStagedFoods([...stagedFoods.slice(0, selectedFood), ...stagedFoods.slice(selectedFood + 1)])
                        } else {
                            alert("Select Existing Food to Delete")
                        }
                    }} />
                    <input type="button" value="Delete All Foods"  onClick={() => {
                        setStagedFoods([])
                    }} />
                    <br />
                    <input type="button" ref={commitAllFoods} value="Commit Food And Its Variants" />
                </form>
                <form id="food-variants" ref={foodVariantForm}>
                    <input type="text" name="variant-name" placeholder="Variant Name" required />
                    <input type="number" name="price" placeholder="Variant Price" required />
                    <input type="submit" value="Add Variant to Selected Food" />
                    <br />
                    <input type="button" value="Pop Variant" onClick={() => {
                        if(selectedFood !== undefined) {
                            const stagedFood = stagedFoods[selectedFood]
                            stagedFood.variants.pop()

                            setStagedFoods([...stagedFoods.slice(0, selectedFood), {
                                food: stagedFood.food,
                                variants: stagedFood.variants
                            }, ...stagedFoods.slice(selectedFood + 1)])
                        } else {
                            alert("Select Existing Food to Delete")
                        }
                    }} />
                </form>
            </section>
        </div>
    )
}