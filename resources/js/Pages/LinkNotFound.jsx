import { FaLinkSlash } from "react-icons/fa6";

function LinkNotFound() {
    return <div className="p-8 bg-gray-50 min-h-screen flex">
        <div className="max-w-5xl mx-auto size-full bg-white rounded-xl shadow flex flex-col items-center gap-6 p-6">
            <FaLinkSlash className='text-9xl font-bold text-red-600'/>
            <div className='flex flex-col gap-1'>
                <h2 className="text-xl text-gray-600 text-center m-0">Link tidak ditemukan</h2>
            </div>
        </div>
    </div>
}

export default LinkNotFound;