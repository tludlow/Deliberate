import { RightArrowIcon } from '../icons'

export default function Task() {
    return (
        <div className="flex items-center w-full h-full bg-white rounded">
            <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-4 h-full bg-green-400 rounded-l">
                <div className="absolute flex items-center justify-center bg-green-500 rounded-full shadow w-7 h-7">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex-grow h-full p-4">
                <h5 className="text-sm font-semibold">Coffee with Rachel</h5>
                <p className="flex items-center text-xs font-medium text-gray-500">
                    12 PM <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> 1 PM
                </p>
            </div>
        </div>
    )
}
