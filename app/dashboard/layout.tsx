import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/public/logo.png"
import { DashboardLinks } from "../components/DashboardLinks";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "../lib/auth";
import { requireUser } from "../lib/hooks";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

async function getData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            userName: true,
            grantId: true,
        }
    });
    if (!data?.userName) {
        return redirect("/onboarding")
    }

    if (!data.grantId) {
        return redirect("/onboarding/grant-id")
    }
    return data;
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await requireUser();
    const data = await getData(session.user?.id as string)

    return (
        <>
            <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
                <div className="hidden md:block border-r bg-muted/40">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src={Logo} alt="Logo" className="size-8" />
                                <p className="text-xl font-bold">Cla<span className="text-primary">Marshal</span></p>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 lg:px-4">
                                <DashboardLinks />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="md:hidden shrink-0" size="icon" variant="outline">
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"left"} className="flex flex-col" aria-describedby="">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Link href="/" className="flex items-center gap-2">
                                            <Image src={Logo} alt="Logo" className="size-10" />
                                            <h4 className="text-3xl font-semibold">Cal<span className="text-blue-500">Marshal</span></h4>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="grid gap-2">
                                    <DashboardLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <div className="ml-auto flex items-center gap-x-4">
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer">
                                    <Avatar className="text-center">
                                        <AvatarImage src={session?.user?.image as string} />
                                        <AvatarFallback className="text-xs">{session?.user?.name}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <form className="w-full" action={async () => {
                                            "use server"
                                            await signOut();
                                        }}>
                                            <button className="flex gap-2 w-full">
                                                <LogOut />
                                                <span>Log out</span>
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster richColors closeButton />
        </>
    )
}