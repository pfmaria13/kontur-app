import logo from "../img/logo-kontur.png"
import playArrow from "../img/play-arrow.png"
import {NavLink, useNavigate} from "react-router-dom";
import Form from "../components/form/Form.tsx"

const MainPage = () => {
    return (
        <div className="main-page-container container">
            <img src={logo} alt="Логотип" className="logo"/>
            <p className="main-text">Пройди игру и получи стикерпак!</p>
            <button className="play-button">
                <p>Играть!</p>
                <img src={playArrow} alt="Стрелка" className="play-arrow"/>
            </button>
            <section className="rules">
                <h2 className="rules-step rules-step1">1. Заполните анкету</h2>
                <p className="rules-text rules-text1">Так мы найдем вас в списке участников. После заполнения откроется
                    игра.</p>
                <h2 className="rules-step rules-step2">2. Пройдите игру</h2>
                <p className="rules-text rules-text2">Отгадайте все слова в сюжетном режиме или соревновании.</p>
                <h2 className="rules-step rules-step3">3. Получите мерч</h2>
                <p className="rules-text rules-text3">Чем больше баллов, тем круче подарок!</p>
            </section>
            <h1 className="select-mode-text">Выбери режим</h1>
            <section className="select-mode select-mode-plot">
                <h2 className="plot-header">Cюжет</h2>
                <h2 className="plot-text">Разгадай 3 IT-слова в формате комикса и помоги котику!</h2>
            </section>
            <NavLink to={"/competition"} className="competition-select">
            <section className="select-mode select-mode-competition">
                <h2 className="competition-header">Соревнование</h2>
                <h2 className="competition-text">Отгадай 5 IT-слов на время. Набери больше всех баллов!</h2>
            </section>
            </NavLink>
            <p className="bottom-text1">© 1988–2025 СКБ Контур</p>
            <p className="bottom-text2">Используем cookies для корректной работы сайта, персонализации пользователей и других целей, предусмотренных Политикой обработкиперсональных данных. 16+</p>
        </div>

    )
}

export default MainPage;