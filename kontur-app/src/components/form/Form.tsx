import "./style.css";
import InputField from "../inputField/inputField.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        patronymic: "",
        telegram: "",
        email: "",
        specialty: "",
        course: "1 курс",
        direction: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: "" })); // Сброс ошибки при изменении
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.lastName.trim()) newErrors.lastName = "Введите фамилию";
        if (!formData.firstName.trim()) newErrors.firstName = "Введите имя";
        if (!formData.telegram.trim()) newErrors.telegram = "Введите телеграм";
        else if (!formData.telegram.startsWith("@")) newErrors.telegram = "Телеграм должен начинаться с @";

        if (!formData.email.trim()) newErrors.email = "Введите почту";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Неверный формат почты";
        }

        if (!formData.specialty.trim()) newErrors.specialty = "Введите специальность";
        if (!formData.course) newErrors.course = "Выберите курс";
        if (!formData.direction) newErrors.direction = "Выберите направление";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                navigate("/main");
            } else {
                alert(result.message || "Ошибка регистрации");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при отправке данных.");
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Анкета</h1>

            <h2 className="form-question">Как вас зовут</h2>
            <InputField label="Фамилия" type="text" onChange={(e) => handleChange("lastName", e.target.value)} />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
            <InputField label="Имя" type="text" onChange={(e) => handleChange("firstName", e.target.value)} />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
            <InputField label="Отчество" type="text" onChange={(e) => handleChange("patronymic", e.target.value)} />

            <h2 className="form-question">Телеграм</h2>
            <InputField label="@username" type="text" onChange={(e) => handleChange("telegram", e.target.value)} />
            {errors.telegram && <p className="error">{errors.telegram}</p>}

            <h2 className="form-question">Электронная почта</h2>
            <InputField label="example@mail.com" type="text" onChange={(e) => handleChange("email", e.target.value)} />
            {errors.email && <p className="error">{errors.email}</p>}

            <h2 className="form-question">На какой специальности вы учитесь?</h2>
            <InputField label="Программная инженерия" type="text" onChange={(e) => handleChange("specialty", e.target.value)} />
            {errors.specialty && <p className="error">{errors.specialty}</p>}

            <h2 className="form-question">На каком курсе вы учитесь?</h2>
            <select className="select-course" onChange={(e) => handleChange("course", e.target.value)} value={formData.course}>
                <option value="">Выберите курс</option>
                <option value="1 курс">1 курс</option>
                <option value="2 курс">2 курс</option>
                <option value="3 курс">3 курс</option>
                <option value="4 курс">4 курс</option>
                <option value="5 курс">5 курс</option>
                <option value="6 курс">6 курс</option>
            </select>
            {errors.course && <p className="error">{errors.course}</p>}

            <h2 className="form-question">Какое направление в айти вам интересно?</h2>
            <div className="list-directions">
                {[
                    { label: "Бэкенд", value: "backend" },
                    { label: "Фронтенд", value: "frontend" },
                    { label: "Тестирование", value: "test" },
                    { label: "Data Science", value: "dataScience" },
                    { label: "Системный анализ", value: "systemAnalysis" },
                    { label: "Анализ данных", value: "dataAnalysis" },
                    { label: "Клиентский сервис", value: "customerService" },
                    { label: "Продажи", value: "sales" },
                    { label: "Другое", value: "other" },
                ].map(({ label, value }) => (
                    <label key={value}>
                        <input type="radio" name="role" value={value} checked={formData.direction === value} onChange={() => handleChange("direction", value)} />
                        {label}
                    </label>
                ))}
            </div>
            {errors.direction && <p className="error">{errors.direction}</p>}

            <button className="button-ready" onClick={handleSubmit}>Готово</button>
            <p className="warning">Отправляя форму, вы соглашаетесь на обработку персональных данных.</p>
        </div>
    );
};

export default Form;
