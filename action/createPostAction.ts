'use server';

import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
    const user = await currentUser();


    if (!user) {
        throw new Error("User not found");
    }

    const text = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if(!text.trim()) {
        throw new Error("Post Input cannot be empty");
    }
}