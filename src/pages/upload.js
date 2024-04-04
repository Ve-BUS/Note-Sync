"use client";

import FileUpload from "../components/FileUpload";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
// import { Separator } from "@/components/ui/separator";

export default function Home() {
    return (
        <main className={`conatiner flex bg-white h-screen dark:bg-gray-800 `}>
            <Sidebar />
            <div className="flex-1 overflow-y-scroll border-l-2 border-gray-200 dark:border-gray-600">
                <Navbar />
                <div className="sm:pt-10 md:p-5 lg:p-5 w-full">
                    <div className="flex justify-center">
                        <div className="w-full p-5 space-y-5 max-w-6xl items-center">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Upload Files
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Upload files to start a conversation
                                        with them.
                                    </p>
                                </div>
                            </div>
                            {/* <Separator className="my-4" /> */}
                            <FileUpload />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
