import React, {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import DeleteModal from "../modals/DeleteModal" 
import LoadingCircle from "../MiniComponents/LoadingCircle";
import PageBar from "../MiniComponents/PageBar";
import { QuestionEdit } from "../Quiz/Question";
import { urlOfGetQuestions, urlOfGetCategories, urlOfDeleteQuestion, urlUpdateQuestion } from "../../routes";
import { useSearchParams } from "react-router-dom";
import { useUpdateToast } from "../../ToastContext";

const VARIABLES = {
    amountOfQuestionsPerPage: 10
} 

const YourQuestions = () => {

    const[amountOfPages, setAmountOfPages] = useState(2)
    const [questions, setQuestions] =  useState([])
    const [questionsCopy, setQuestionsCopy] = useState([])
    const [isDataFetched, setIsDataFetched] = useState(false)
    const [categoriesForSuggestion, setCategoriesForSuggestion] = useState([])
    const[isModalOpen, setIsModalOpen] = useState(false)
    const controller = new AbortController()
    const [questionBeingDeleted, setQuestionBeingDeleted] = useState(0)
    const [searchParams] = useSearchParams()
    const updateToast = useUpdateToast()

    useEffect(  () => {
        const getQuestions = async () => {
            let user = searchParams.get("user")
            let page = searchParams.get("page")
            
            let param = `?user=${user}`
            if(page){
                param += `&page=${page}`
            }
            const { signal } = controller
            await fetch(`${urlOfGetQuestions}${param}`,{
                method: "GET",
                signal,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': localStorage.getItem("token")
                }})
                .then(response => response.json())
                .then(response => {
                    let questions = response.questions

                    let amountOfPages = Math.ceil(questions.length/VARIABLES.amountOfQuestionsPerPage) + 1
                    setAmountOfPages(amountOfPages)
                    for(let i=0; i<questions.length; i++){
                        questions[i]["isQuestionEdited"]=false
                        questions[i]["errorsInUpdateOfQuestion"] = []
                        questions[i]["NewCategoryErrors"] = []
                        questions[i]["NewCategory"] = []
                        questions[i]["suggestedCategories"] = []
                        questions[i]["dropData"] = false
                    }
                    setQuestions(questions)
                    setIsDataFetched(true)
                    return  
                })
                .catch(error=>{console.log(error)})
        }
        
        const getCategories = async () => {
            const { signal } = controller
            await fetch(`${urlOfGetCategories}`,{
                method: "GET",
                signal,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }})
                .then(response => response.json())
                .then(response => {            
                    setCategoriesForSuggestion(response)
                    return  
                })
                .catch(error=>{console.log(error)})
        }

        getQuestions()
        getCategories()

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const makeQuestionEditable = (index) => {
        let copyQuestions = [...questions]
        copyQuestions[index].isQuestionEdited = true
        setQuestions(copyQuestions)

        let copyQuestionsCopy = [...questionsCopy]

        copyQuestionsCopy.push(
            {
                id: index,
                question: JSON.parse(JSON.stringify(questions[index]))
            }
        )
        setQuestionsCopy(copyQuestionsCopy)
    }

    const discardChanges = (index) => {
        let copyQuestions = [...questions]
        let copyQuestionsCopy = [...questionsCopy]

        for(let i=0; i<copyQuestionsCopy.length; i++){
            if(copyQuestionsCopy[i].id===index){
                
                copyQuestions[index] = copyQuestionsCopy[i].question
                copyQuestionsCopy.splice(i, 1)
                break
            }
        }
        copyQuestions[index].isQuestionEdited = false

        setQuestions(copyQuestions)
        setQuestionsCopy(copyQuestionsCopy)
        
        
    }

    const deleteQuestionInBackend = async () => {

        setIsModalOpen(false)
        await fetch(`${urlOfDeleteQuestion}${questions[questionBeingDeleted]._id}`,{
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': localStorage.getItem("token")
            }})
            .then(response => response.json())
            .then(response => {
                let copyQuestions = [...questions]
                if(!response.error){
                    copyQuestions[questionBeingDeleted].splice(questionBeingDeleted, 1)
                    setQuestions(copyQuestions)
                    updateToast.addToast({toastText: "Deleted question successfully", severity: "success"})
                    return
                }
                
                updateToast.addToast({toastText: "Unable to delete question, try again", severity: "error"})
                copyQuestions[questionBeingDeleted].errorsInUpdateOfQuestion = ["Couldn't delete question."]
                setQuestions(copyQuestions)
            })
            .catch(error=>{console.log(error)})
            
    }

    const changeQuestionInBackend = async (index) => {
        let copyQuestions = [...questions]
        copyQuestions[index].errorsInUpdateOfQuestion = []    
        
        for(let i=0; i<questionsCopy.length; i++){
            if(index===questionsCopy[i].id){
                const isQuestionNotChanged = JSON.stringify(questions[index])===JSON.stringify(questionsCopy[i].question) && questions[index].dropData === false
                if(isQuestionNotChanged){
                    copyQuestions[index].errorsInUpdateOfQuestion.push("Updated question cannot be the same as old one.")
                    setQuestions(copyQuestions)
                    return
                }
            }
        }
   
        const body = {
            "question": questions[index].question,
            "answers": questions[index].answers,
            "correctAnswer":  questions[index].correctAnswer,
            "category": questions[index].category, 
            "description": questions[index].description, 
            "dropData": questions[index].dropData,
        }
        const param = `id/${questions[index]._id}`

        await fetch(`${urlUpdateQuestion}${param}`,{
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': localStorage.getItem("token")
            }})
            .then(response => response.json())
            .then(response => {
                if(response.error){
                    copyQuestions[index].errorsInUpdateOfQuestion.push(response.error)
                    setQuestions(copyQuestions)
                    updateToast.addToast({toastText: "Unable to update successfully", severity: "error"})
                    return
                }
                
                if(questions[index].dropData){
                    copyQuestions[index].answersFromUsers = []
                    setQuestions(copyQuestions)
                }

                let copyQuestionsCopy = [...questionsCopy]
                for(let i=0; i<copyQuestionsCopy.length; i++){
                    if(copyQuestionsCopy[i].id===index){
                        copyQuestionsCopy.splice(i, 1)
                        break
                    }
                }
                setQuestionsCopy(copyQuestionsCopy)

                copyQuestions[index].isQuestionEdited = false
                setQuestions(copyQuestions)
                updateToast.addToast({toastText: "Updated question successfully", severity: "success"})
            })
            .catch(error=>{console.log(error)})
    }

    const changeQuestionDescription = (e, index) =>{
        let copyQuestions = [...questions]
        copyQuestions[index].description = e.target.value
        setQuestions(copyQuestions)
    }

    const changeQuestion = (e, index) =>{
        let copyQuestions = [...questions]
        copyQuestions[index].question = e.target.value
        setQuestions(copyQuestions)
    }

    const changeAnswers = (e, index, i) =>{
        let copyQuestions = [...questions]
        copyQuestions[index].answers[i] = e.target.value   
        setQuestions(copyQuestions)
    }

    const changeCorrectAnswer = (e, index) => {
        if(questions[index].isQuestionEdited===false) return
        let copyQuestions = [...questions]
        copyQuestions[index].correctAnswer = parseInt(e.target.value)
        setQuestions(copyQuestions)
    }

    const changeCategory = (e, index) => {
        let copyQuestions = [...questions]
        copyQuestions[index].NewCategory = e.target.value.toLocaleLowerCase()
        copyQuestions[index].suggestedCategories = []
        if( e.target.value.length<3){
            setQuestions(copyQuestions)
            return
        }
        
        for(let i=0; i<categoriesForSuggestion.length; i++){
            if(copyQuestions[index].suggestedCategories.length>3){
               break 
            }
            if(categoriesForSuggestion[i].includes(e.target.value) && !copyQuestions[index].category.includes(categoriesForSuggestion[i])){
                copyQuestions[index].suggestedCategories.push(categoriesForSuggestion[i])
            }
        }
        setQuestions(copyQuestions)
    }

    const addCategory = (e, index) => {
        e.preventDefault()
        let copyQuestions = [...questions]
        copyQuestions[index].NewCategoryErrors = []
        
        if (copyQuestions[index].NewCategory.length < 4){
            copyQuestions[index].NewCategoryErrors.push("Category name too short at least 4 letters required")
            setQuestions(copyQuestions)
            return
        }
        

        copyQuestions[index].suggestedCategories = []

        copyQuestions[index].category.push(copyQuestions[index].NewCategory)
        copyQuestions[index].NewCategory = ""
        setQuestions(copyQuestions)
    }

    const deleteCategory = (index, index2) => {
        let copyQuestions = [...questions]
        copyQuestions[index].category.splice(index2, 1)
        setQuestions(copyQuestions)
    }

    const changeDropData = (index) => {
        let copyQuestions = [...questions]
        copyQuestions[index].dropData = !copyQuestions[index].dropData
        setQuestions(copyQuestions)
    }

    const addSuggested = (value, index) =>{  
        let copyQuestions = [...questions]
        copyQuestions[index].NewCategory = []
        copyQuestions[index].suggestedCategories = []
        copyQuestions[index].category.push(value)
        setQuestions(copyQuestions)
    } 



    return(
        <div> 
            { isDataFetched  ? (
               <div> 
                   { questions.length > 0 ? (  
                        <div>
                            <div className="container columns2">
                                {questions.map((value, index) => {
                                    return(
                                        <QuestionEdit key={index} addSuggested={addSuggested} changeDropData={changeDropData} changeAnswers={changeAnswers} 
                                        question={questions[index]} addCategory={addCategory} changeCorrectAnswer={changeCorrectAnswer}
                                        index={index} deleteCategory={deleteCategory} changeCategory={changeCategory} changeQuestion={changeQuestion}
                                        changeQuestionDescription={changeQuestionDescription} changeQuestionInBackend={changeQuestionInBackend}
                                        discardChanges={discardChanges} makeQuestionEditable={makeQuestionEditable} deleteQuestionInBackend={deleteQuestionInBackend}
                                        setIsModalOpen={setIsModalOpen} setQuestionBeingDeleted={setQuestionBeingDeleted}
                                        /> 
                                    )
                            })}
                        </div>
                        <PageBar amountOfPages={amountOfPages} link={"http://localhost:3001/profile/question/?user=Noob123456"}/>
                    </div>
                    ):(
                        <p className="notFound">Looks like you haven't created question yet, go <Link to="/add-question">there</Link> to create one</p>
                    )}
                </div>
            ):(
                <LoadingCircle/>
            )}  
            <DeleteModal isModalOpen={isModalOpen} deleteFunction={deleteQuestionInBackend} setIsModalOpen={setIsModalOpen}/>
        </div>
    )
}

export default YourQuestions