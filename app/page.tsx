import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import LandingPage from "./components/LandingPage";
// import HomeClient from "./home-client";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  // Pass the session data as a prop to the client component
  return <LandingPage/>;
}