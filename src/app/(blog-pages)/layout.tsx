'use client'

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 mx-auto w-[1300px]">{children}</div>
  );
}
