"use client";
import axios from "axios";
import React from "react";
import Navbar from "@/src/components/Navbar";
import Sidebar from "@/src/components/Sidebar";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { initialData } from "@/src/constants/data";
import publicUrl from "@/src/utils/publicUrl";
import { useRouter } from "next/router";
import { UserAuth } from "@/src/utils/auth";
const Editor = dynamic(() => import("@/src/components/Editor"), { ssr: false });

function Edit()
{
    const [noteData, setNoteData] = React.useState(null);
    const router = useRouter();
    const { id } = router.query;
    const { user } = UserAuth();

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            const res = await axios.get(`${publicUrl()}/note/${id}`);
            // console.log("Res", res);

            const data = await res.data[0];
            console.log(data);
            data && setNoteData(data);
            console.log(data);
        };
        fetchData();
    }, []);
    return <>{noteData && <Editor data={noteData} id={id} user_id={user.id} />}</>;
}

export async function getServerSideProps(context)
{
    return {
        props: {}, // will be passed to the page component as props
    };
}

export default Edit;
