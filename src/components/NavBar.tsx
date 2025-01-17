import Image from "next/image";
import {
  SignInButton,
  useUser,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import useScreenSize from "~/hooks/useScreenSize";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useButton } from "~/context/buttonContext";
import { useClickAway } from "@uidotdev/usehooks";
import { useRouter } from "next/router";

export const HamburgerButton = () => {
  const [hamburgerActive, setHamburgerActive] = useState<boolean>(false);
  const { isSignedIn } = useUser();
  const { setSelectedList, setScroll } = useButton();
  const handleProfileLinkClick = () => setScroll(true);
  const ref = useClickAway<HTMLButtonElement>(() => setHamburgerActive(false));

  return (
    <Menu as={"div"} className={"relative inline-block text-left"}>
      <Menu.Button
        ref={ref}
        onClick={() => setHamburgerActive(!hamburgerActive)}
        className={"hamburgerButton flex items-center"}
      >
        {/* REPLACE FALSE WITH MENU OPEN LOGIC AND TAILWIND SYNTAX*/}
        <div className={`hamburger ${hamburgerActive ? "active" : ""}`}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-2 flex w-48 origin-top-right flex-col divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Menu.Item>
              {({ active }) => (

                <Link
                className={`${active && "text-slate-500"}`}
                href="/profile"
                >
                  Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active && "text-slate-500"}`}
                  href="/profile"
                  onClick={handleProfileLinkClick}
                >
                  Saved Searches
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active && "text-slate-500"}`}
                  href="/profile"
                >
                  <button onClick={() => setSelectedList("liked")}>
                    Liked Jobs
                  </button>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={`${active && "text-slate-500"}`}
                  href="/profile"
                >
                  <button onClick={() => setSelectedList("applied")}>
                    Applied Jobs
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="px-4 py-2 text-xl">
            {isSignedIn ? (
              <div className="flex flex-col gap-2 py-2 text-center">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`rounded-2xl bg-slate-200 px-2 py-1 ${
                        active && "text-slate-500"
                      }`}
                    >
                      <SignOutButton />
                    </div>
                  )}
                </Menu.Item>
              </div>
            ) : (
              <div className="flex flex-col gap-2 py-2 text-center">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`rounded-2xl bg-slate-200 px-2 py-1 ${
                        active && "text-slate-500"
                      }`}
                    >
                      <SignInButton />
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`rounded-2xl bg-slate-200 px-2 py-1 ${
                        active && "text-slate-500"
                      }`}
                    >
                      <SignUpButton />
                    </div>
                  )}
                </Menu.Item>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const NavLinks: React.FC = () => {
  const { setSelectedList, setScroll } = useButton();
  const handleProfileLinkClick = () => {
    setScroll(true);
  };

  return (
    <>
      <Link
        href={`/profile`}
        className="rounded-xl bg-white p-2  hover:bg-neutral-200"
        onClick={handleProfileLinkClick}
      >
        Saved Searches
      </Link>
      <Link
        href={`/profile`}
        className="rounded-xl bg-white p-2 hover:bg-neutral-200"
        onClick={() => {
          setSelectedList("liked");
        }}
      >
        Liked Jobs
      </Link>
      <Link
        href={`/profile`}
        className="rounded-xl bg-white p-2 hover:bg-neutral-200"
        onClick={() => {
          setSelectedList("applied");
        }}
      >
        Applied Jobs
      </Link>
    </>
  );
};

export const NavBar = () => {
  const { isSignedIn } = useUser();
  const [header, setHeader] = useState<boolean>(false);
  const { pathname } = useRouter();

  const scrollHeader = () => {
    if (window.scrollY >= 450) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);

    return () => {
      window.addEventListener("scroll", scrollHeader);
    };
  }, []);

  const screenSize = useScreenSize();

  return (
    <div
      className={
        header
          ? "fixed z-10 w-full bg-gradient-to-r from-[#020307] via-[#06244E] to-[#020307]"
          : pathname !== "/"
            ? "bg-gradient-to-r from-[#020307] via-[#06244E] to-[#020307]"
            : "bg-transparent"
      }
    >
      <nav className="flex items-center justify-between px-8 font-semibold">
        <div className="flex items-center gap-3">
          <Link href={"/"}>
            <Image
              src={"AsyncHiredLogo.svg"}
              width={130}
              height={130}
              alt="Async Hired Logo"
              className="rounded- py-3"
            />
          </Link>
          {screenSize! > 768 && <NavLinks />}
        </div>
        <div>
          {screenSize! < 768 ? (
            <HamburgerButton />
          ) : (
            <div className="h-[40px] min-w-[82.5px] text-center">
              {isSignedIn ? (
                <div className="flex flex-row gap-3">
                  <div className="rounded-xl bg-white p-2 hover:bg-neutral-200">
                    <Link
                      href="/profile"
                      className="rounded-xl bg-white p-2  hover:bg-neutral-200"
                    >
                      Profile
                    </Link>
                  </div>
                  <div className="rounded-xl bg-white p-2 hover:bg-neutral-200">
                    <SignOutButton />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="rounded-xl bg-white p-2 hover:bg-neutral-200">
                    <SignInButton />
                  </div>
                  <div className="rounded-xl bg-white p-2 hover:bg-neutral-200">
                    <SignUpButton />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};
