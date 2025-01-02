export const IsLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center">
      <svg
        className="w-12 h-12 animate-spin text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="mt-4 text-sm text-gray-500">Fetching your notes... Please wait.</p>
    </div>
  </div>
)