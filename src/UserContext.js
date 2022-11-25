import { useState, createContext, useContext, useEffect} from "react";
import { urlOfUserData} from "./routes";
import { useUpdateToast } from "./ToastContext";

const UserContext = createContext({})
const UserUpdate = createContext({})

export function useUser(){
    return useContext(UserContext)
}

export function useUserUpdate(){
    return useContext(UserUpdate)
}

const UserProvider = ({ children }) => {
    const[logged, setLogged] = useState(false)
    const[userInfo, setUserInfo] = useState()
    const[fetchingUserDataFinished, setFetchingUserDataFinished] = useState(false)
    
    const updateToast = useUpdateToast()
    const controller = new AbortController()   

    useEffect(() => {
        const fetchAllData = async () => {
            if(!localStorage.getItem("token")) {
                setFetchingUserDataFinished(true)
                return
            }
            
            const { signal } = controller
            fetch(`${urlOfUserData}`,{
                method: "GET",
                signal,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': localStorage.getItem("token")
                }})
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    if(!("error" in response)){
                        setUserInfo(response.user)
                        setLogged(true) 
                    }
                    setFetchingUserDataFinished(true)
                })
                .catch(error=>{console.log(error)})           
        }

        fetchAllData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        setLogged(false)
        localStorage.removeItem("token")
        setUserInfo(undefined)
        setFetchingUserDataFinished(true)
        updateToast.addToast({toastText: "Logged out  successfully", severity: "success"})
    }

    return (
        <UserContext.Provider value={{logged, fetchingUserDataFinished, userInfo}}>
            <UserUpdate.Provider value={{logout}}>
                {children}   
            </UserUpdate.Provider>
        </UserContext.Provider>
    )
}

export default UserProvider