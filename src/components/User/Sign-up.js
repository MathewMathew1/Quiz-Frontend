import React, {useState, useEffect} from "react"
import useArray from "../CustomHooks/useArray"
import { urlOfSignUp } from "../../routes"
import { useUser } from "../../UserContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useUpdateToast } from "../../ToastContext"
import { VscAccount } from "react-icons/vsc"

const SignUp = () => {

    const [username, setUserName] =  useState("")
    const [password, setPassword] =  useState("")
    const [password2, setPassword2] =  useState("")
    const errors = useArray([])
    const controller = new AbortController()
    const user = useUser()
    const navigate = useNavigate()
    const updateToast = useUpdateToast()

    useEffect(()=>{
        if(user.logged===true) navigate("/")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user.logged] ) 

    useEffect(()=>{
        document.title = "sign up"
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const signUp = async (event)=>{
        event.preventDefault()
        
        let errorsInForm = []
        if(password.length<8) errorsInForm.push("Passwords too short")
        if(password !== password2) errorsInForm.push("Passwords doesn't match")
        if(username.length<3) errorsInForm.push("Username too short")
        if(username.length>16) errorsInForm.push("Username too long")
        errors.set(errorsInForm)
        if(errorsInForm.length>0) return

        const body = {
            "username": username,
            "password": password,
        }

        const { signal } = controller
        await fetch(`${urlOfSignUp}`,{
            method: "POST",
            signal,
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }})
            .then(response => response.json())
            .then(response => {
                if(response.error){
                    errors.push(response.error)
                    return
                }
                updateToast.addToast({toastText: "Signed in successfully", severity: "success"})
                navigate("/login")
                return
            })
            .catch(error=>{console.log(error)})        
    }

    const handleKeypress = event => {
        //it triggers by pressing the enter key
      if (event.keyCode === 13) {
        SignUp(event)
      }
    }

    return(
    
        <div className="box">
            <div className="login-box">
                <div className="container container-center">
                    <VscAccount className="icon-pearson"/>
                </div>
                <form onSubmit={signUp} onKeyDown={handleKeypress}>  
                    <label htmlFor="username">Username:</label><br/>
                    <input maxLength="16" className="input" id="username-field" placeholder="Username(4-16 letters)" type="text" value={username} onChange={ (e)=>setUserName(e.target.value)} required></input><br/>
                    <label htmlFor="username">Password:</label><br/>
                    <input className="input" id="password-field" type="password" placeholder="Password(at least 8 letters)" value={password} onChange={ (e)=>setPassword(e.target.value)} required></input><br/>
                    <label htmlFor="username">Repeat Password:</label><br/>
                    <input className="input" id="password2-field" type="password" placeholder="Repeat password" value={password2} onChange={ (e)=>setPassword2(e.target.value)} required></input><br/>
                    {errors.array.map((value, index) => {
                        return(
                            <div key={`error ${index}`} className="error">{value}</div>
                        )
                    })}
                    <div className="align-right">
                        <button  className="button green-button" >Sign Up</button>
                    </div>    
                    <div className="info-login">Or <Link to="/login">click here</Link> to login!</div>
                   
                </form>
            </div>
    </div>
        )
    }

export default SignUp