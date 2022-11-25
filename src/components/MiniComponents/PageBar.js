import { Link } from "react-router-dom";

const PageBar = ({link, amountOfPages}) => {

    return ( 
            <div className="PageBar">
                {Array.from(Array(amountOfPages), (_e, pageNumber) => {
                    return(
                        <Link className="link" to={link+`&page=${pageNumber}`} key={pageNumber}>{pageNumber}</Link>
                    )
                })}
            </div>
    );
}
 
export default PageBar;