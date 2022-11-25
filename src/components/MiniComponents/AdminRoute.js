import { Navigate, Outlet } from "react-router"
import { useUser } from "../../UserContext"

  
const PrivateRoute = () => {
    const user = useUser()
    const auth = user.userInfo?.isAdmin || !user.fetchingUserDataFinished; // determine if authorized, from context or however you're doing it

    return auth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute