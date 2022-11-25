import { Route, Routes} from "react-router-dom";
import './App.css';
import Login from "./components/User/Login";
import Categories from "./components/MainPage/Categories";
import SignUp from "./components/User/Sign-up";
import AddQuestion from "./components/MainPage/AddQuestion";
import Quiz from "./components/Quiz/Quiz"
import YourQuestions from "./components/User/YourQuestions"
import UserStats from "./components/User/Stats"
import NotFound from "./components/NotFound.js";
import Category from "./components/MainPage/Category";
import AdminPage from "./components/User/AdminPage";
import PrivateRoute from "./components/MiniComponents/PrivateRoute";
import AdminRoute from "./components/MiniComponents/AdminRoute";
import UserProvider from "./UserContext";
import Navbar from "./components/MainPage/Navbar";
import ToastProvider from "./ToastContext";
import Toasts from "./components/MainPage/Toasts";

function App() {

  return (
    <div className="App">
      <ToastProvider>
        <UserProvider>   
          <Navbar></Navbar>    
          <Routes>
              <Route 
                path={"/"}
                element={<Categories />}
              />
              <Route 
                path={"/categories"}
                element={<Categories />}
              />
              <Route 
                path={"/category"}
                element={<Category />}          
              />
              <Route 
                path="/login"
                element={<Login  />}
              />            
              <Route 
                path="/sign-up"
                element={<SignUp />}
              />
              <Route 
                path="/add-question"
                element={<AddQuestion />}
              />
              <Route 
                path="/question/category"
                element={<Quiz/>}
              />
              <Route path="/profile/question" element={<PrivateRoute/>}>
                    <Route path="/profile/question" element={<YourQuestions/>}/>
              </Route>
              <Route path="/profile/stats" element={<PrivateRoute/>}>
                    <Route path="/profile/stats" element={<UserStats/>}/>
              </Route>
              <Route path="/profile/admin" element={<AdminRoute/>}>
                    <Route path="/profile/admin" element={<AdminPage/>}/>
              </Route>
              <Route path="*" element={<NotFound/>} />
            </Routes>
            <Toasts></Toasts>
          </UserProvider>
        </ToastProvider>
    </div>
  );
}

export default App;
