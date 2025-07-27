import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();
 export function AppProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState({});
    async function fetchUser() {
        if (token) {
            const response = await fetch('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const user = await response.json();
            setUser(user);

        }
    }
    useEffect(() => {
        fetchUser();
    }, [token]);
     return (
         <AppContext.Provider value={{token, setToken,user, setUser}}>
             {children}
         </AppContext.Provider>
     );
 }
