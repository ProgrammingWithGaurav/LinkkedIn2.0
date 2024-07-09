"use client";

import React, { useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function CommentForm({ postId }: { postId: String }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={(formData) => {}}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} className="w-10 h-10" />
        <AvatarFallback>
          {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </form>
  );
}
