import FriendRequestsSidebarOption from '@/components/UI/FriendRequestsSidebarOption';
import { Icon, Icons } from '@/components/UI/Icons';
import SignOutButton from '@/components/UI/SignOutButton';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  const unseenRequestsCount = (
    (await fetchRedis(
      'smembers',
      `user:${session?.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  if (!session) {
    notFound();
  }

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        <div
          className="text-xl font-semibold leadin-6 text-gray-6
      "
        >
          Your chats
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>chats that this user has</li>
            <li>
              <div className="text-xl font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold sidebar-link"
                      >
                        <span className="text-gray-400 border-b-gray-200 sidebar-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li>
              <FriendRequestsSidebarOption
                sessionId={session.user.id}
                initialUnseenRequestsCount={unseenRequestsCount}
              />
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 pl-4 pr-3 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ''}
                    alt="Your profile picture"
                  />
                </div>
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;