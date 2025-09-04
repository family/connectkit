export const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col h-full gap-4 p-4 pb-8'>
      {children}
    </div>
  )
}