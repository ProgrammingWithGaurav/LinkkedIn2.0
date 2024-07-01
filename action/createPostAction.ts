'use server';

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { storage } from "@/firebase.js";
import {ref, uploadBytes } from "firebase/storage";

// create a upload image function 
async function uploadImage(image: File) {
    const storageRef = ref(storage, `images/${image.name}${Date.now()}`);
    await uploadBytes(storageRef, image).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
    }
    );
}

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
        lastName: user.lastName || "Doe",
    }

    try {

        if (image.size > 0) {
            // call the upload image function
            const storageRef = await uploadImage(image);
            // create the post
            const body: AddPostRequestBody = {
                user: userDB,
                text: text,
                imageUrl: imageUrl
            };
            await Post.create(body);
        } else {
            // create the post without image
            const body : AddPostRequestBody = {
                user: userDB,
                text: text
            }
            console.log(body)
            await Post.create(body);
        }
    } catch (error) {
        console.log("Failed to create post", error);
        throw new Error("Failed to create post");
    }
}