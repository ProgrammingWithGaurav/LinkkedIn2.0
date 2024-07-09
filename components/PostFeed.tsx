import { IPostDocument } from "@/mongodb/models/post";
import React, { Key } from "react";
import Post from "./Post";

export default function PostFeed({ posts }: { posts: IPostDocument[] }) {
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id as Key} post={post} />
      ))}
    </div>
  );
}
