import "@/App.css";
import { useTranslation } from "react-i18next";
import LangSelector from "@/components/common/LangSelector";
import LightDarkMode from "./components/common/LightDarkMode";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const { t } = useTranslation();
  const [data, setData] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      console.log(import.meta.env.VITE_API_URL);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
      console.log(response.data);
      setData(response.data);
    };
    fetchData();
  }, []);
  return (
    <div className="h-screen flex flex-col items-center ">
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold  mb-4">{t("Welcome to React")}</h1>
        <p className="text-lg  mb-8">{data}</p>
        <div className="flex space-x-4">
          <LangSelector />
          <LightDarkMode />
        </div>
      </div>
    </div>
  );
}

export default App;
