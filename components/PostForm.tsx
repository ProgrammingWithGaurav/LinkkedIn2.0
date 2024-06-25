import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

export default async function PostForm() {
  const { user } = useUser();

  return (
    <div>
      <form action="">
        <div>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </form>
    </div>
  );
}
