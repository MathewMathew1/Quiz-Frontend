import React, {useState, useEffect} from "react"
import { urlOfLogin } from "../../routes"
import useArray from "../CustomHooks/useArray"
import person from "../../person.png"
import { useUser } from "../../UserContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const Login = () => {
    const [username, setUserName] =  useState("")
    const [password, setPassword] =  useState("")
    const errors = useArray([])
    const user = useUser()
    const navigate = useNavigate()
    const controller = new AbortController()

    useEffect(()=>{
        if(user.logged===true) navigate("/")
        return // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.logged])   
        
    useEffect(()=>{
        document.title = "login"
      }, [])

    const Login = async (event)=>{
        event.preventDefault()
        
        let newErrors = []
        
        const body = {
            "username": username,
            "password": password,
        }

        const { signal } = controller
        await fetch(`${urlOfLogin}`,{
            method: "POST",
            signal,
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }})
            .then(response => response.json())
            .then(response => {
                if(response.accessToken !== undefined) {
                    localStorage.setItem("token","Bearer " + response.accessToken)
                    window.location.href = "/"
                    errors.set(newErrors)
                    const toastInfo = {message: "Login successfully", severity: "success"}
                    sessionStorage.setItem("toast", JSON.stringify(toastInfo))
                }
                else{
                    newErrors.push("An Incorrect password or username")
                    errors.set(newErrors)
                    setUserName("")
                    setPassword("")
                }
            })
            .catch(error=>{console.log(error)})        
    }

    const handleKeypress = event => {
        //it triggers by pressing the enter key
      if (event.keyCode === 13) {
        Login(event)
      }
    }

    return(
    
        <div className="box">
            <div className="login-box">
            <img  id="login-person"  src={person} alt="login person" />
                <form onSubmit={Login} onKeyDown={handleKeypress}>  
                    <label htmlFor="username">Username:</label><br/>
                    <input className="input" id="username-field" placeholder="Username" type="text" value={username} onChange={ (e)=>setUserName(e.target.value)} required></input><br/>
                    <label htmlFor="username">Password:</label><br/>
                    <input className="input" id="password-field" type="password" placeholder="Password" value={password} onChange={ (e)=>setPassword(e.target.value)} required></input><br/>
                    {errors.array.map((value, index) => {
                        return(
                            <div key={`error ${index}`} className="error">{value}</div>
                        )
                    })}
                    <div className="align-right">
                        <button  className="button green-button" >Login</button>
                    </div>    
                    Or <Link to="/sign-up">click here</Link> to sign up!
                   
                </form>
            </div>
            <div id="toast">You have created account successfully</div>
        </div>
        )
    }


export default Login