import connectDB from "@/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
}

export async function POST(request: Request) {
    auth().protect(); // Protect the route with Clerk
    try {
        await connectDB();
        const { user, text, imageUrl }: AddPostRequestBody = await request.json();
        
        const postData: IPostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl }) // Only include imageUrl if it exists
        }
        const post = Post.create(postData);
    } catch (error) {
        return NextResponse.json(
            { error: `An error occurred while creating the post ${error}. Please try again later.`},
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const posts = await Post.find().sort({ createdAt: -1 });
        return NextResponse.json({ posts });

    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while fetching posts. Please try again later." },
            { status: 500 }
        );
    }
} 