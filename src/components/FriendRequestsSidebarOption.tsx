'use client';

import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

interface FriendRequestsSidebarOptionProps {
  sessionId: string;
  initialUnseenRequestsCount: number;
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({
  sessionId,
  initialUnseenRequestsCount,
}) => {
  const [unseenRequestsCount, setUnseenRequestsCount] = useState(
    initialUnseenRequestsCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestsHandler = () => {
      setUnseenRequestsCount((prev) => ++prev);
    };

    pusherClient.bind('incoming_friend_requests', friendRequestsHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind('incoming_friend_requests', friendRequestsHandler);
    };
  }, []);

  return (
    <Link
      href="/dashboard/requests"
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold friendsRequests-link"
    >
      <div className="text-gray-400 border-gray-200 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white friendsRequests-icon">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate">Friend request</p>

      {unseenRequestsCount > 0 && (
        <div className="rounded-full w-5 h-5 text-sm flex justify-center items-center text-white bg-indigo-600">
          {unseenRequestsCount}
        </div>
      )}
    </Link>
  );
};

export default FriendRequestsSidebarOption;
