import { ModeToggle } from "@/components/mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { navRoutes } from "@/lib/navRoute";
import { OpenfortKitButton } from "@openfort/react";
import { Link, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronDown, SettingsIcon } from "lucide-react";
import { FileRoutesByTo } from "../routeTree.gen";

export type NavRoute = {
  href?: keyof FileRoutesByTo;
  label: string;
  exact?: boolean;
  children?: NavRoute[];
}

export const Nav = ({ showLogo, children, overridePath }: { showLogo?: boolean; children?: React.ReactNode; overridePath?: string }) => {
  const location = useLocation();
  const path = location.pathname.includes("showcase") ? "/" : overridePath || location.pathname;

  const isActive = (item: NavRoute) => {
    if (item.exact) {
      return path === item.href
    }
    return (!!item.href && path.includes(item.href)) || (item.children && item.children.some(child => isActive(child)));
  };

  return (
    <>
      <nav className='h-(--nav-height) pr-4 bg-background-100 border-b w-[100vw] flex fixed z-10'>
        <div className="flex items-center w-full gap-4 overflow-x-auto overflow-y-hidden shrink-0 whitespace-nowrap max-w-(--max-screen-width) mx-auto">
          {
            showLogo && (
              <div className="w-xs">
                <Link
                  to='/'
                  className='m-2 p-2 flex items-center'
                >
                  <Logo />
                </Link>
              </div>
            )}
          <div className="flex items-center gap-4 ml-auto overflow-x-auto overflow-y-hidden">
            {
              navRoutes.map((route, i) => (
                route.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger key={route.href} className={clsx(
                      'whitespace-nowrap hover:underline',
                      isActive(route) ? 'text-primary' : 'text-gray-600 dark:text-gray-400',
                    )}>
                      {route.label}
                      <ChevronDown className={
                        clsx(
                          "inline-block ml-0.5 transition-transform size-4",
                        )}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {route.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href!}
                            className={clsx(
                              "cursor-pointer",
                              isActive(child) ? 'text-primary!' : 'text-gray-600 dark:text-gray-400',
                            )}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  // <div key={route.href} className="relative">
                  //   <Link
                  //     to={route.href}
                  //     className={clsx(
                  //       'whitespace-nowrap hover:underline',
                  //       isActive(route) ? 'text-primary' : 'text-gray-600 dark:text-gray-400',
                  //     )}
                  //   >
                  //     {route.label}
                  //   </Link>

                  //   <ChevronDown className={
                  //     clsx(
                  //       "inline-block ml-0.5 transition-transform size-4",
                  //     )}
                  //   />
                  //   <div className="absolute left-0 top-full mt-1 bg-background-100 border rounded-md shadow-lg z-10">
                  //     {route.children.map((child) => (
                  //       <Link
                  //         key={child.href}
                  //         to={child.href}
                  //         className={clsx(
                  //           'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700',
                  //           isActive(child) ? 'text-primary' : 'text-gray-600 dark:text-gray-400',
                  //         )}
                  //       >
                  //         {child.label}
                  //       </Link>
                  //     ))}
                  //   </div>
                  // </div>
                ) :
                  <>
                    <Link
                      key={`${route.href}-${i}`}
                      to={route.href!}
                      className={
                        clsx(
                          'whitespace-nowrap hover:underline',
                          isActive(route) ? 'text-primary' : 'text-gray-600 dark:text-gray-400',
                        )
                      }>
                      {route.label}
                    </Link>
                  </>
              ))
            }
            {children}
            <div className='flex gap-4 border-l pl-4 items-center'>
              <ModeToggle className="scale-110" />
              <div className=''>
                <OpenfortKitButton />
              </div>
              <Link to={"/provider"} className="btn btn-accent btn-sm btn-circle">
                <SettingsIcon className="size-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

// export const WithNav = ({ children, navRoutes }: { children: React.ReactNode; navRoutes: NavRoute[] }) => {
//   return (
//     <div className=' flex flex-col h-full'>
//       <Nav navRoutes={navRoutes} />
//       {children}
//     </div>
//   )
// }