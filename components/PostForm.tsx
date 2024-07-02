"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import createPostAction from "@/action/createPostAction";

export default function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();
    // clear the image
    setPreview(null);

    const text = formDataCopy.get("postInput") as string;

    if (!text.trim()) {
      throw new Error("Post Input cannot be empty");
    }

    setPreview(null);

    try {
      console.log(formDataCopy);
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("Error Creating Post: ", error);
    }
  };
  return (
    <div className="mb-2">
      <form
        action={(formData) => {
          handlePostAction(formData);
        }}
        ref={ref}
        className="bg-white rounded-lg p-3 border"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} className="h-12 rounded-full" />
            <AvatarFallback>
              {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />

          <input
            type="file"
            ref={fileInputRef}
            name="image"
            accept="image/*"
            hidden
            onChange={(e) => handleImageChange(e)}
          />
          <button type="submit">Post</button>
        </div>

        {preview && (
          <div className="mt-3">
            <img src={preview} alt="preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex mt-2 justify-end space-x-2">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add"} Image
          </Button>

          {preview && (
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setPreview(null)}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove Image
            </Button>
          )}
        </div>
      </form>

      <hr className="mt-2 border-gray-300" />
    </div>
  );
}
