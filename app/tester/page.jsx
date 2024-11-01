'use client';
import { handleMagicLink } from "../appwrite/api";

export default function SignIn() {
    
    function handleSubmit(event) {
        event.preventDefault(); // Prevent form submission from refreshing the page
        const formData = new FormData(event.target);
        const email = formData.get("email");

        handleMagicLink({ email }).catch((error) => {
            console.error("Error handling magic link:", error);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Email" />
            <button type="submit">Signin with Resend</button>
        </form>
    );
}
