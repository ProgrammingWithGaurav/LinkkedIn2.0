"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Badge } from "./ui/badge";
import { useTimeAgo } from "next-timeago";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/action/deletePostAction";
import Image from "next/image";

export default function Post({ post }: { post: IPostDocument }) {
  const { TimeAgo } = useTimeAgo();
  const { user } = useUser();
  const isAuthor = user?.id === post.user.userId;
  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        <div>
          <Avatar>
            <AvatarImage src={post.user.userImage} className="w-10 h-10" />
            <AvatarFallback>
              {post.user.firstName?.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 justify-between">
          <div>
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}
              {isAuthor && (
                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user.firstName}-{post.user.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <TimeAgo date={post.createdAt} />
            </p>
          </div>

          {isAuthor && (
            <Button
              variant="outline"
              onClick={() => {
                const promise = deletePostAction(post?._id);
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>

      <div>
        <p>{post.text}</p>
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={500}
            height={500}
            className="full mx-auto"
          />
        )}
      </div>
    </div>
  );
}
