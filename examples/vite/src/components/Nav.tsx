import { Link, useLocation } from "@tanstack/react-router";
import { FileRoutesByTo } from "../routeTree.gen";
import clsx from "clsx";
import { Logo } from "@/components/ui/logo";
import { navRoutes } from "@/lib/navRoute";

export type NavRoute = {
  href: keyof FileRoutesByTo;
  label: string;
  exact?: boolean;
}



export const Nav = ({ showLogo, children, overridePath }: { showLogo?: boolean; children?: React.ReactNode; overridePath?: string }) => {
  const location = useLocation();
  const path = location.pathname.includes("showcase") ? "/" : overridePath || location.pathname;

  const isActive = (item: NavRoute) => {
    if (item.exact) {
      return path === item.href
    }
    return (!!item.href && path.includes(item.href));
  };

  return (
    <>
      <nav className='h-(--nav-height) pr-4 bg-background-100 border-b w-full flex fixed z-10'>
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
                <Link
                  key={`${route.href}-${i}`}
                  to={route.href}
                  className={
                    clsx(
                      'whitespace-nowrap hover:underline',
                      isActive(route) ? 'text-primary' : 'text-gray-600 dark:text-gray-400',
                    )
                  }>
                  {route.label}
                </Link>
              ))
            }
            {children}
          </div>
        </div>
      </nav>
    </>
  )
}

export const WithNav = ({ children, navRoutes }: { children: React.ReactNode; navRoutes: NavRoute[] }) => {
  return (
    <div className=' flex flex-col h-full'>
      {/* <Nav navRoutes={navRoutes} /> */}
      {children}
    </div>
  )
}