import { useUser, useUserUpdate } from "../../UserContext";
import { Link } from "react-router-dom";

const Navbar = () => {
    const user = useUser()
    const userUpdate = useUserUpdate

    const changeSidebarStatus = () => {
        let topNav = document.getElementById("myTopNav");
        if (topNav.className === "topNav") {
          topNav.className += " responsive";
        } else {
          topNav.className = "topNav";
        }
      }

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