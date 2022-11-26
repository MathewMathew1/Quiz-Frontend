import React, {useState, useEffect} from "react"
import { urlOfStats } from "../../routes";
import LoadingCircle from "../MiniComponents/LoadingCircle";
import ProgressBar from "../MiniComponents/ProgressBar"

const UserStats = () => {
    const [userStats, setUserStats] =  useState([])
    const [isDataFetched, setIsDataFetched] = useState(false)

    const controller = new AbortController()

    useEffect(()=>{
        
        const fetchStats =  () =>{
            const { signal } = controller
            fetch(`${urlOfStats}`,{
            method: "GET",
            signal,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': localStorage.getItem("token")
            }})
            .then(response => response.json())
            .then(response => {
                if(!response.error){
                    setUserStats(response.userQuizData)
                    setIsDataFetched(true)
                }        
            })
            .catch(error=>{console.log(error)})
        }

        fetchStats()

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const sortUserStats = (field, sortOrder) => {
        let copyArray = [...userStats]

        if(field==="amount"){
            copyArray.sort(sortByAccuracy("numberOfCorrectAnswers", "numberOfAllQuestions",sortOrder))
        }
        else{
            copyArray.sort(dynamicSort(field, sortOrder))
        }
        setUserStats(copyArray)
    }

    const sortByAccuracy = (field1, field2, sortOrder) => {
        return function (a,b) {
            let result
            if(a[field2]===0){
                result = 1
                return result  * sortOrder
            }
            if(b[field2]===0){
                result = -1
                return result * sortOrder
            }
            result = (a[field1]/a[field2] < b[field1]/b[field2]) ? 1 : (a[field1]/a[field2] > b[field1]/b[field2]) ? -1 : 0;
            return result * sortOrder;
        }
    }

    const dynamicSort = (property, sortOrder) => {
        return function (a,b) {
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    } 

    return (
        <div>
            { isDataFetched  ? (
                <div className="stats-box">
                    <table  className="stats-table">
                        <caption ><h3>Your stats</h3></caption>
                        <tbody>
                        <tr>
                            <th className="title">Category name 
                                <i className="arrow" >
                                    <i className="arrow-up" onClick={ () => sortUserStats("name", 1)}></i>
                                    <i className="arrow-down" onClick={ () => sortUserStats("name", -1)}></i>
                                </i>
                            </th>
                            <th className="title">Questions answered 
                                <i className="arrow" >
                                    <i className="arrow-up" onClick={ () => sortUserStats("numberOfAllQuestions", -1)}></i>
                                    <i className="arrow-down" onClick={ () => sortUserStats("numberOfAllQuestions", 1)}></i>
                                </i>
                            </th>
                            <th className="title">Accuracy 
                                <i className="arrow" >
                                    <i className="arrow-up" onClick={ () => sortUserStats("amount", 1)}></i>
                                    <i className="arrow-down" onClick={ () => sortUserStats("amount", -1)}></i>
                                </i>
                            </th>
                        </tr>  
                            {userStats.map((category, index) => {
                                let numberOfUserAnswers = category.numberOfBadAnswers + category.numberOfCorrectAnswers
                                let progressBarWidth
                                if(numberOfUserAnswers===0){
                                    progressBarWidth = "0%"
                                }
                                else{
                                    progressBarWidth = Math.round((category.numberOfCorrectAnswers/numberOfUserAnswers)* 100)  + '%'
                                }
                                
         
                                return(
                                    <tr key={index}>
                                        <td>{category.name}</td>
                                        <td>                                           
                                            <ProgressBar showInPercents={false} partNumber={category.numberOfCorrectAnswers+category.numberOfBadAnswers} wholeNumber={category.numberOfAllQuestions} />              
                                        </td>
                                        {
                                            <td>
                                                {progressBarWidth}
                                            </td>

                                        }
                                    </tr>
                                )  
                            })} 
                        </tbody>
                    </table>
                </div>
            ):(
                <LoadingCircle/>
            )} 
        </div> 
    )
}

export default UserStats