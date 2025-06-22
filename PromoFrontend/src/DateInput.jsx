const DateInput = ({ label, value, onChange, min }) => (
    <div>
        <label>{label}:</label>
        <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            min={min}
        />
    </div>
);

export default DateInput;
