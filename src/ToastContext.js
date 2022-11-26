import useArray from "./components/CustomHooks/useArray"
import { useState, createContext, useContext, useEffect} from "react";

const TOAST_SCREEN_TIME = 50000 // counted in ms
const MAXIMUM_AMOUNT_OF_TOASTS = 3

const ToastContext = createContext({})
const ToastUpdate = createContext({})

export function useToast(){
    return useContext(ToastContext)
}

export function useUpdateToast(){
    return useContext(ToastUpdate)
}

let idOfNextToast = 1

const ToastProvider = ({ children }) => {
    const toastInfos = useArray([])
    const [idToDelete, setIdToDelete] = useState()

    const addToast = ({toastText, severity}) => {
        if(toastInfos.array.length >= MAXIMUM_AMOUNT_OF_TOASTS){
            toastInfos.removeValueByIndex(0)
        }
        toastInfos.push({message: toastText, severity: severity, id: idOfNextToast})
        
        let idOfCreatedToast = idOfNextToast
        idOfNextToast += 1
    
        setTimeout(() => setIdToDelete(idOfCreatedToast)
        , TOAST_SCREEN_TIME)
    }

    useEffect(() => {
        let snackbarInfo = sessionStorage.getItem("toast")
        if(snackbarInfo){
            sessionStorage.removeItem("toast")
            let snackbarInfoParsed= JSON.parse(snackbarInfo)
            addToast({toastText: snackbarInfoParsed.message, severity: snackbarInfoParsed.severity, id: idOfNextToast})
            idOfNextToast += 1
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(idToDelete==null) return
        removeToastById(idToDelete)
        setIdToDelete(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idToDelete]);

    const removeToastById = (id) => {
        toastInfos.removeByKey("id", id)
    }

    return (
        <ToastContext.Provider value={{toastInfos: toastInfos.array}}>
            <ToastUpdate.Provider value={{addToast, removeToastById}}>
                {children}   
            </ToastUpdate.Provider>
        </ToastContext.Provider>
    )
}

export default ToastProvider