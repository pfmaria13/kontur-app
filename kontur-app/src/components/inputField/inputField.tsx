import "./style.css"

interface FieldProps {
    label: string,
    type: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value?: string
}

const inputField: React.FC<FieldProps> = ({type, onChange, value})  => {
    return (
        <div className="inputfield-container">
            <input
                type={type}
                className="input"
                required
                value={value}
                onChange={onChange}
            />

        </div>
    )
}

export default inputField;