import "./style.css"
import InputField from "../inputField/inputField.tsx";

const Form = () => {
    return (
        <div className="form-container">
            <h1 className="form-header">Анкета</h1>
            <h2 className="form-question">Как вас зовут</h2>
            <InputField label="Фамилия" type="text"></InputField>
        </div>
    )
}

export default Form;