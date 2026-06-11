"use client";

import withAuth from "@/components/hoc/withAuth";
import HomePage from "./HomePage";

export default withAuth(HomePage, "auth");
