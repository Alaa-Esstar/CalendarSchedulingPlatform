'use client'

import { CreateEventTypeAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";

type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

export default function NewEventRoute() {
    const [activePlatfrom, setActivePlatfrom] = useState<VideoCallProvider>("Google Meet");

    const [lastResult, action] = useFormState(CreateEventTypeAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: eventTypeSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    })
    return (
        <div className="w-full h-full flex flex-1 items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Add new appointment type</CardTitle>
                    <CardDescription>Create new appointment type that allows people to book you!</CardDescription>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
                    <CardContent className="grid gap-y-5">
                        <div className="flex flex-col gap-y-2">
                            <Label>Title</Label>
                            <Input placeholder="30 Minute Meeting" name={fields.title.name} key={fields.title.key} defaultValue={fields.title.initialValue} />
                            <p className="text-destructive text-sm">{fields.title.errors}</p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>URL Slug</Label>
                            <div className="flex rounded-md">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">CalMarshal.com/</span>
                                <Input className="rounded-l-none" placeholder="Exemple-url-1" name={fields.url.name} key={fields.url.key} defaultValue={fields.url.initialValue} />
                                <p className="text-destructive text-sm">{fields.url.errors}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Meet me in this meeting" name={fields.description.name} key={fields.description.key} defaultValue={fields.description.initialValue} />
                            <p className="text-destructive text-sm">{fields.description.errors}</p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Duration</Label>
                            <Select name={fields.duration.name} key={fields.duration.key} defaultValue={fields.duration.initialValue}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Duration</SelectLabel>
                                        <SelectItem value="15">15 Mins</SelectItem>
                                        <SelectItem value="30">30 Mins</SelectItem>
                                        <SelectItem value="45">45 Mins</SelectItem>
                                        <SelectItem value="60">1 Hour</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-destructive text-sm">{fields.duration.errors}</p>
                        </div>
                        <div className="grid gap-y-2">
                            <Label>Video Call Provider</Label>
                            <input type="hidden" name={fields.videoCallSoftware.name} key={fields.videoCallSoftware.key} value={activePlatfrom} />
                            <ButtonGroup>
                                <Button type="button" onClick={() => setActivePlatfrom("Zoom Meeting")} variant={
                                    activePlatfrom === 'Zoom Meeting' ? "secondary" : "outline"
                                } className="w-full">Zoom</Button>
                                <Button type="button" onClick={() => setActivePlatfrom("Google Meet")} variant={
                                    activePlatfrom === 'Google Meet' ? "secondary" : "outline"
                                } className="w-full">Google Meet</Button>
                                <Button type="button" onClick={() => setActivePlatfrom("Microsoft Teams")} variant={
                                    activePlatfrom === 'Microsoft Teams' ? "secondary" : "outline"
                                } className="w-full">Microsoft Teams</Button>
                            </ButtonGroup>
                            <p className="text-destructive text-sm">{fields.videoCallSoftware.errors}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="w-full flex justify-between">
                        <Button variant={"destructive"} asChild><Link href="dashboard">Cancel</Link></Button>
                        <SubmitButton text="Create Event Type" />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}