export interface IUser {
    firstName: string
    lastName: string
    email: string
}

export interface ICreateUser extends IUser {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface ISignIn {
    email: string
    password: string
}

export interface IRespFindByEmail extends IUser {
    id: number
    password: string
}

export interface IRespCreateUser extends IUser {
    id: number
    displayName: string
}