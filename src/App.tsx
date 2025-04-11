import "@/App.css";
import { useTranslation } from "react-i18next";
import LangSelector from "@/components/common/LangSelector";
import LightDarkMode from "./components/common/LightDarkMode";

function App() {
  const { t } = useTranslation();

  return (
    <div className="h-screen flex flex-col items-center ">
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold  mb-4">{t("Welcome to React")}</h1>
        <p className="text-lg  mb-8"></p>
        <div className="flex space-x-4">
          <LangSelector />
          <LightDarkMode />
        </div>
      </div>
    </div>
  );
}

export default App;
