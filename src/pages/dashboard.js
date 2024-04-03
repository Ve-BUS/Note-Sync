"use client";
import Navbar from "@/src/components/Navbar";
import Sidebar from "@/src/components/Sidebar";
import { UserAuth } from "@/src/utils/auth";
import React, { useEffect, useState } from "react";
import Card from "@/src/components/Card";
import { MdAdd } from "react-icons/md";
import Loading from "@/src/components/Loading";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import axios from "axios";
import publicUrl from "@/src/utils/publicUrl";
import { initialData } from "@/src/constants/data";
import { useRouter } from "next/router";
import useNotesStore from "@/src/store/notesStore";
import { Outfit } from "next/font/google";
import { supabase } from "../utils/supabase";
import { generateUniqueId } from "../utils/utils";

const outfit = Outfit({ subsets: ["latin"] });
const Dashboard = () =>
{
    const router = useRouter();
    const { user, setUser, signOut } = UserAuth();
    const { notes, category, setNotes } = useNotesStore();
    const [notesData, setNotesData] = useState([]);


    useEffect(() =>
    {
        console.log("Dashboard/ USER: ", user);
        const fetchData = async () =>
        {
            console.log(user);
            if (user)
            {
                const res = await axios.get(
                    `${publicUrl()}/get-notes/${user.id}`
                );
                const data = await res.data;
                console.log(data);
                setNotes(data);
                setNotesData(data);
            }
        };

        fetchData();
        session();
    }, []);

    const session = async () =>
    {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

    };

    const handleNewNote = async () =>
    {
        const docId = generateUniqueId();
        try
        {
            const res = await axios.post(`${publicUrl()}/note`, {
                docId: docId.toString(),
                title: "New Note",
                content: initialData,
                uid: user.id,
                category: "frontend",
                tags: ["tag"],
            });
            console.log(res);
            router.push(`/edit/${docId}`);
        } catch (error)
        {
            console.log(error);
            return;
        }
    };

    //handle filter
    useEffect(() =>
    {
        if (!category) return setNotesData(notes);
        const filterNotes = async () =>
        {
            //filter notes array
            const filteredNotes = await notes.filter(
                (note) => note.category === category.title
            );
            setNotesData(filteredNotes);
            console.log("Data From Server");
            console.log(notes);
        };
        filterNotes();
        console.log(notesData);
    }, [category]);

    return (
        <>
            {user ? (
                <main
                    className={`${outfit.className} conatiner flex bg-gray-100 h-screen dark:bg-gray-800 `}
                >
                    <Sidebar />
                    <div className="w-full overflow-y-scroll ">
                        <Navbar />
                        {/* Heading Section */}
                        <Header count={notesData.length} />
                        {/* Notes Section */}
                        <div className="notes px-6 py-4 min-h-[70vh] items-start mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* Add New Note */}
                            <button onClick={handleNewNote}>
                                <div className=" cursor-pointer note-card flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-md flex-col p-4">
                                    <div className="border-2 flex items-center justify-center border-dashed border-blue-400 rounded-full h-28 w-28">
                                        <MdAdd className="text-3xl" />
                                    </div>
                                    <p className="text-blue-400 font-medium mt-4">
                                        Add Note
                                    </p>
                                </div>
                            </button>
                            {notesData.map((note) =>
                            {
                                return (
                                    <Card
                                        key={note._id}
                                        id={note.docId}
                                        category={note.category}
                                        title={note.title}
                                        content={note.content[1].content.text}
                                        timestamp={note.timestamp}
                                        displayName={user.displayName}
                                        preview={note.preview}
                                    />
                                );
                            })}
                        </div>
                        <Footer />
                    </div>
                </main>
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Dashboard;
