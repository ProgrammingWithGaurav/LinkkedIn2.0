import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnLikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";

export default function PostOptions({ post }: { post: IPostDocument }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);

  const likeOrUnlikePost = async () => {
    if (!user?.id) {
      throw new Error("User not signed in");
    }
    const originalLiked = liked;
    const originalLikes = likes;

    const newlikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: LikePostRequestBody | UnLikePostRequestBody = {
      userId: user.id,
    };
1
    setLiked(!liked);
    setLikes(newlikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    console.log(response);

    if (!response.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to like/unlike post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
    if (!fetchLikesResponse.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to fetch likes");
    }

    const likesData = await fetchLikesResponse.json();
    setLikes(likesData.likes);
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {likes.length}
            </p>
          )}
        </div>

        <div>
          {post?.comments && post.comments.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>

      <div className="flex p-2 justify-between px-2 border-1">
        <Button variant="ghost" className="post-btn">
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
            onClick={() => likeOrUnlikePost()}
          />{" "}
          Like
        </Button>
        <Button
          variant="ghost"
          className="post-btn"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentsOpen && "text-gray-600 fill-gray-600"
            )}
          />
          Comment
        </Button>

        <Button variant="ghost" className="post-btn">
          <Repeat2 className="mr-1" /> Repost
        </Button>

        <Button variant="ghost" className="post-btn">
          <Send className="mr-1" /> Share
        </Button>
      </div>

      {isCommentsOpen && (
        <div className="p-4">
          {/* {user?.id && <CommentForm postId={post._id} />}
          <CommentFeed post={post} /> */}
        </div>
      )}
    </div>
  );
}
