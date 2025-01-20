"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Accountpage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/account/settings");
  }, [router]);

  return <></>;
};

export default Accountpage;
