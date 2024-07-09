"use client";
import React, { Key } from "react";
import { useUser } from "@clerk/nextjs";
import { IPostDocument } from "@/mongodb/models/post";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useTimeAgo } from "next-timeago";

export default function CommentFeed({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const isAuthor = user?.id == post.user.userId;
  const { TimeAgo } = useTimeAgo();

  return (
    <div className="space-y-2 mt-3">
      {post.comments?.map((comment) => (
        <div key={comment._id as Key} className="flex space-x-1">
          <Avatar>
            <AvatarImage src={comment.user.userImage} className="w-10 h-10" />
            <AvatarFallback>
              {comment.user.firstName?.charAt(0)}{" "}
              {comment.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  {comment.user.firstName} {comment.user.lastName}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                <TimeAgo date={comment.createdAt} />
              </p>
            </div>

            <p className="mt-3 text-sm">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
