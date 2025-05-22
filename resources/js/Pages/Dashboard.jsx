import React, { useRef, useState } from 'react';
import { apiProduction } from "@src/Persistance/API";
import { FaWhatsappSquare } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { GiCardRandom } from "react-icons/gi";
import { RiPagesLine } from "react-icons/ri";
import { BiSolidMoviePlay } from "react-icons/bi";
import { GrStatusUnknown } from "react-icons/gr";
import { FaCheckCircle } from "react-icons/fa";

const StepEnum = {
    LIST: "List",
    FORM: "Form",
    DONE: "Done"
};
Object.prototype.isEmpty = function() {
    return this === null || this === undefined || this === '' || 
           (Array.isArray(this) && this.length === 0) || 
           (typeof this === 'object' && Object.keys(this).length === 0);
};

function Dashboard() {
    const [frame, setFrame] = useState(StepEnum.LIST);
    const [type, setType] = useState("Shortlink Single Page");
    const [loading, setLoading] = useState(false);
    const [errList, setErrList] = useState({});

    const [slug, setSlug] = useState(null);
    const [url, setUrl] = useState(null);
    const [metaTitle, setMetaTitle] = useState(null);
    const [metaDesc, setMetaDesc] = useState(null);
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [result, setResult] = useState(null);

    const fieldOptions = [
        { label: "Shortlink Single Page", desc: "Generate Single Link", icon: <FaLink className='text-2xl font-bold'/>, disable: false },
        { label: "Shortlink Whatsapp", desc: "Generate Link Khusus Whatsapp", icon: <FaWhatsappSquare className='text-2xl font-bold'/>, disable: true },
        { label: "Random Link", desc: "Generate Multi Link", icon: <GiCardRandom className='text-2xl font-bold'/>, disable: true },
        { label: "Landing Page Whatsapp", desc: "Generate LP Whatsapp", icon: <RiPagesLine className='text-2xl font-bold'/>, disable: true },
        { label: "Landing Page Movie", desc: "Generate LP Movie", icon: <BiSolidMoviePlay className='text-2xl font-bold'/>, disable: true },
        { label: "Landing Page Adult", desc: "Generate LP Adult", icon: <GrStatusUnknown className='text-2xl font-bold'/>, disable: true },
        { label: "Landing Page Loker", desc: "Generate LP Loker", icon: <GrStatusUnknown className='text-2xl font-bold'/>, disable: true },
        { label: "Landing Page MovieHUB", desc: "Generate LP MovieHUB", icon: <GrStatusUnknown className='text-2xl font-bold'/>, disable: true },
        { label: "TWT Random Link", desc: "Generate Hanya Untuk Penggunaan TWT", icon: <GrStatusUnknown className='text-2xl font-bold'/>, disable: true }
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setFilePreview(file?.name ?? "");
            setErrList(prev => {
                const { file, ...rest } = prev;
                return rest;
            });
        }
    };

    async function SaveHandler(){
        setLoading(true)
        try {
            console.log(`execute SaveHandler to call /api/create-link`)
            const formData = new FormData();
            const input = {
                slug,
                url,
                metaTitle,
                metaDesc,
                file
            };

            Object.entries(input).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            const response = await apiProduction.post("/create-link", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200 || response.status === 204) {
                alert("berhasil simpan data")
                setFrame(StepEnum.DONE)
                setResult(response?.data);
            }
        } catch (error) {
            // console.error(error.response?.data)

            const status = error.response?.status;
            const detail = error.response?.data?.Detail ?? "ada masalah pada aplikasi";

            if (status === 400) {
                alert(detail)
            } else if(status === 500){
                if(error.response?.data?.Title=="dashboard.invalidValidation"){
                    setErrList(detail)
                } else{
                    alert(detail)
                }
            } else{
                console.error(detail)
            }
        } finally {
            setLoading(false)
        }
    }

    function RenderPage(){
        if(frame=="List"){
            return <>
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a field for your collection type</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {fieldOptions.map((field, idx) => (
                        <button
                        key={idx}
                        onClick={()=>{
                            setFrame(StepEnum.FORM);
                            setType(field.label);
                        }}
                        className={`flex items-start gap-4 p-4 border rounded-lg ${!field.disable? "hover:shadow-md hover:bg-purple-200":""} transition bg-gray-50 cursor-pointer`}
                        >
                            {field.icon}
                            <div>
                                <div className="font-medium text-gray-900">{field.label}</div>
                                <div className="text-sm text-gray-600">{field.desc}</div>
                            </div>
                        </button>
                    ))}
                    </div>
                </div>
            </>;
        } else if(frame=="Form"){
            return <>
            <div className="max-w-5xl mx-auto size-full bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{type}</h2>
                <div className="flex flex-col gap-3">
                    <div className="*:not-first:mt-2">
                        <label 
                            data-slot="label" 
                            className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" 
                            for=":S1:">
                            Slug (Kode di belakang URL)
                            <span className="text-red-500"> *</span>
                        </label>
                        <input 
                            data-slot="input" 
                            className="border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" 
                            id=":S1:" 
                            placeholder="http://cdc.unpak.ac.id/kode slug" 
                            type="text"
                            value={slug}
                            onChange={(e)=>setSlug(e.target.value)}/>
                    </div>
                    <div className="*:not-first:mt-2">
                        <label 
                            data-slot="label" 
                            className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" 
                            for=":S1:">
                            URL Asli
                            <span className="text-red-500"> *</span>
                        </label>
                        <input 
                            data-slot="input" 
                            className="border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" 
                            id=":S1:" 
                            placeholder="misal: https://google.com" 
                            type="text"
                            value={url}
                            onChange={(e)=>setUrl(e.target.value)}/>
                    </div>
                    <div className="*:not-first:mt-2">
                        <label 
                            data-slot="label" 
                            className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" 
                            for=":S1:">
                            Meta Title
                        </label>
                        <input 
                            data-slot="input" 
                            className="border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" 
                            id=":S1:" 
                            placeholder="Input meta title" 
                            type="text"
                            value={metaTitle}
                            onChange={(e)=>setMetaTitle(e.target.value)}/>
                    </div>
                    <div className="*:not-first:mt-2">
                        <label 
                            data-slot="label" 
                            className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" 
                            for=":S1:">
                            Meta Deskripsi
                        </label>
                        <input 
                            data-slot="input" 
                            className="border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" 
                            id=":S1:" 
                            placeholder="Input meta deskripsi" 
                            type="text"
                            value={metaDesc}
                            onChange={(e)=>setMetaDesc(e.target.value)}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label 
                            data-slot="label" 
                            className="text-foreground text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" 
                            for=":S1:">
                            Image Cover
                        </label> 
                        <div role="button" onClick={() => fileRef.current?.click()} className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]">
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg, image/png, image/gif, image/bmp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image-up size-4 opacity-60" aria-hidden="true"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"></path><path d="m14 19.5 3-3 3 3"></path><path d="M17 22v-5.5"></path><circle cx="9" cy="9" r="2"></circle></svg>
                                </div>
                                <p className="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
                                <p className="text-muted-foreground text-xs">Max size: 5MB</p>
                            </div>
                        </div>
                        {filePreview && 
                        <div className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text size-4 opacity-60" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="truncate text-[13px] font-medium m-0">{filePreview}</p>
                                    {/* <p className="text-muted-foreground text-xs m-0">516.34KB</p> */}
                                </div>
                            </div>
                            <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent" aria-label="Remove file">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x size-4" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </button>
                        </div>}
                    </div>
                    <button onClick={SaveHandler} data-slot="button" className={`!rounded-[20px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none h-9 px-4 py-2 ${loading? "disabled:pointer-events-none disabled:opacity-50 bg-gray-300 hover:bg-gray-400/90 text-gray-400-foreground":"bg-blue-500 hover:bg-blue-700/90 text-white"}`} disabled="">
                        {loading && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-loader-circle -ms-1 animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>}
                        Buat Link
                    </button>
                </div>
            </div>
            </>;
        } else if(frame=="Done"){
            return <div className="max-w-5xl mx-auto size-full bg-white rounded-xl shadow flex flex-col items-center gap-6 p-6">
                <FaCheckCircle className='text-9xl font-bold text-green-600'/>
                <div className='flex flex-col gap-1'>
                    <h2 className="text-xl text-gray-600 text-center m-0">Berhasil Buat ShortLink</h2>
                    <h4 className="text-md font-semibold text-gray-800 text-center">{result}</h4>
                </div>
            </div>;
        }
    }

    return <div className="p-8 bg-gray-50 min-h-screen flex">
      {RenderPage()}
    </div>
}
export default Dashboard;