import { Button } from "@ui/components/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Oops! The page you are looking for does not exist.</p>
      <Link href="/organizations" className="mt-6 text-blue-500 hover:underline">
        <Button>Back to Organizations</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
