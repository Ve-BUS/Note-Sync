import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from 'axios';

export function cn(...inputs)
{
    return twMerge(clsx(inputs));
}

export function extractFileName(fullName)
{
    const parts = fullName.split(".");
    parts.pop();
    return parts.join(".");
}

export function extractFileNameFromPath(path)
{
    const parts = path.split("/");
    return parts[parts.length - 1];
}


export function generateUniqueId()
{
    const docId = Math.floor(Math.random() * 10000000);
    return docId;
}

export async function createNewNote(docId)
{
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
}