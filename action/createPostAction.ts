'use server';

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
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


    // define the user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    }

    try {

        if (image.size > 0) {
            // upload image to cloudinary
            // create the post
            const body: AddPostRequestBody = {
                user: userDB,
                text: text,
                imageUrl: imageUrl
            };
            await Post.create(body);
        } else {
            // create the post
            const body : AddPostRequestBody = {
                user: userDB,
                text: text
            }
        }
    } catch (error) {
        console.log("Failed to create post", error);
        throw new Error("Failed to create post");
    }
}