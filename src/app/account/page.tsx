"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import AccountPage from "@/components/pages/account/AccountPage";

function Page() {
  return (
    <Layout withNavbar>
      <AccountPage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
