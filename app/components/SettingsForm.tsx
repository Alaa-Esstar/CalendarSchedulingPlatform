'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "./SubmitButtons"
import { useFormState } from "react-dom"
import { SettingAction } from "../actions"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { settingsSchema } from "../lib/zodSchemas"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { UploadDropzone } from "../lib/uploadthing"
import { toast } from "sonner"

interface iAppProps {
    fullName: string;
    email: string;
    profileImage: string;
}

export function SettingsForm({ email, fullName, profileImage }: iAppProps) {
    const [lastResult, action] = useFormState(SettingAction, undefined);
    const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: settingsSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onSubmit",
    });

    const handleDeleteImage = () => {
        setCurrentProfileImage("");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings!</CardDescription>
            </CardHeader>
            <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                <CardContent className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" defaultValue={fullName} name={fields.fullName.name} key={fields.fullName.key} />
                        <p className="text-destructive text-xs">{fields.fullName.errors}</p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Email</Label>
                        <Input disabled placeholder="JohnDoe@exemple.com" type="email" defaultValue={email} />
                    </div>
                    <div className="grid gap-y-5">
                        <Label>Profile Image</Label>
                        <Input type="hidden" name={fields.profileImage.name} key={fields.profileImage.key} value={currentProfileImage} />
                        {currentProfileImage ? (
                            <div className="relative size-16">
                                <img src={currentProfileImage} alt="Profile Image" className="size-16 rounded-lg" />
                                <Button variant="destructive" size="icon" className="absolute -top-3 -right-3"
                                    onClick={handleDeleteImage} type="button">
                                    <X className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    setCurrentProfileImage(res[0].url);
                                    toast.success("Profile Image has been uploaded!")
                                }}
                                onUploadError={(error) => {
                                    console.error("something went wrong in uploading Image : ", error);
                                    toast.error(error.message)
                                }}
                            />
                        )}
                        <p className="text-destructive text-xs">{fields.profileImage.errors}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Save Changes" />
                </CardFooter>
            </form>
        </Card>
    )
}