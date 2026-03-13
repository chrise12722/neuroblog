'use client'
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { handleLike, handleUnlike } from '@/app/actions';

interface LikeButtonProps {
  blogId: number;
  userId: string;
  liked: boolean;
  likes: number;
}

export const LikeButton = ({ blogId, userId, liked, likes }: LikeButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticLikes, setOptimisticLikes] = useState(likes);

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;

    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);
    const newLiked = !optimisticLiked;
    setOptimisticLiked(newLiked);
    setOptimisticLikes(prev => newLiked ? prev + 1 : prev - 1);
    try {
      const result = await (newLiked ? handleLike(blogId) : handleUnlike(blogId));
      if (result && result.error) {
        setOptimisticLiked(!newLiked);
        setOptimisticLikes(prev => newLiked ? prev - 1 : prev + 1);
        toast(result.error);
      } else {
        toast(newLiked ? 'Blog has been liked' : 'Blog has been unliked');
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading}
      className={`flex items-center gap-2 ${optimisticLiked ? 'text-red-500' : 'text-gray-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span>{optimisticLikes}</span>
      <span>{optimisticLiked ? '❤️' : '🤍'}</span>
    </button>
  );
}