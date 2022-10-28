/**@jsxImportSource @emotion/react */

import { ApolloQueryResult, useMutation, useQuery } from "@apollo/client"
import { css } from "@emotion/react"
import gql from "graphql-tag"
import { useEffect, useRef, useState } from "react"
import { background, foreground } from "../Colors"
import { FetchAll, FetchAllDirect, FetchAllSingle } from "../vite-env"

const REGISTER_FOOD_AND_VARIANTS = gql`
    mutation RegisterFoodAndVariants($foodAndVariants: RegisterFoodAndVariants!) {
        registerFoodAndVariants(foodAndVariants: $foodAndVariants) {
            price
        }
    }
`

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

const DELETE_FOODS = gql`
    mutation DeleteFoods($deleteFoods: deleteFoods!) {
        deleteFoods(food: $deleteFoods) {
            name
            category
        }
    }
`

export function ManageMenuItems() {
    const [stagedFoods, setStagedFoods] = useState<FetchAllDirect>([])
    const [selectedFood, setSelectedFood] = useState<number>()
    const [foodToMutate, setFoodToMutate] = useState<FetchAllDirect>([])
    const [selectedFoodToMutate, setSelectedFoodToMutate] = useState<number>()
    const [mutatedFoodsToDelete, setMutatedFoodsToDelete] = useState<number[]>([])
    const [registerFoodAndVariants] = useMutation(REGISTER_FOOD_AND_VARIANTS)
    const [deleteFoods] = useMutation(DELETE_FOODS)
    const { data, loading, refetch } = useQuery<FetchAll>(FETCH_ALL)
    
    const foodForm = useRef<HTMLFormElement>(null)
    const foodVariantForm = useRef<HTMLFormElement>(null)
    const mutateFoodForm = useRef<HTMLFormElement>(null)
    const commitAllFoods = useRef<HTMLInputElement>(null)
    const selectFoodCategory = useRef<HTMLSelectElement>(null) 

    function updateStagedFoodsLocalStore(foods: FetchAllDirect) {
        localStorage.setItem("staged-foods", JSON.stringify(foods))
    }

    function updateFoodToMutateFromQuery(data: FetchAll | undefined, loading: boolean) {
        if(!loading && data) {
            const foods = data.fetchAll.map<FetchAllSingle>(({ name, category, imageLink, variants }) => {
                return {
                    food: {
                        category,
                        imageLink,
                        name
                    },
                    variants: variants.map(({ price, variantName }) => {
                        return {
                            price,
                            name: variantName
                        }
                    })
                }
            }) as FetchAllDirect

            setFoodToMutate(foods)
        }
    }

    async function refetchMenu() {
        const { data, loading } = await refetch()

        updateFoodToMutateFromQuery(data, loading)
    }
    
    useEffect(() => {
        updateFoodToMutateFromQuery(data, loading)
    }, [loading])

    useEffect(() => {
        const localStoreStagedFoods = localStorage.getItem("staged-foods")
        const localStoreStagedFoodsIndex = localStorage.getItem("staged-foods-index")

        if(localStoreStagedFoods) {
            setStagedFoods(JSON.parse(localStoreStagedFoods))
        }
        
        if(localStoreStagedFoodsIndex) {
            setSelectedFood(Number(localStoreStagedFoodsIndex))
        }
    }, [])
    
    useEffect(() => {
        const foodInputForm = foodForm.current as HTMLFormElement
        const foodVariantInputForm = foodVariantForm.current as HTMLElement
        const commitAllFoodsForm = commitAllFoods.current as HTMLInputElement
        const selectElement = selectFoodCategory.current as HTMLSelectElement
        const mutateFoodFormInput = mutateFoodForm.current as HTMLFormElement
   
        async function handleCommitAllFoods(event: MouseEvent) {
            event.preventDefault()

            if(stagedFoods.length === 0) {
                alert("Must have staged Foods")
                return
            }

            await Promise.all(stagedFoods.map(async ({ food, variants }) => {
                await registerFoodAndVariants({ variables: {
                    foodAndVariants: {
                        food,
                        variants
                    }
                }})
            }))
            await refetchMenu()
        }

        function handleFoodForm(event: SubmitEvent) {
            event.preventDefault()

            const target = event.target as any
            const name = target["food-name"].value as string
            const imageLink = target["image-link"].value as string
            const category = selectElement.options[selectElement.selectedIndex].value
            
            const newStagedFoods = [...stagedFoods, {
                food: {
                    imageLink,
                    name,
                    category
                },
                variants: []
            }]

            setStagedFoods(newStagedFoods)
            updateStagedFoodsLocalStore(newStagedFoods)
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

            const newStagedFoods = [...stagedFoods.slice(0, selectedFood), {
                food: stagedFood.food,
                variants: stagedFood.variants
            }, ...stagedFoods.slice(selectedFood + 1)]

            setStagedFoods(newStagedFoods)
            updateStagedFoodsLocalStore(newStagedFoods)
        }

        async function handleMutateFoodForm(event: SubmitEvent) {
            event.preventDefault()

            const foodsToDelete = mutatedFoodsToDelete.map(val => {
                return foodToMutate[val]
            })

            setMutatedFoodsToDelete([])

            await deleteFoods({
                variables: {
                    deleteFoods: {
                        foods: foodsToDelete.map(fetchAllSingle => fetchAllSingle.food)
                    }
                }
            })
            await refetchMenu()
        }

        foodInputForm.addEventListener("submit", handleFoodForm)
        foodVariantInputForm.addEventListener("submit", handleFoodVariantForm)
        commitAllFoodsForm.addEventListener("click", handleCommitAllFoods)
        mutateFoodFormInput.addEventListener("submit", handleMutateFoodForm)

        return () => {
            foodInputForm.removeEventListener("submit", handleFoodForm)
            foodVariantInputForm.removeEventListener("submit", handleFoodVariantForm)
            commitAllFoodsForm.removeEventListener("click", handleCommitAllFoods)
            mutateFoodFormInput.removeEventListener("submit", handleMutateFoodForm)
        }
    })

    return (
        <>
            <div css={css`
                height: 45vh;
                min-height: 450px;
            `} key="commit">
                <section key="display" css={css`
                    padding: 1em;
                    height: calc(100% - 254px);
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
                            `} onClick={() => {
                                    setSelectedFood(index)
                                    localStorage.setItem("staged-foods-index", index.toString())
                                }}>
                                <h1>{food.name} {food.category}</h1>
                                <img css={css`
                                    width: 50px;
                                    height: 50px;
                                    border-radius: 50%;
                                `} src={food.imageLink} alt={food.name} />
                                {variants.map(variant => {
                                    return (
                                        <h4 key={food.name + variant.name}>{variant.name} - {variant.price}</h4>
                                    )
                                })}
                            </div>
                        )
                    })}
                </section>
                <section key="control" css={css`
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
                        <select ref={selectFoodCategory} id="category-selector" name="Select Food Category">
                            <option value="b">Beverages</option>
                            <option value="c">Cookies</option>
                        </select>
                        <input type="submit" value="Stage Food" />
                        <input type="button" value="Update Selected Food" onClick={() => {
                            const foodNameInputValue = (document.querySelector("input[name='food-name']") as HTMLInputElement).value
                            const foodUrlInputValue = (document.querySelector("input[name='image-link']") as HTMLInputElement).value
                            const foodCategoryInput = document.querySelector("select[name='Select Food Category']") as HTMLSelectElement
                            
                            const foodCategoryInputValue = foodCategoryInput.options[foodCategoryInput.selectedIndex].value

                            if(selectedFood !== undefined) {
                                const originalSelectedFood = stagedFoods[selectedFood] 
    
                                const newFoodName = foodNameInputValue === "" ? originalSelectedFood.food.name : foodNameInputValue
                                const newFoodUrl = foodUrlInputValue === "" ? originalSelectedFood.food.imageLink : foodUrlInputValue
                                const newFoodCategory = foodCategoryInputValue === "" ? originalSelectedFood.food.category : foodCategoryInputValue

                                const newStagedFoods = [...stagedFoods.slice(0, selectedFood), {
                                    food: {
                                        name: newFoodName,
                                        imageLink: newFoodUrl,
                                        category: newFoodCategory
                                    },
                                    variants: originalSelectedFood.variants
                                }, ...stagedFoods.slice(selectedFood + 1)]

                                setStagedFoods(newStagedFoods)
                                updateStagedFoodsLocalStore(newStagedFoods)
                            } else {
                                alert("Select Existing Food to Delete")
                            }
                       }}/>
                        <br />
                        <input type="button" value="Delete Food" onClick={() => {
                            if(selectedFood !== undefined && stagedFoods.length !== 0) {
                                const newStagedFoods = [...stagedFoods.slice(0, selectedFood), ...stagedFoods.slice(selectedFood + 1)]
                                setStagedFoods(newStagedFoods)
                                updateStagedFoodsLocalStore(newStagedFoods)
                            } else {
                                alert("Select Existing Food to Delete")
                            }
                        }} />
                        <input type="button" value="Delete All Foods"  onClick={() => {
                            if (confirm("Are you sure you want to delete all staged foods?")) {
                                setStagedFoods([])
                                updateStagedFoodsLocalStore([])
                                setSelectedFood(0)
                                localStorage.setItem("staged-foods-index", "0")
                            }
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
                            if(selectedFood !== undefined && stagedFoods.length !== 0) {
                                const stagedFood = stagedFoods[selectedFood]
                                stagedFood.variants.pop()

                                const newStagedFoods = [...stagedFoods.slice(0, selectedFood), {
                                    food: stagedFood.food,
                                    variants: stagedFood.variants
                                }, ...stagedFoods.slice(selectedFood + 1)]

                                setStagedFoods(newStagedFoods)
                                updateStagedFoodsLocalStore(newStagedFoods)
                            } else {
                                alert("Select Existing Food to Delete")
                            }
                        }} />
                    </form>
                </section>
            </div>
            {<div css={css`
                height: 45vh;
                min-height: 450px;
            `} key="mutate">
                <section css={css`
                    height: calc(100% - 254px);
                    padding: 1em;
                    margin-bottom: 20px;
                    margin-top: 20px;
                    background-color: ${background};
                    overflow: auto;
                `} id="top-of-bottom">
                    {foodToMutate.map(({ food, variants }, index) => {
                        return (
                            <div key={food.name + index} css={css`
                                display: flex;
                                place-items: center;
                                height: 50px;
                                background-color: ${selectedFoodToMutate === index ? foreground : background};
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
                            `} onClick={() => {
                                    setSelectedFoodToMutate(index)
                                }}>
                                <h1>{food.name} {food.category}</h1>
                                <img css={css`
                                    width: 50px;
                                    height: 50px;
                                    border-radius: 50%;
                                    transition: all 0.2s;

                                    ${mutatedFoodsToDelete.includes(index) ? "box-shadow: 0px 0px 10px 5px red" : ""}
                                `} src={food.imageLink} alt={food.name} />
                                {variants.map(variant => {
                                    return (
                                        <h4 key={food.name + variant.name}>{variant.name} - {variant.price}</h4>
                                    )
                                })}
                            </div>
                        )
                    })}
                </section>
                <section key="control" css={css`
                    display: flex;
                    justify-content: space-evenly;

                    form {
                        display: flex;
                        flex-direction: column;
                        width: 35%;
                    }
                `} id="bottom-of-bottom">
                    <form ref={mutateFoodForm}>
                        <input type="button" value="Mark Food as Deleted" onClick={() => {
                            if(selectedFoodToMutate !== undefined) {
                                if(!mutatedFoodsToDelete.includes(selectedFoodToMutate)) {
                                    const newMutatedFoodsToDelete = [...mutatedFoodsToDelete, selectedFoodToMutate]

                                    setMutatedFoodsToDelete(newMutatedFoodsToDelete)
                                }
                            }
                        }}/>
                        <input type="button" value="Unmark Food as Deleted" onClick={() => {
                            if(selectedFoodToMutate !== undefined) {
                                if(mutatedFoodsToDelete.includes(selectedFoodToMutate)) {
                                    const index = mutatedFoodsToDelete.indexOf(selectedFoodToMutate)

                                    setMutatedFoodsToDelete([...mutatedFoodsToDelete.slice(0, index), ...mutatedFoodsToDelete.slice(index + 1)])
                                }
                            }
                        }}/>
                        <br />
                        <input type="button" value="Stage" onClick={async () => {
                            if (selectedFoodToMutate !== undefined) {
                                const newStagedFoods = [...stagedFoods, JSON.parse(JSON.stringify(foodToMutate[selectedFoodToMutate]))]

                                setStagedFoods(newStagedFoods)
                                updateStagedFoodsLocalStore(newStagedFoods)
                            } else {
                                alert("Must have food selected")
                            }
                        }}/>
                        <br />
                        <input type="button" value="Refresh" onClick={async () => await refetchMenu()} />
                        <input type="submit" value="Sync Changes" />
                    </form>
                </section>
            </div>}
        </>
    )
}