export type CloseButtonProps = {
  onClick?: () => void;
};

export function CloseButton(props: CloseButtonProps) {
  return (
    <button
      className="focus:shadow-outline rounded-full text-gray-500 dark:text-gray-200 m-2 p-2 hover:text-gray-800 "
      type="button"
      onClick={props.onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
