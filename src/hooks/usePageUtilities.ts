import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectLanguage } from "@/store/reducers/language";
import { useTranslation } from "react-i18next";

export const usePageUtilities = () => {
  const { t } = useTranslation();
  const currentLang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  return {
    t,
    currentLang,
    dispatch,
  };
};
