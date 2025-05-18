// src/pages/Login.tsx
import React, { useEffect } from "react";
import logo from "../img/logo-kontur.png";
import playArrow from "../img/play-arrow.png";
import { useNavigate } from "react-router-dom";
import Form from "../components/form/Form";

const Login: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const telegram = localStorage.getItem("telegram");
        if (telegram) {
            navigate("/mainPage", { replace: true });
        }
    }, [navigate]);

    const handlePlay = () => {
        navigate("/form");
    };

    return (
        <div className="login-page-container container">
            <img src={logo} alt="Логотип" className="logo" />
            <p className="main-text">Пройди игру и получи стикерпак!</p>
            <button className="play-button" onClick={handlePlay}>
                <p>Играть!</p>
                <img src={playArrow} alt="Стрелка" className="play-arrow" />
            </button>

            <section className="rules">
                <h2 className="rules-step rules-step1">1. Заполните анкету</h2>
                <p className="rules-text rules-text1">
                    Так мы найдём вас в списке участников. После заполнения откроется игра.
                </p>
                <h2 className="rules-step rules-step2">2. Пройдите игру</h2>
                <p className="rules-text rules-text2">
                    Отгадайте все слова в сюжетном режиме или соревновании.
                </p>
                <h2 className="rules-step rules-step3">3. Получите мерч</h2>
                <p className="rules-text rules-text3">
                    Чем больше баллов, тем круче подарок!
                </p>
            </section>

            <Form />
        </div>
    );
};

export default Login;
