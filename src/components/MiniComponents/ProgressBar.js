import { useMemo } from "react"

const ProgressBar = ({showInPercents, partNumber, wholeNumber}) => {
    
    const evaluatePercentage = useMemo(() => {
        if( wholeNumber===0) return "0%"
 
        let percentageOfAllAnswers = Math.round((partNumber/wholeNumber)* 100)  + '%'
        return percentageOfAllAnswers
       
    },[partNumber, wholeNumber])

    return ( 
            <div className="progress-bar">
                <div style={{width: evaluatePercentage}}>
                    { showInPercents  ? (
                        <span>{evaluatePercentage}</span>):
                        (<span>{partNumber}/{wholeNumber}</span>)
                    }
                </div>
            </div>
    );
}
 
export default ProgressBar;