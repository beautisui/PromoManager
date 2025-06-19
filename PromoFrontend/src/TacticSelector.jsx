const TacticSelector = ({ tactics, setSelectedTactic }) => (
    <div>
        <label>Tactic:</label>
        <select onChange={e => setSelectedTactic(Number(e.target.value))} defaultValue="">
            <option value="" disabled>Select tactic</option>
            {tactics.map(t => (
                <option key={t.tacticId} value={t.tacticId}>
                    {t.type}
                </option>
            ))}
        </select>
    </div>
);

export default TacticSelector;
