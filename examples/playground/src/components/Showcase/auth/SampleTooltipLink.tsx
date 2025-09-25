import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FileRoutesByFullPath } from "@/routeTree.gen"
import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"

type SampleTooltipLinkProps = {
  href: keyof FileRoutesByFullPath,
  fn: string,
  hook: string,
}

export const SampleTooltipLink = ({
  children,
  href,
  fn,
  hook,
}: PropsWithChildren<SampleTooltipLinkProps>) => {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild >
        <div className='flex flex-col'>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <h3 className='text-base mb-1'>
          {hook}
        </h3>
        Using the
        <Link
          to={href}
          search={{ focus: fn }}
          className='px-1 group'
        >
          {fn}
        </Link>
        function.
      </TooltipContent>
    </Tooltip>
  )
}
