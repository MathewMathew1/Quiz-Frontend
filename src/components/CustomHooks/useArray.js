import { useState } from "react";


const useArray = (defaultValue) => {
    const [array, setArray] =  useState(defaultValue)


    const push = (value) => {
        setArray(array => [...array, value])
    }


    const update = (newValue, index) => {
        console.log(...array.slice(0, index))
        setArray(array => [
            ...array.slice(0, index), // remove value
            newValue,
            ...array.slice(index+1, array.length)
        ])
    }

    const includes = (value) => {
        if(array.includes(value)){
            return true
        }
        return false
    }

    const removeValueByIndex = (index) => {
        setArray(array => [...array.slice(0, index), ...array.slice(index + 1, array.length)])
    }

    const removeByKey = (key, keyValue)=> {  
        const index = array.findIndex((obj) => obj[key] === keyValue)
        if(index===-1) return
        setArray(array => [...array.slice(0, index), ...array.slice(index + 1, array.length)])
    }

    return {array, set: setArray, push, removeValueByIndex, update, includes, removeByKey}
}
export default useArray