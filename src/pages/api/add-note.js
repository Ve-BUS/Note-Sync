// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { generateUniqueId } from "@/src/utils/utils";
import axios from "axios";
import publicUrl from "../../utils/publicUrl";

export default async function handler(req, res)
{
  if (req.method === "POST")
  {
    const { content, user_id } = req.body;
    const docId = generateUniqueId();
    try
    {
      const response = await axios.post(`${publicUrl()}/note`, {
        docId: docId.toString(),
        title: "New Note",
        content: content,
        uid: user_id,
        category: "frontend",
        tags: ["tag"],
      });
      if (response.status === 201)
        res.status(201).json({
          message: "created a new note",
          url: `https://impetus-notes-sync.vercel.app/pagetalk/${docId}`
        });
    } catch (error)
    {
      console.log(error);
      res.status(401).json({
        error: error,
      });
    }
  }

}
