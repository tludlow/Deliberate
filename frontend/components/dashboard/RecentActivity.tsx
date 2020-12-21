export function RecentActivity() {
    return (
        <li className="flex items-center col-span-1 bg-white border border-gray-200 rounded-md shadow-sm">
            <div className="pl-2">
                <svg
                    className="w-8 h-8 text-green-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <div className="flex-1 px-4 py-2 text-">
                <p className="font-medium leading-5 text-gray-900">New Issue</p>
                <p className="flex-wrap mt-1 text-sm text-gray-500">
                    You have been assigned an issue from <span className="font-medium">Deliberate</span>
                </p>
            </div>
        </li>
    )
}
