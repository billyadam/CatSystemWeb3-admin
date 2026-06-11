import Layout from "@/components/layout/Layout";
import HomePage from "@/components/pages/home/ProtectedHomePage";

export default function Page() {
  return (
    <Layout withNavbar>
      <HomePage />
    </Layout>
  );
}
