import logo from "../img/logo-kontur.png"
import arrowBack from "../img/arrow-back.png"
import {NavLink, useNavigate} from "react-router-dom";
import Form from "../components/form/Form.tsx"
import example1 from "../img/examle1.png"
import example2 from "../img/examle2.png"

const Rules = () => {
    return (
        <div className="rules-page-container container">
            <img src={logo} alt="Логотип" className="logo"/>
            <div className="rules-top">
                <img src={arrowBack} alt="" className="arrow-back"/>
                <h1 className="rules-header">Правила</h1>
            </div>
            <p className="rules-p">Отгадай существительное в единственном числе с 6-7 попыток. Каждая попытка -
                существующее слово на 5 или 6 букв.</p>
            <p className="rules-p">После каждой попытки цвет букв будет меняться, показывая, какие буквы есть в
                загаданном слове.</p>
            <img src={example1} className="example1"/>
            <p className="rules-p">
                <span className="green-text">Зеленый</span> - буква стоит в загаданном слове на том же месте.
            </p>
            <img src={example2} className="example2"/>
            <p className="rules-p">
                <span className="orange-text">Оранжевый</span> - буква есть в загаданном слове, но стоит в другом месте.
            </p>
            <p className="rules-p"><b>Без цвета</b> - такой буквы в слове нет.</p>
        </div>

    )
}

export default Rules;