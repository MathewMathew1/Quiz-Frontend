import { useUser, useUserUpdate } from "../../UserContext";
import { Link } from "react-router-dom";
import { useUpdateToast } from "../../ToastContext";
import { healthCheckRoute } from "../../routes";
import { useEffect } from "react";

const Navbar = () => {
    const user = useUser()
    const userUpdate = useUserUpdate()
    const updateToast = useUpdateToast()

    const changeSidebarStatus = () => {
        let topNav = document.getElementById("myTopNav");
        if (topNav.className === "topNav") {
          topNav.className += " responsive";
        } else {
          topNav.className = "topNav";
        }
    }

    useEffect(() => {
        const checkHealth = async () => {
            try {
              const response = await fetch(healthCheckRoute);
      
              if (!response.ok) {
                updateToast.addToast({toastText: "Server may take some time to start, up to 30 seconds.", severity: "error"})
              } 
            } catch (error) {
                updateToast.addToast({toastText: "Server may take some time to start, up to 30 seconds.", severity: "error"})
            }
          };
    
        checkHealth();
    }, []);

    return (
        <div className="topNav" id="myTopNav">
            <Link ro="/" className="active">QUIZZ</Link>
            <Link to="/categories">Category</Link>
            <Link to="/add-question">Add question</Link>
            { user.logged ? (
                
            <div className="topNav-a"  style={{cursor:'pointer'}}>
                <div className="dropdown">
                Profile
                <li className="dropdown-content">
                    <Link to="/profile/stats">Stats</Link>
                    <Link to={'/profile/question/?user='+ user.userInfo._id}>Your questions</Link>
                    {  user.userInfo?.isAdmin ? (<Link to="/profile/admin">Admin</Link>):null}
                    <Link to="/logout" onClick={()=>userUpdate.logout()}>Log out</Link>
                </li>
                </div>
            </div>
            ) : (            
            <Link to={"/login"}>
                Login
            </Link>
            )}
            <div onClick={() => changeSidebarStatus()} href="#"  className="icon" >
                <div className="hamburger"></div>
                <div className="hamburger"></div>
                <div className="hamburger"></div>
            </div>
            </div>
    )
}

export default Navbar