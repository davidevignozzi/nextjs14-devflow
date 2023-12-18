'use client';

import Image from 'next/image';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants/constants';
import { usePathname } from 'next/dist/client/components/navigation';

const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="my-10 flex h-full flex-col gap-6">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      {/* Hamburger Menu */}
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="menu"
          width={36}
          height={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
            Dev<span className="text-primary-500">Overflow</span>
          </p>
        </Link>

        <div>
          <SheetClose asChild>
            {/* Nav Content */}
            <NavContent />
          </SheetClose>

          {/* Not logged User */}
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                {/* Log in */}
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              {/* Sign up */}
              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
