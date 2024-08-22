import { ProtectedPage } from "@/components/ProtectedPage";
import { Translate } from "@/components/Translate";

const Home = () => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Translate />
    </main>
  );
};

export default ProtectedPage(Home);
