import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "../lib/auth";

export const Route = createFileRoute("/_protected")({
  component: Protected,
});

export default function Protected() {
 
  return (
    <>
      <Outlet />
    </>
  );
}
