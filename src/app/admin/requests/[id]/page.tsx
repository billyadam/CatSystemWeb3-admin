"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import ReviewBreederPage from "@/components/pages/requests/ReviewBreederPage";

function Page({ params }: { params: { id: string } }) {
	return (
		<Layout withNavbar>
			<ReviewBreederPage id={params.id} />
		</Layout>
	);
}

export default withAuth(Page, "auth");
