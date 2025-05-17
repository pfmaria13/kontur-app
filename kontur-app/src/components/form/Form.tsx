import "./style.css"
import InputField from "../inputField/inputField.tsx";
import { useState } from "react";

const Form = () => {
    const [selected, setSelected] = useState("");

    return (
        <div className="form-container">
            <h1 className="form-header">Анкета</h1>
            <h2 className="form-question">Как вас зовут</h2>
            <InputField label="Фамилия" type="text"></InputField>
            <InputField label="Имя" type="text"></InputField>
            <InputField label="Отчество" type="text"></InputField>
            <h2 className="form-question">Телеграм</h2>
            <InputField label="@username" type="text"></InputField>
            <p className="telegram-warning">Если у вас нет аккаунта в Телеграме, создайте его – без него вы не сможете
                учавствовать в розыгрыше</p>
            <h2 className="form-question">Электронная почта</h2>
            <InputField label="example@mail.com" type="text"></InputField>
            <h2 className="form-question">На какой специальности вы учитесь?</h2>
            <InputField label="Программная инженерия" type="text"></InputField>
            <h2 className="form-question">На каком курсе вы учитесь?</h2>
            <select className="select-course">
                <option value="value1">1 курс</option>
                <option value="value2">2 курс</option>
                <option value="value3">3 курс</option>
                <option value="value3">4 курс</option>
                <option value="value3">5 курс</option>
                <option value="value3">6 курс</option>
            </select>
            <h2 className="form-question">Какое направление в айти вам интересно?</h2>
            <div className="list-directions">
                <label>
                    <input type="radio" name="role" value="backend" checked={selected === "backend"}
                           onChange={() => setSelected("backend")}/>
                    Бэкенд
                </label>
                <label>
                    <input type="radio" name="role" value="frontend" checked={selected === "frontend"}
                           onChange={() => setSelected("frontend")}/>
                    Фронтенд
                </label>
                <label>
                    <input type="radio" name="role" value="test" checked={selected === "test"}
                           onChange={() => setSelected("test")}/>
                    Тестирование
                </label>
                <label>
                    <input type="radio" name="role" value="dataScience" checked={selected === "dataScience"}
                           onChange={() => setSelected("dataScience")}/>
                    Data Science
                </label>
                <label>
                    <input type="radio" name="role" value="" checked={selected === "systemAnalysis"}
                           onChange={() => setSelected("systemAnalysis")}/>
                    Системный анализ
                </label>
                <label>
                    <input type="radio" name="role" value="" checked={selected === "dataAnalysis"}
                           onChange={() => setSelected("dataAnalysis")}/>
                    Анализ данных
                </label>
                <label>
                    <input type="radio" name="role" value="" checked={selected === "customerService"}
                           onChange={() => setSelected("customerService")}/>
                    Клиентский сервис
                </label>
                <label>
                    <input type="radio" name="role" value="" checked={selected === "sales"}
                           onChange={() => setSelected("sales")}/>
                    Продажи
                </label>
                <label>
                    <input type="radio" name="role" value="" checked={selected === "other"}
                           onChange={() => setSelected("other")}/>
                    Другое
                </label>
            </div>
            <button className="button-ready">Готово</button>
            <p className="warning">Отправляя форму, соглашаетесь на обработку персональных данных  и получение информационных сообщений от группы компаний СКБ Контур.</p>
        </div>
    )
}

export default Form;