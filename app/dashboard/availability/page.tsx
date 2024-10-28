import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectGroup } from "@radix-ui/react-select";
import { times } from "@/lib/time";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Input } from "@/components/ui/input";
import { updateAvailabilityAction } from "@/app/actions";



async function getData(userId: string) {
    const data = await prisma.availability.findMany({
        where: {
            userId: userId,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export default async function Availabilityroute() {
    const session = await requireUser()
    const data = await getData(session.user?.id as string);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>In this section you can manage your availability</CardDescription>
            </CardHeader>
            <form action={updateAvailabilityAction}>
                <CardContent className="flex flex-col gap-y-4">
                    {data.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
                            <Input type="hidden" name={`id-${item.id}`} value={item.id} />
                            <div className="flex items-center gap-x-3">
                                <Switch name={`isActive-${item.id}`} defaultChecked={item.isActive} />
                                <p>{item.day}</p>
                            </div>
                            <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="From Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map((time) => (
                                            <SelectItem value={time.time} key={time.id}>
                                                {time.time}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Till Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map((time) => (
                                            <SelectItem value={time.time} key={time.id}>
                                                {time.time}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <SubmitButton text="Save Changes" />
                </CardFooter>
            </form>
        </Card>
    )
}