/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useSession } from "next-auth/react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { countries, JWTPayload, } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronCircleLeft } from "react-icons/fa";
import axios from "axios";
import { DOMAIN } from "@/lib/constants";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";


interface Props {
    users: User
    payload: JWTPayload
}

const ProfileUser = ({ users, payload }: Props) => {
    const router = useRouter();

    const { data: session, } = useSession();
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [userName, setUserName] = useState(session?.user?.name || users.username || "");
    const [email, setEmail] = useState(session?.user?.email || users.email || "");

    const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null);
    const [phone, setPhone] = useState<string>("");
    const [streetAddress, setStreetAddress] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedRols, setSelectedRols] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    console.log("payload UserName: ", payload.username)
    console.log("User UserName: ", users.username)
    // console.log("Profile data:", users.profile?.[0]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${DOMAIN}/api/dashboard/users/${users.id}`);
                const data = res.data;
                console.log("dataaaaaaa", data)

                setSelectedRols(data.role);
                setSelectedStatus(data.status);
                setPhone(data.phoneNumber);
                setStreetAddress(data.streetAddress);
                setPostalCode(data.postalCode);
                setSelectedCountry(data.country);
                setImageUploadUrl(data.imageUrl);

            } catch (error: any) {
                toast.error(error?.response?.data.message);
                // toast.info("This user has not provided all the information.");
            }
        };

        fetchProfile();
    }, []);

    // lazem najem namel crate and update lel user with profile

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: async ([data]) => {
            const imageUrl = data.ufsUrl;

            setImageUploadUrl(imageUrl);
            setUploadProgress(0);
            toast.success("Image uploaded successfully");

        },
        onUploadProgress(p: number) {
            setUploadProgress(p);
        },
    });


    const onDropRejected = (rejectedFiles: FileRejection[]) => {
        const [] = rejectedFiles;
    };

    const onDropAccepted = (acceptedFiles: File[]) => {
        startUpload(acceptedFiles, { configId: undefined });
        // console.log("accepted");
    };

    const handleProfileInfoUpdate = async (ev: React.FormEvent) => {
        ev.preventDefault();
        console.log(users.id)
        try {
            await axios.put(`${DOMAIN}/api/dashboard/users/${users.id}`, {
                username: userName,
                email: email,
                rols: selectedRols,
                status: selectedStatus,
                phoneNumber: phone,
                streetAddress: streetAddress,
                city: city,
                postalCode: postalCode,
                country: selectedCountry,
                imageUrl: imageUploadUrl,
            });


            toast.success("Create Profile");
            router.refresh();
            // toast.success("Updated successfully!");
            router.refresh();
        } catch (error: any) {
            console.log("❌❌❌❌❌❌", error)
            toast.error(error?.response?.data.message);
        }
    };

    return (
        <section className="mt-8">
            <div className="text-center ">
                <Button variant="outline" className="px-10 hover:border-green-400">
                    <Link href="/dashboard/users" className="flex gap-4 items-center">
                        Back Dashboard Users <FaChevronCircleLeft className="w-8 h-8 animate-pulse text-primary" />
                    </Link>
                </Button>
            </div>

            <div className='max-w-lg sm:mx-auto mx-8 mt-8'>
                <div className="flex flex-col  items-center gap-4 md:flex-row md:items-start">
                    <div>
                        <div className="p-2 rounded-lg overflow-hidden relative max-w-[200px] md:max-w-[180px]">
                            <Image
                                unoptimized
                                src={imageUploadUrl || session?.user?.image || "/login_light_mode.jpeg"} alt='avatar'
                                width={"180"}
                                height={"180"}
                                className='rounded-lg mb-2 w-full h-full' />

                            <Dropzone
                                onDropRejected={onDropRejected}
                                onDropAccepted={onDropAccepted}
                                accept={{
                                    "image/png": [".png"],
                                    "image/jpg": [".jpg"],
                                    "image/heic": [".heic"],
                                }}
                                onDragEnter={() => {
                                    setIsDragOver(true);
                                }}
                                onDragLeave={() => {
                                    setIsDragOver(false);
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div className="" {...getRootProps()}>
                                        <input {...getInputProps()} />

                                        <span className="block border text-sm border-gray-300 rounded-lg p-2 text-center cursor-pointer font-semibold">
                                            {uploadProgress > 0 ? (
                                                <>
                                                    <Progress
                                                        value={uploadProgress}
                                                        className="my-2 w-[5.5rem] h-2 bg-gray-300"
                                                    />
                                                </>
                                            ) : (
                                                "Chess file"
                                            )}
                                        </span>
                                    </div>
                                )}
                            </Dropzone>
                        </div>
                    </div>

                    <form className="grow" onSubmit={handleProfileInfoUpdate}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-gray-500 text-xs">
                                    Fisrt and last name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="First and last name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className={userName === "" ? "bg-red-200" : "bg-green-200"}
                                />
                            </div>

                            <div>
                                <label className="text-gray-500 text-xs">Email</label>
                                <Input

                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-green-200"
                                />
                            </div>

                            <div>
                                <label className="text-gray-500 text-xs">Phone</label>
                                <Input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(ev) => setPhone(ev.target.value)}
                                    className={!phone ? "bg-red-200" : "bg-green-200"}
                                />
                            </div>

                            <div>
                                <label className="text-gray-500 text-xs">Street address</label>
                                <Input
                                    type=""
                                    placeholder="Street address"
                                    value={streetAddress}
                                    onChange={(ev) => setStreetAddress(ev.target.value)}
                                    className={
                                        streetAddress === "" ? "bg-red-200" : "bg-green-200"
                                    }
                                />
                            </div>

                            <div className="flex gap-4">
                                <div>
                                    <label className="text-gray-500 text-xs">City</label>
                                    <Input
                                        type=""
                                        placeholder="City"
                                        value={city}
                                        onChange={(ev) => setCity(ev.target.value)}
                                        className={city === "" ? "bg-red-200" : "bg-green-200"}
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs">Postal code</label>
                                    <Input
                                        type=""
                                        placeholder="Postal Code"
                                        value={postalCode}
                                        onChange={(ev) => setPostalCode(ev.target.value)}
                                        className={
                                            postalCode === "" ? "bg-red-200" : "bg-green-200"
                                        }
                                    />
                                </div>
                            </div>

                            {/* ROLS & STATUS */}
                            {payload.email === "mobileShop@admin.com" || payload.isAdmin === true ? (

                                <div className="flex space-x-4">
                                    {/* ROLS */}
                                    <div>
                                        <label className="text-gray-500 text-xs">Rols</label>
                                        <Select onValueChange={(value) => setSelectedRols(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={selectedRols || "User"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {payload.email === "admin@gmail.com" &&
                                                        payload.isAdmin &&
                                                        users.role === "Admin"
                                                        &&
                                                        <SelectItem value="Admin">gooood</SelectItem>}

                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Manager">Manager</SelectItem>
                                                    <SelectItem value="User">User</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* STATUS */}
                                    <div>
                                        <label className="text-gray-500 text-xs">Status</label>
                                        <Select onValueChange={(value) => setSelectedStatus(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={selectedStatus || "Inactive"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ) : <span>you are not admin</span>}

                            {/* COUNTRY */}
                            <div>
                                <label className="text-gray-500 text-xs">Country</label>
                                <Select onValueChange={(value) => setSelectedCountry(value)}>
                                    <SelectTrigger
                                        className={`w-[180px] ${!selectedCountry ? "bg-background" : "bg-green-200"
                                            } flex items-center gap-2`}
                                    >
                                        {selectedCountry ? (
                                            <>    <span>{selectedCountry}</span>
                                                <Image
                                                    src={
                                                        countries.find((c) => c.name === selectedCountry)?.image || ""
                                                    }
                                                    alt={`${selectedCountry} flag`}
                                                    width={32}
                                                    height={32}
                                                    className="sm:w-6 sm:h-6 w-5 h-5 rounded-full object-cover"
                                                />
                                            </>
                                        ) : (
                                            <span className="text-gray-400">Country</span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent className="z-[999]">
                                        <SelectGroup>
                                            <SelectLabel className="flex items-center gap-2">
                                                <Globe className="h-5 w-5 animate-spin-slow-word text-blue-800" />
                                                Select your country
                                            </SelectLabel>
                                            {countries.map((country) => (
                                                <div key={country.code}>
                                                    <SelectItem
                                                        value={country.name}

                                                    >
                                                        <span>{country.name}</span>
                                                        {country.image && (
                                                            <Image
                                                                src={country.image}
                                                                alt={`${country.name} flag`}
                                                                width={25}
                                                                height={25}
                                                                className="absolute top-2 right-3"
                                                            />
                                                        )}
                                                    </SelectItem>
                                                </div>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full text-white hover:cursor-pointer"
                                disabled={uploadProgress > 0}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ProfileUser
