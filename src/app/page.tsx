import MainLayout from "@/components/Layout/MainLayout";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <>
      <MainLayout>
        <div>
          {/* The 3D view will be rendered here */}
        </div>
      </MainLayout>
      <ToastContainer/>
    </>
  );
}