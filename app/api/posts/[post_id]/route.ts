import connectDB from "@/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface UnLikePostRequestBody {
    userId: string;
}

export async function POST(
    request: Request,
    { params }: { params: { post_id: string } }
)
{
    auth().protect(); // Protect the route with Clerk
    await connectDB();
    const { userId }: UnLikePostRequestBody = await request.json();

    try {
        const post = await Post.findById(params.post_id);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        await post.unlikePost(userId);
        return NextResponse.json({ message: "Post Unliked successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while unliking the post. Please try again later." },
            { status: 500 }
        );
    }
}