import React, {useState, useEffect} from "react"
import { Link } from "react-router-dom";
import { urlGetGroups } from "../../routes";
import LoadingCircle from "../MiniComponents/LoadingCircle";


const Categories = () => {
    const [categories, setCategories] =  useState([])
    const [isDataFetched, setIsDataFetched] = useState(false)

    const controller = new AbortController()

    useEffect(()=>{
        document.title = "categories"
        if(sessionStorage.getItem("showModal") === '1'){
            sessionStorage.removeItem("showModal")
            let toast = document.getElementById("toast");
            toast.className = "show";
            setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
        }

        const { signal } = controller
        fetch(`${urlGetGroups}`,{
            method: "GET",
            signal,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }})
            .then(response => response.json())
            .then(response => {
                if(!response.error){
                    setCategories(response)
                    setIsDataFetched(true)
                }
            })
            .catch(error=>{console.log(error)})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

      /*const handleImageChange = (e) => {
        setImage(e.target.files[0])
      };
      const handleSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append('image', image);
        console.log(formData.get('image'))
        fetch("http://localhost:3000/upload",{
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
        })
        .catch(error=>{console.log(error)})
      }*/


    return(
        <div>
            { isDataFetched  ? (
            <div className="columns">
                {categories.map((value, index) => {
                    return(
                        <div className="card" key={index}>
                            <img id={categories[index].name}  src={`data:image/png;base64,${categories[index].image}`} alt={categories[index].name}></img>
                            <div key={index} className="card-content">
                                <h4 className="card-title"><b>{categories[index].name}</b></h4>
                                <div className="card-content">
                                {value.categories.map((_value, index2) => {
                                    return(
                                        <Link key={index2}  to={'/category?category='+ categories[index].categories[index2]}>{categories[index].categories[index2]}</Link>
                                        
                                    )})}    
                                </div>
                            </div>
                        </div>
                )})}
            </div>    
            ):(
                <LoadingCircle/>
            )}
            <div id="toast">You have logged successfully</div>
        </div>
    )
}

export default Categories