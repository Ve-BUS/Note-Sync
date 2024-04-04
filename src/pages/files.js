'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// import { Spinner } from "@nextui-org/react";
import Loading from "../components/Loading";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import PDFCard from "../components/PDFCard";
import { Separator } from "../components/ui/separator";
import
    {
        AvatarImage,
        AvatarFallback,
        Avatar,
    } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { SmileIcon } from "../components/ui/icons";
import
    {
        ResizableHandle,
        ResizablePanel,
        ResizablePanelGroup,
    } from "../components/ui/resizable";

import { extractFileNameFromPath } from "../lib/utils";

function Documents()
{
    // const { dispatch } = useAppContext();
    const router = useRouter();
    // const { docs } = useDocStore();
    const [docs, setDocs] = useState();
    const supabase = createClientComponentClient();
    const [currentlySelectedDoc, setCurrentlySelectedDoc] = useState(null);
    const [apiInProgress, setApiInProgress] = useState(false);

    const handleChatPressed = (pdf_id, pdf_url, pdf_name) =>
    {
        setCurrentlySelectedDoc({
            id: pdf_id,
            url: pdf_url,
            name: pdf_name,
        });
        // dispatch({
        //     type: "UPDATE_CURRENT_PDF",
        //     payload: {
        //         id: pdf_id,
        //         url: pdf_url,
        //         name: pdf_name,
        //     },
        // });
    };

    useEffect(() =>
    {
        setApiInProgress(true);
        const fetchDocs = async () =>
        {
            const { data, error } = await supabase.from("pdf").select("*");
            if (error)
            {
                console.log(error);
                return;
            }
            setDocs(data);
            setApiInProgress(false);
        };
        fetchDocs();
    }, []);

    return (
        <div className="sm:pt-10 md:p-5 lg:p-5">
            <div className="flex flex-row justify-center">
                <ResizablePanelGroup
                    direction="horizontal"
                    className=" min-h-full rounded-lg border"
                >
                    <ResizablePanel defaultSize={50} maxSize={55} minSize={45}>
                        <div className="w-full p-5 space-y-5 max-w-6xl items-center">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Your Documents
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        List of all your uploaded documents.
                                        <br />
                                        Click on that{" "}
                                        <strong>&quot;Chat&quot;</strong> button
                                        to start a conversation or{" "}
                                        <strong>&quot;Download&quot;</strong>{" "}
                                        button to download the file.
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div
                                className={`grid grid-cols-1 sm:grid-cols-2 ${currentlySelectedDoc
                                        ? "lg:grid-cols-2"
                                        : "lg:grid-cols-4"
                                    } items-center`}
                            >
                                {apiInProgress ? (
                                    <div className="items-center justify-center p-5">
                                        <Loading />
                                    </div>
                                ) : docs?.data.length === 0 ? (
                                    <p className="text-center text-default-500">
                                        No PDFs uploaded yet
                                    </p>
                                ) : (
                                    docs?.map((pdf) =>
                                    {
                                        return (
                                            <PDFCard
                                                key={pdf.id}
                                                title={extractFileNameFromPath(
                                                    pdf.title
                                                )}
                                                size="1 MB"
                                                link={pdf.downloadURL}
                                                onChatPressed={() =>
                                                    handleChatPressed(
                                                        pdf.id,
                                                        pdf.downloadURL,
                                                        pdf.title
                                                    )
                                                }
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </ResizablePanel>
                    {currentlySelectedDoc && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50}>
                                <section className="flex flex-col w-full h-full">
                                    <header className="border-b dark:border-zinc-700 p-4">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Avatar className="relative overflow-visible w-10 h-10">
                                                <span className="absolute right-0 top-0 flex h-3 w-3 rounded-full bg-green-600" />
                                                <AvatarImage
                                                    alt="User Avatar"
                                                    src="/placeholder-avatar.jpg"
                                                />
                                                <AvatarFallback>
                                                    U
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                Contact Name
                                                <span className="text-xs text-green-600 block">
                                                    Online
                                                </span>
                                            </div>
                                        </h2>
                                    </header>
                                    <main className="flex-1 overflow-auto p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-end gap-2">
                                                <div className="rounded-lg bg-zinc-200 dark:bg-zinc-700 p-2">
                                                    <p className="text-sm">
                                                        Hello, how are you?
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-end gap-2 justify-end">
                                                <div className="rounded-lg bg-blue-500 text-white p-2">
                                                    <p className="text-sm">
                                                        I&apos;m fine, thanks
                                                        for asking!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </main>
                                    <footer className="border-t dark:border-zinc-700 p-4">
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost">
                                                <SmileIcon className="w-6 h-6" />
                                            </Button>
                                            <Input
                                                className="flex-1"
                                                placeholder="Type a message..."
                                            />
                                            <Button>Send</Button>
                                        </div>
                                    </footer>
                                </section>
                            </ResizablePanel>{" "}
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default Documents;
