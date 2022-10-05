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
    imageLink: string
}

export type FoodVariants = {
    name: string,
    price: number
}

export type UsernavProps =  {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentUser?: React.Dispatch<React.SetStateAction<{
        userID: string;
        email?: string | undefined;
        username?: string | undefined;
        profileImageLink?: string | undefined;
        admin?: boolean | undefined;
    }>>
}