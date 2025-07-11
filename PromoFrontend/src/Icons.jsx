export const ResetIcon = ({ width = "20", height = "20", className = "", onClick }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={onClick}
    >
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8" />
        <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>

);

export const FilterIcon = ({ className = "" }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path d="M3 4h18l-7 10v5l-4 2v-7L3 4z" />
    </svg>
);

