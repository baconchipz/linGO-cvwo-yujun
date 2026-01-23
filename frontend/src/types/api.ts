export interface User {
    id: number;
    username: string;
    major: string;
    year: number;
}

export interface ApiResponse<T> {
    payload: {
        data: T;
    }
    messages: string[];
    errorCode: number;
}

//create a typescript interface, giving me autocomplete and type safety
//when working with API responses that return a list of users