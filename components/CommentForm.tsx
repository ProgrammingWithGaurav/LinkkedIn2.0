"use client";

import React, { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import createCommentAction from "@/action/createCommentAction";

export default function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId); // Partial application

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }
    const formDataCopy = formData;
    ref.current?.reset();

    try {
      await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
      }}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} className="w-10 h-10" />
        <AvatarFallback>
          {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          placeholder="Write a comment..."
          className="outline-none flex-1 text-sm bg-transparent"
        />
        <button type="submit" hidden>
          Post
        </button>
      </div>
    </form>
  );
}
