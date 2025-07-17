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


export const ExportIcon = <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={{ marginRight: "5px" }}
>
    <path d="M.5 9.9v3.6c0 .3.2.5.5.5h14c.3 0 .5-.2.5-.5V9.9c0-.3.2-.5.5-.5s.5.2.5.5v3.6c0 .8-.7 1.5-1.5 1.5H1.5C.7 15 0 14.3 0 13.5V9.9c0-.3.2-.5.5-.5s.5.2.5.5z" />
    <path d="M7.5 10.5c.1 0 .3-.1.4-.2l3-3c.2-.2.2-.5 0-.7s-.5-.2-.7 0L8 8.3V1.5C8 1.2 7.8 1 7.5 1S7 1.2 7 1.5v6.8L5.8 6.6c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l3 3c.1.1.2.2.4.2z" />
</svg>;
