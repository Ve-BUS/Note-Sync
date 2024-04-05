import
{
    useEffect,
    useState,
    createContext,
    Children,
    useContext,
} from "react";
import { auth } from "./firebase";
import
{
    GithubAuthProvider,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { supabase } from "./supabase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>
{
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const UserAuth = () =>
{
    return useContext(AuthContext);
};

const useAuth = () =>
{
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() =>
    {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser)
        {
            setUser(localUser);
        }
        if (user)
        {
            router.push("/dashboard");
        }
        console.log(user);
    }, []);

    const googleSignIn = async () =>
    {
        // const googleProvider = new GoogleAuthProvider();
        // return signInWithPopup(auth, googleProvider)
        //     .then((res) => {
        //         console.log("User Signed In!!!");
        //         console.log(res.user);

        //         localStorage.setItem("user", JSON.stringify(res.user));
        //         toast.success("Login Successful");
        //         router.push("/dashboard");
        //     })
        //     .catch((error) => {
        //         console.log(error.message);
        //     });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/dashboard`,
            },
        });

        // localStorage.setItem("user", JSON.stringify(data.user));
        // localStorage.setItem("session", JSON.stringify(data.session));
        // router.push("/dashboard");
    };

    const signInGithub = async () =>
    {
        // const githubProvider = new GithubAuthProvider();
        // return signInWithPopup(auth, githubProvider)
        //     .then((res) => {
        //         console.log("User Signed In!!!");
        //         console.log(res.user);
        //         localStorage.setItem("user", JSON.stringify(res.user));
        //         toast.success("Login Succes");
        //         router.push("/dashboard");
        //     })
        //     .catch((error) => {
        //         console.log(error.message);
        //     });
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${origin}/dashboard`,
            },
        });

        // if (error) {
        //     console.log(error);
        // } else {
        //     // localStorage.setItem("user", JSON.stringify(data.user));
        //     // localStorage.setItem("session", JSON.stringify(data.session));
        //     // setUser(data.user);
        //     // router.push("/dashboard");
        //     const user = await supabase.auth.getUser();
        //     if (user) setUser(user);
        //     localStorage.setItem("user", JSON.stringify(user));
        //     router.push("/dashboard");
        // }
    };

    const emailSignIn = async (email, password) =>
    {
        // try {
        // // Try to sign in the user
        // const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // const user = userCredential.user;
        // console.log("User Signed In!!!");
        // console.log(user);
        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log(res.data);
        // localStorage.setItem("session", JSON.stringify(session));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        router.push("/dashboard");




        // console.log("Data: ", data, "\nError: ", error);

        // if (error) {
        //     const { data, error } = await supabase.auth.signUp({
        //         email,
        //         password,
        //     });

        //     if (error) {
        //         console.error(error);
        //     } else {
        //         localStorage.setItem("user", JSON.stringify(data.user));
        //         localStorage.setItem("session", JSON.stringify(data.session));
        //         setUser(data.user);
        //         router.push("/dashboard");
        //     }
        // } else {
        //     localStorage.setItem("user", JSON.stringify(data.user));
        //     localStorage.setItem("session", JSON.stringify(data.session));
        //     setUser(data.user);
        //     router.push("/dashboard");
        // }
        // } catch (signInError) {
        //     // If user is not found, sign up the user
        //     if (signInError.code === "auth/user-not-found") {
        //         try {
        //             const newUserCredential =
        //                 await createUserWithEmailAndPassword(
        //                     auth,
        //                     email,
        //                     password
        //                 );
        //             const newUser = newUserCredential.user;
        //             console.log("User Signed Up!!!");
        //             toast.success("Login Succes");
        //             console.log(newUser);
        //             router.push("/dashboard");
        //         } catch (signUpError) {
        //             console.error(signUpError.message);
        //         }
        //     } else {
        //         console.error(signInError.message);
        //     }
        // }
    };

    const signOut = () =>
    {
        return auth.signOut().then(() =>
        {
            console.log("User Signed Out!!!");
            toast.success("Logout Successful");
            supabase.auth.signOut();
            localStorage.clear();
            setUser(null);
            router.push("/");
        });
    };

    return { user, setUser, googleSignIn, signInGithub, emailSignIn, signOut };
};
