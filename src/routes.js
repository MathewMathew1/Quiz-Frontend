let urlOfSocketConnection

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') urlOfSocketConnection = "http://localhost:8000" 
else urlOfSocketConnection = "https://api-quiz.onrender.com/" 

const BaseUrlOfApi=  urlOfSocketConnection + "/api/v1/"
const urlOfGetQuestions = BaseUrlOfApi + "quiz/question/"
const urlOfGetCategories = BaseUrlOfApi + "quiz/categories"
const urlOfDeleteQuestion = BaseUrlOfApi + "quiz/question/id/"
const urlUpdateQuestion = BaseUrlOfApi + "quiz/question/"
const urlOfStats = BaseUrlOfApi + "quiz/user/stats"
const urlOfSignUp = BaseUrlOfApi + "sign-up"
const urlOfLogin = BaseUrlOfApi + "login"
const urlGetGroups = BaseUrlOfApi + "quiz/groups/"
const urlOfAnswerQuestion = BaseUrlOfApi + "quiz/question/id/"
const urlOfUserData = BaseUrlOfApi + "user/data"


export {BaseUrlOfApi, urlGetGroups, urlOfLogin, urlOfSignUp, urlOfGetQuestions, urlOfGetCategories, urlOfDeleteQuestion, urlUpdateQuestion, 
    urlOfStats,  urlOfAnswerQuestion, urlOfUserData}