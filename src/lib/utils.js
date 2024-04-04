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

