import { useToast, useUpdateToast } from "../../ToastContext";
//TYPES

import React from 'react'

const Toasts = () => {
    const toasts = useToast()
    const toastUpdate = useUpdateToast()

    const handleClose = (id) => {
      toastUpdate.removeToastById(id)
    }
   

    return(
      <>
        {toasts.toastInfos.map((toast, index)=> {
          return(
            <div style={{bottom: `${index*70+50}px`}} key={`toast ${index}`} className={`toast ${toast.severity}`}>
                {toast.message}
                <div onClick={()=>handleClose(toast.id)} style={{paddingRight: "0.2rem"}} className="close">x</div>
            </div>
        )})}  
      </>     
    )
}

export default Toasts