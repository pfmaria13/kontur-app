import logo from "../img/logo-kontur.png"
import playArrow from "../img/play-arrow.png"
import {NavLink, useNavigate} from "react-router-dom";
import Form from "../components/form/Form.tsx"
import RatingLine from "../components/rating/RatingLine.tsx";

const Rating = () => {
    return (
        <div className="rating-page-container container">
            <img src={logo} alt="Логотип" className="logo"/>
            <div className="rating-top">
                <h2 className="rating-main-text">Поздравляем, вы прошли игру!
                    Ваши баллы:</h2>
                <p className="rating-score">21 500</p>
                {/*Если игра первый раз кнопка есть:*/}
                <button className="play-again">
                    <p>Играть!</p>
                    <img src={playArrow} alt="Стрелка" className="play-again-arrow"/>
                </button>
            </div>
            <p className="general-rating-text">Общий рейтинг:</p>
            <div className="general-rating">
                <RatingLine name={"Мария Пряничникова"} score={1000000} num={1} last={3} current={3}/>
                <RatingLine name={"Мария Пряничникова"} score={1000000} num={2} last={3} current={3}/>
                <RatingLine name={"Мария Пряничникова"} score={1000000} num={3} last={3} current={3}/>
            </div>
        </div>

    )
}

export default Rating;