import "./style.css"

interface RatingLineProps {
    name: string,
    score: number,
    num: number,
    last: number,
    current: number,
}

const RatingLine: React.FC<RatingLineProps> = ({name, score, num, last, current})  => {
    const getCurrentContainerClass = () => {
        let className = 'rating-line-container-current';
        if (num === 1) className += ' first-item';
        if (num === last) className += ' last-item';
        return className;
    };

    return (
        <>
            <div className={current !== num ? 'rating-line-container' : getCurrentContainerClass()}>
                <div className="num-name-container">
                    <p className="num">{num}</p>
                    <p className="name-rating">{name}</p>
                </div>
                <p className="score">{score}</p>
            </div>
            { (num != last) && (
                <hr className="rating-line"/>
            )}
        </>
    )
}

export default RatingLine;