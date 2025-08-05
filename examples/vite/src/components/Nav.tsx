import { Link, useLocation } from "@tanstack/react-router";
import { FileRoutesByTo } from "../routeTree.gen";
import clsx from "clsx";

export type NavRoute = {
  href: keyof FileRoutesByTo;
  label: string;
  exact?: boolean;
}

export const Nav = ({ navRoutes, children }: { navRoutes: NavRoute[]; children?: React.ReactNode }) => {
  const path = useLocation().pathname;

  const isActive = (item: NavRoute) => {
    if (item.exact) {
      return path === item.href
    }
    return (!!item.href && path.includes(item.href));
  };

  return (
    <nav className='flex items-center p-4 gap-4 bg-gray-100 dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-700 overflow-x-auto overflow-y-hidden'>
      {
        navRoutes.map((route, i) => (
          <Link key={`${route.href}-${i}`} to={route.href} className={
            clsx(
              'whitespace-nowrap hover:underline',
              isActive(route) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400',
            )
          }>
            {route.label}
          </Link>
        ))
      }
      {children}
    </nav>
  )
}

export const WithNav = ({ children, navRoutes }: { children: React.ReactNode; navRoutes: NavRoute[] }) => {
  return (
    <div className='overflow-hidden flex flex-col h-full'>
      <Nav navRoutes={navRoutes} />
      {children}
    </div>
  )
}