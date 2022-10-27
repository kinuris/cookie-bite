/// <reference types="vite/client" />

export type User = {
    userID: string,
    admin: boolean,
    profileImageLink: string,
    username: string,
    email: string,
}

export type Food = {
    name: string,
    imageLink: string,
    category: string
}

export type FoodVariants = {
    name: string,
    price: number
}

export type UsernavProps =  {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

export type MenuProps =  {
    loggedIn: boolean
}

export type FetchAll = {fetchAll: { itemID: string, imageLink: string, name: string, category: string, variants: {
    price: number,
    variantName: string
}[]}[]}

export type FetchAllDirect = FetchAllSingle[]
export type FetchAllSingle = { food: Food, variants: FoodVariants[] }