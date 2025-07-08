import "./css/TacticSelector.css";

const TacticSelector = ({ tactics, selectedTactic, setSelectedTactic }) => (
    <div>
        <label>Tactic:</label>
        <select
            value={selectedTactic || ""}
            onChange={e => setSelectedTactic(Number(e.target.value))}
            className="tactic-option"
        >
            <option value="" disabled>Select tactic</option>
            {tactics.map(t => (
                <option key={t.tacticId} value={t.tacticId}>{t.type}</option>
            ))}
        </select>
    </div>
);

export default TacticSelector;
