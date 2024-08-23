import { ProtectedPage } from "@/components/ProtectedPage";
import { Translate } from "@/components/Translate";

const Home = () => {
  return (
    <div className={`flex  flex-col items-center justify-between p-24`}>
      <Translate />
    </div>
  );
};

export default ProtectedPage(Home);
