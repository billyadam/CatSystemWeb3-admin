"use client";

import { use } from "react";
import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import ReviewBreederPage from "@/components/pages/requests/ReviewBreederPage";
interface PageProps {
    params: Promise<{ id: string }>;
}

function Page({ params }: PageProps) {
    const resolvedParams = use(params);
    
    return (
        <Layout withNavbar>
            <ReviewBreederPage id={resolvedParams.id} />
        </Layout>
    );
}

export default withAuth(Page, "auth");