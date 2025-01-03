export const BookDowloadSvg = ({ width = 24, height = 24 }) => {
  return (
    <svg
      width={`${width}`}
      height={`${height}`}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v5" />
      <path d="M13 16h-7a2 2 0 0 0 -2 2" />
      <path d="M15 19l3 3l3 -3" />
      <path d="M18 22v-9" />
    </svg>
  );
};
