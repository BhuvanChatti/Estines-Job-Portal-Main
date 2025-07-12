import { createContext, useState } from "react";

export const userContext = createContext();
export const ContextA = ({ children }) => {
    const [userT, setT] = useState('Recruiter');
    return (
        <userContext.Provider value={{ userT, setT }}>
            {children}
        </userContext.Provider>
    )
}