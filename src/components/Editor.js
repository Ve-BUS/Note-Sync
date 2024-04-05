"use client"; // this registers <Editor> as a Client Component
import { getRandomUser } from "@/src/utils/randomuser";
import Link from "next/link";
import { MdEdit, MdSave } from "react-icons/md";
import publicUrl from "@/src/utils/publicUrl";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

import EditorSidebar from "./EditorSidebar";
import EditorInfo from "./EditorInfo";
import EditorNav from "./EditorNav";
import { HiDotsVertical } from "react-icons/hi";
import YPartyKitProvider from "y-partykit/provider";
import
{
    BlockNoteView,
    SideMenu,
    useBlockNote,
    Theme,
    darkDefaultTheme,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { markdownToPlainText } from "../utils/markdown_to_text";

// Our <Editor> component we can reuse later
export default function Editor({ data, id, user_id, pagetalk = false, voicesync = false })
{
    //theme


    let initData;

    const doc = new Y.Doc();
    const provider = new YPartyKitProvider(
        "https://frontend-party.techymt.partykit.dev",
        `room-${id}`,
        doc
    );
    const { theme } = useTheme();
    // const [editor, setEditor] = useState(null);
    const content = data.content;
    console.log(content);

    if (!pagetalk && !voicesync)
    {
        initData = content.map((block) =>
        {
            console.log(block.content);
            return {
                id: `${block.id}`,
                type: `${block.type}`,
                props: block.props,
                content:
                    `${block.content[0]?.text !== undefined ? block.content[0]?.text : ""}` ||
                    [],
                children: [],
            };
        });
    }


    const editor = useBlockNote({
        initialContent: initData,
        collaboration: {
            provider,
            // Where to store BlockNote data in the Y.Doc:
            fragment: doc.getXmlFragment("document-store"),
            // Information (name and color) for this user:
            user: getRandomUser(),
        },
        onEditorContentChange: (editor) =>
        {
            //To handkle changes
            // console.log(provider);
            // console.log(editor.topLevelBlocks);
            return;
        },
    });

    const convertToBlock = async (data) =>
    {
        const blocks = await editor.tryParseMarkdownToBlocks(data);
        blocks.push({
            id: "heading-1",
            type: "heading",
            props: {
                "textColor": "default",
                "backgroundColor": "default",
                "textAlignment": "left",
                "level": 1
            },
            content: "New Note",
        });
        console.log("blocks", blocks);
        editor.replaceBlocks(editor.topLevelBlocks, blocks);
    };

    if (pagetalk)
    {
        convertToBlock(content[0]);
    }

    if (voicesync)
    {
        convertToBlock(content[0]);
    }

    const darkRedTheme = {
        ...darkDefaultTheme,
        colors: {
            ...darkDefaultTheme.colors,
            editor: {
                ...darkDefaultTheme.colors,
                background: "#1f2937",
            },
            sideMenu: "#ffffff",
            highlights: darkDefaultTheme.colors.highlights,
        },
    };

    const handleSave = async () =>
    {
        // const note = localStorage.getItem("editorContent");
        console.log(editor.topLevelBlocks);
        console.log(
            "wow",
            editor.topLevelBlocks.find((block) => block.type === "text")
        );
        //get the content
        // const content = editor.topLevelBlocks.find((block) => block.type === "paragraph").content[0].text;
        const md = await editor.blocksToMarkdownLossy(editor.topLevelBlocks);
        const preview = markdownToPlainText(md);
        const res = await axios.put(`${publicUrl()}/note/${id}`, {
            uid: user_id,
            title:
                editor.topLevelBlocks.find((block) => block.type === "heading")
                    .content[0].text || "Untitled",
            content: editor.topLevelBlocks,
            preview: preview,
        });
        // console.log(note);
        console.log("saved");
        console.log(editor.topLevelBlocks);
        toast.success("Saved Successfully");
    };

    // Renders the editor instance using a React component.
    return (
        content && (
            <main
                className={`conatiner flex bg-white h-screen dark:bg-gray-800 `}
            >
                <Toaster position="top-center" reverseOrder={false} />
                <Sidebar />
                <div className="flex-1 overflow-y-scroll border-l-2 border-gray-200 dark:border-gray-600">
                    {/* <Navbar /> */}
                    <div className="border-b-2  dark:border-gray-600 px-6 py-3 flex justify-between items-center">
                        <h3 className="font-semibold max-w-72">{data.title}</h3>

                        <div className="options flex items-center ">
                            <button
                                onClick={handleSave}
                                className="hover:bg-gray-300/20 hover:text-blue-400 font-semibold cursor-pointer   px-2 py-.5 rounded-md"
                            >
                                save
                            </button>
                            <button className="px-2 py-1 hover:bg-gray-300/20 rounded-md">
                                <HiDotsVertical />
                            </button>
                        </div>
                    </div>
                    {/* Heading Section */}
                    <div className="notes px-6 py-4 min-h-[70vh] items-start mt-8]">
                        <div className="flex">
                            <div className="w-10/12 mx-auto py-20 px-4 sm:px-6 lg:px-8 min-h-screen  dark:bg-gray-800 ">
                                <BlockNoteView
                                    editor={editor}
                                    theme={
                                        theme == "dark" ? darkRedTheme : "light"
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        )
    );
}
