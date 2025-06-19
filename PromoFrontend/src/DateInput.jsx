const DateInput = ({ label, value, onChange }) => (
    <div>
        <label>{label}:</label>
        <input type="date" value={value} onChange={e => onChange(e.target.value)} />
    </div>
);

export default DateInput;