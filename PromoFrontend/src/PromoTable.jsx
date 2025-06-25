import './css/PromoTable.css';

const separateByComma = (arr, key = 'name') =>
    arr
        .slice()
        .sort((a, b) => b[key].localeCompare(a[key]))
        .map(obj => obj[key])
        .join(', ');

const PromoRow = ({ promo, onDelete }) => (
    <tr>
        <td>{promo.promoId}</td>
        <td>{separateByComma(promo.items)}</td>
        <td>{separateByComma(promo.stores)}</td>
        <td>{promo.startTime.slice(0, 10)}</td>
        <td>{promo.endTime.slice(0, 10)}</td>
        <td>{promo.tactic.type}</td>
        <td>
            <button onClick={() => console.log(promo)}>Edit</button>
            <button onClick={() => onDelete(promo.promoId)}>Delete</button>
        </td>
    </tr>
);

export const PromoTable = ({ promotions, onSave, sortBy, sortOrder, setSortBy, setSortOrder }) => {
    const handleHeaderClick = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const handleDeletePromo = async (promoId) => {

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            console.log(baseUrl, "=========> Inside PromoTable");

            const res = await fetch(`/api/promotion/${promoId}`, { method: "DELETE" });

            if (!res.ok) throw new Error("Delete failed");
            onSave();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return '';
        return sortOrder === 'asc' ? ' 🔼' : ' 🔽';
    };

    return (
        <table className="promo-table">
            <thead>
                <tr>
                    <th onClick={() => handleHeaderClick("promoId")}>Promo ID{renderSortIndicator("promoId")}</th>
                    <th onClick={() => handleHeaderClick("items")}>Items{renderSortIndicator("items")}</th>
                    <th onClick={() => handleHeaderClick("stores")}>Stores{renderSortIndicator("stores")}</th>
                    <th onClick={() => handleHeaderClick("startTime")}>Start Date{renderSortIndicator("startTime")}</th>
                    <th onClick={() => handleHeaderClick("endTime")}>End Date{renderSortIndicator("endTime")}</th>
                    <th onClick={() => handleHeaderClick("tactic")}>Tactic{renderSortIndicator("tactic")}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {promotions.map(promo => (
                    <PromoRow key={promo.promoId} promo={promo} onDelete={() => handleDeletePromo(promo.promoId)} />
                ))}
            </tbody>
        </table>
    );
};
