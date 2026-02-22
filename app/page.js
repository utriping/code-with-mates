"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import authStore from "@/lib/authStore";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();
  const setUserData = authStore((state) => state.signIn);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/me");
        const userDetails = res.data;
        setUserData(userDetails);
      } catch (err) {}
    };
    fetchUserDetails();
  }, []);

  // useEffect(() => {
  //   router.push("/dashboard");
  // }, [router]);

  return <Navbar />;
}
