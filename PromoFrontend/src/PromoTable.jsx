import './css/PromoTable.css';

const separateByComma = (arr, key = 'name') =>
    arr
        .slice()
        .sort((a, b) => b[key].localeCompare(a[key]))
        .map(obj => obj[key])
        .join(', ');

const PromoRow = ({ promo, onDelete }) => {
    return (
        <tr>
            <td>{promo.promoId}</td>
            <td>{separateByComma(promo.items)}</td>
            <td>{separateByComma(promo.stores)}</td>
            <td>{promo.startTime.slice(0, 10)}</td>
            <td>{promo.endTime.slice(0, 10)}</td>
            <td>{promo.tactic.type}</td>
            <td>
                <button>Edit</button>
                <button onClick={() => onDelete(promo.promoId)}>Delete</button>
            </td>
        </tr>
    );
};

const createHeader = ({ columnName, field, onSort, renderSortIndicator, onFilter }) => {

    console.log(field, '==========================> ');

    return (
        <>
            <span onClick={() => onSort(field)}>
                {columnName}{renderSortIndicator(field)}
            </span>

            <span onClick={(e) => {
                e.stopPropagation();
                onFilter(field);
            }}>☰
            </span>
        </>
    );
};


export const PromoTable = ({ promotions, onSave, sortBy, sortOrder, setSortBy, setSortOrder, onFilter, setFilterColumn }) => {

    const handleSorting = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
            return;
        }
        setSortBy(field);
        setSortOrder("desc");
    };

    const handleDeletePromo = async (promoId) => {

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/promotion/${promoId}`, { method: "DELETE" });

            if (!res.ok) throw new Error("Delete failed");
            onSave();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const editPromo = async (promo) => {
        try {
            console.log("Edited Promo is ===>", promo);
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${baseUrl}/api/promotion`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(promo)
            })

            if (!response.ok) throw new Error("Edit Failed");
            onSave();
        } catch (error) {
            console.error("Edit error:", error)
        }
    }

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return '';
        return sortOrder === 'asc' ? ' 🔼 ' : ' 🔽 ';
    };

    const handleFilter = (field) => {
        setFilterColumn(field);
        console.log("Inside handle filte", onFilter);
    }

    return (
        <table className="promo-table">
            <thead>
                <tr>
                    <th>
                        {createHeader({
                            columnName: "Promo ID",
                            field: "promoId",
                            onSort: handleSorting,
                            renderSortIndicator: renderSortIndicator,
                            onFilter: handleFilter
                        })}
                    </th>

                    <th>
                        {createHeader({
                            columnName: "items",
                            field: "items",
                            onSort: handleSorting,
                            renderSortIndicator: renderSortIndicator,
                            onFilter: handleFilter
                        })}
                    </th>

                    <th onClick={() => handleSorting("stores")}>Stores{renderSortIndicator("stores")}</th>
                    <th onClick={() => handleSorting("startTime")}>Start Date{renderSortIndicator("startTime")}</th>
                    <th onClick={() => handleSorting("endTime")}>End Date{renderSortIndicator("endTime")}</th>
                    <th onClick={() => handleSorting("tactic")}>Tactic{renderSortIndicator("tactic")}</th>
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
