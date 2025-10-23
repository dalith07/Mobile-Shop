"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { countries, JWTPayload } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Dropzone, { FileRejection } from "react-dropzone";
import { toast } from 'sonner'; import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from "@/components/ui/select";
import { Eye, EyeOff, FileImage, Globe, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DOMAIN } from '@/lib/constants';
import axios from "axios";
import { Button } from '@/components/ui/button';

const ProfilePage = ({ payload }: { payload: JWTPayload }) => {
    const router = useRouter();
    const { data: session } = useSession();

    const [userName, setUserName] = useState(session?.user?.name || payload?.username || "");

    const [email, setEmail] = useState(session?.user?.email || payload?.email || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)

    const [imageUploadUrl, setImageUploadUrl] = useState<string | null>("");
    const [phone, setPhone] = useState<string>("");
    const [streetAddress, setStreetAddress] = useState<string>("");
    const [postalCode, setPostalCode] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<string>("");

    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: async ([data]) => {
            const imageUrl = data.ufsUrl;

            setImageUploadUrl(imageUrl || session?.user.image || "/login_light_mode.jpeg");

            setUploadProgress(0); // <--- reset progress
            toast.success("Image uploaded successfully");
        },

        onUploadProgress(p: number) {
            // console.log("P from onUploadProgress go to setUploadProgress => ", p);
            setUploadProgress(p);
        },
    });

    const onDropAccepted = (acceptedFiles: File[]) => {
        // console.log("✅ Files accepted:", acceptedFiles);
        startUpload(acceptedFiles, { configId: undefined });
    };

    const onDropRejected = (rejectedFiles: FileRejection[]) => {
        const [file] = rejectedFiles;
        // console.log("❌ Files rejected:", rejectedFiles);
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${DOMAIN}/api/users/profile`);
                const data = res.data;

                // console.log("Fetched profile data:", data); // ✅ Check this

                setPhone(data.phoneNumber);
                setStreetAddress(data.streetAddress);
                setCity(data.city);
                setPostalCode(data.postalCode);
                setSelectedCountry(data.country);
                setImageUploadUrl(data.imageUrl);
                setPassword(data.User.password);

            } catch (error: any) {
                toast.info(error?.response?.data.message);
                toast.warning("please kamel 3amer el tabel");
            }
        };

        fetchProfile();
    }, []);


    const handleProfileInfoUpdate = async (ev: React.FormEvent) => {
        ev.preventDefault();
        try {
            // await axios.put(`${DOMAIN}/api/users/profile`, { username: userName });
            await axios.post(`${DOMAIN}/api/users/profile`, {
                phoneNumber: phone,
                streetAddress: streetAddress,
                city: city,
                postalCode: postalCode,
                country: selectedCountry,
                imageUrl: imageUploadUrl,
                // imageUrl: imageUploadUrl,
            });

            toast.success("Create Profile");
            router.refresh();

            await axios.put(`${DOMAIN}/api/users/profile`, {
                username: userName,
                password: password,
                phoneNumber: phone,
                streetAddress: streetAddress,
                city: city,
                postalCode: postalCode,
                country: selectedCountry,
                imageUrl: imageUploadUrl,
            });

            // toast.success("Updated successfully!");
            router.refresh();
        } catch (error: any) {
            toast.error(error?.response?.data.message);
        }


    };

    return (
        <section className='mt-8 h-[90vh] '>
            <h1 className='text-center text-primary text-4xl font-semibold'>
                Profile
            </h1>

            <div className="max-w-lg sm:mx-auto mx-4 mt-4 flex items-center justify-center" >
                <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
                    <div>
                        <div className='w-5/5 h-5/5'>
                            <Image
                                unoptimized
                                src={imageUploadUrl || session?.user?.image || "/login_light_mode.jpeg"}
                                alt='avatar'
                                width={"150"}
                                height={"150"}
                                className='rounded-lg mb-2' />
                        </div>
                        <Dropzone
                            onDropRejected={onDropRejected}
                            onDropAccepted={onDropAccepted}
                            accept={{
                                "image/*": [".png", ".jpg", ".jpeg", ".heic", ".webp"],
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

                                    <span className="block border border-gray-300 rounded-lg p-2 mt-2 text-center cursor-pointer font-semibold">
                                        {uploadProgress > 0 ? (
                                            <Progress value={uploadProgress} className="my-2 w-full h-2 bg-gray-300" />
                                        ) : (
                                            <span className='flex flex-row items-center gap-2'> <FileImage className='text-primary' /> Chess file</span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    <form className='grow' onSubmit={handleProfileInfoUpdate}>
                        <div className='flex flex-col space-y-2'>

                            {/* USERNAME & LAST NAME */}
                            <div>
                                <label className="text-gray-500 text-xs">
                                    Fisrt and last name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="First and last name"
                                    value={userName}
                                    onChange={(ev) => setUserName(ev.target.value)}
                                    className=""
                                />
                            </div>


                            {/* EMAIL */}
                            <div>
                                <label className="text-gray-500 text-xs">Email</label>
                                <Input
                                    type="text"
                                    placeholder="exemple@gmail.com"
                                    disabled
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    className=""
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="text-gray-500 text-xs">Password</label>

                                <div className='relative'>
                                    <Input
                                        disabled
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        value={password ? password : "Still under development"}
                                        // value={password}
                                        onChange={(ev) =>
                                            setPassword(ev.target.value)}
                                        className={`${password ? "" : "text-red-400"} pr-10`}
                                    />

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button></div>

                            </div>

                            {/* PHONE NUMBER & STRESS ADDRESS */}
                            <div className='flex space-x-2'>
                                <div>
                                    <label className="text-gray-500 text-xs">Phone Number</label>
                                    <Input
                                        type="text"
                                        placeholder="55 555 555"
                                        value={phone} onChange={(ev) =>
                                            setPhone(ev.target.value)}
                                        className=""
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-500 text-xs">Street Address</label>
                                    <Input
                                        type="text"
                                        placeholder="street Address"
                                        value={streetAddress} onChange={(ev) =>
                                            setStreetAddress(ev.target.value)}
                                        className=""
                                    />
                                </div>
                            </div>


                            {/* POSTAL CODE & CITY */}
                            <div className='flex space-x-2'>
                                <div>
                                    <label className="text-gray-500 text-xs">Postal Code</label>
                                    <Input
                                        type="text"
                                        placeholder="postal code ( 1234 )"
                                        value={postalCode} onChange={(ev) =>
                                            setPostalCode(ev.target.value)}
                                        className=""
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-500 text-xs">City</label>
                                    <Input
                                        type="text"
                                        placeholder="city ( mahdia )"
                                        value={city} onChange={(ev) =>
                                            setCity(ev.target.value)}
                                        className=""
                                    />
                                </div>
                            </div>

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
                                                    className="sm:w-7 sm:h-7 w-6 h-6 rounded-full object-cover"
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
                                className="text-lg text-white font-bold cursor-pointer flex items-center justify-center gap-2"
                                disabled={uploadProgress > 0}
                            >
                                <Save />
                                Save
                            </Button>

                        </div>

                    </form>
                </div>

            </div>
        </section>
    )
}

export default ProfilePage
