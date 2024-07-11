import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { AvatarFallback } from "./ui/avatar";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { IPostDocument } from "@/mongodb/models/post";

export default async function UserInfo({ posts }: { posts: IPostDocument[] }) {
  const user = await currentUser();
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  const userPosts = posts.filter((post) => post.user.userId === user?.id);

  const userComoments = posts.flatMap(
    (post) =>
      post?.comments?.filter((comment) => comment.user.userId === user?.id) ||
      []
  );

  return (
    <div className="flex flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
      <Avatar>
        {user?.id ? (
          <AvatarImage src={imageUrl} className="w-40 rounded-full" />
        ) : (
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="rounded-full p-2 w-40"
          />
        )}

        <AvatarFallback>
          {firstName?.charAt(0)} {lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {firstName} {lastName}
          </p>

          <p className="text-xs">
            @{firstName}
            {lastName}-{user?.id?.slice(-4)}
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-2">
          <p className="font-semibold">You are not signed in</p>

          <Button asChild className="bg-[#2863C4] text-white">
            <SignInButton>Sign in</SignInButton>
          </Button>
        </div>
      </SignedOut>

      <hr className="w-full border-gray-200 my-t5" />

      <SignedIn>
        <div className="flex justify-between w-full px-4 text-sm">
          <p className="font-semibold text-gray-400">Posts</p>
          <p className="text-blue-400">{userPosts.length}</p>
        </div>

        <div className="flex justify-between w-full px-4 text-sm">
          <p className="font-semibold text-gray-400">Comments</p>
          <p className="text-blue-400">{userComoments.length}</p>
        </div>
      </SignedIn>
    </div>
  );
}
