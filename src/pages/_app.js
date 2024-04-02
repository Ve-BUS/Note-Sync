import "@/src/styles/globals.css";
import { AuthProvider } from "@/src/utils/auth";
import { ThemeProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class">
            <NextUIProvider>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </NextUIProvider>
        </ThemeProvider>
    );
}
