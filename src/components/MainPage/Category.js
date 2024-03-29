import { useEffect, useState } from "react";
import LoadingCircle from "../MiniComponents/LoadingCircle";
import ProgressBar from "../MiniComponents/ProgressBar"
import { urlOfStats } from "../../routes";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const ANONYMOUS_USERS = "Anonymous"

const Category = () => {
    const [isDataFetched, setIsDataFetched] = useState(false)
    const [categoryUserData, setUserCategoryData] = useState(Object)
    const [categoriesBiggestAuthors, setCategoriesBiggestAuthors] = useState([])
    const [image, setImage] = useState(Object)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        let category = searchParams.get("category")
        let param = `?category=${category}`
        document.title = category

        const controller = new AbortController()
        const fetchStats = async () =>{
            const { signal } = controller
            await fetch(`${urlOfStats}/${param}`,{
                method: "GET",
                signal,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': localStorage.getItem("token")
                }})
                .then(response => response.json())
                .then(response => {
                    if(!response.error){
                        setUserCategoryData(response.quizDataForUser)
                        setCategoriesBiggestAuthors(response.authors)
                        setImage(response.image)
                    }
                    setIsDataFetched(true)      
                })
                .catch(error=>{console.log(error)})
            }
        fetchStats()
        return () => {
            controller.abort()
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            { isDataFetched? (
                <div className="categoryBox">
                    <div className="background-image" style={{backgroundImage: `url(data:image/png;base64,${image})`}}>
                        <h1>quiz about {categoryUserData.name} 
                            <Link className="button blue-button" to={'/question/category?category='+categoryUserData.name}>
                                Play
                            </Link>
                        </h1>
                    </div> 
                    <div className="container2 info-container">   
                        <div className="gridLabel columns3">
                                <div className="label-progressBar" >Your Progress in this quiz: </div>
                                <div className="progressBarDiv">
                                    <ProgressBar showInPercents={false} partNumber={categoryUserData.numberOfBadAnswers + categoryUserData.numberOfCorrectAnswers} wholeNumber={categoryUserData.numberOfAllQuestions} />
                                </div>
                                <div className="label-progressBar" >Your accuracy: </div>
                                <div className="progressBarDiv">
                                    <ProgressBar showInPercents={true} partNumber={categoryUserData.numberOfCorrectAnswers} wholeNumber={categoryUserData.numberOfBadAnswers + categoryUserData.numberOfCorrectAnswers} />
                                </div>
                                <div className="label-progressBar" >Average accuracy: </div>
                                <div className="progressBarDiv">
                                    <ProgressBar showInPercents={true} partNumber={categoryUserData.accuracyOfUsers.numberOfCorrectAnswers} 
                                    wholeNumber={categoryUserData.accuracyOfUsers.numberOfBadAnswers + categoryUserData.accuracyOfUsers.numberOfCorrectAnswers} />
                                </div>
                        </div>
                        <div className="authorsList">
                            <h3 style={{marginTop:"0.4rem"}}>Authors:</h3>
                            <ol>
                                {categoriesBiggestAuthors.map((value, index) => {
                                    return(
                                        <li key={index}>
                                            {value.author[0]?.username? value.author[0].username: ANONYMOUS_USERS}: {value.count}
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            ):(
                <LoadingCircle/>
            )}
        </div>
    );
}
 
export default Category;