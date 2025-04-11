"use client";

import { useEffect } from "react";

import * as Flags from "country-flag-icons/react/3x2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectLanguage, setLanguage } from "@/store/reducers/language";
import { useTranslation } from "react-i18next";
import { getCookie, setCookie } from "@/lib/cookies";
// import { setLangCookies } from "@/lib/user-cookies";

const languages = [
  { code: "fr", label: "French" },
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
];

const LangSelector = () => {
  const currentLang = useAppSelector(selectLanguage);
  console.log("currentLang", currentLang);
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  useEffect(() => {
    const langFromCookie = getCookie("NEXT_LOCALE");
    i18n.changeLanguage(langFromCookie ?? "en");
    dispatch(setLanguage(langFromCookie ?? "en"));
    document.body.dir = i18n.dir();
  }, [dispatch, i18n, i18n.language]);

  const changeLanguage = (lng: string) => {
    setCookie("NEXT_LOCALE", lng);
    dispatch(setLanguage(lng));
    i18n.changeLanguage(lng);
  };

  const flagComponent = (lang: string = "en", isHeader: boolean = false) => {
    const sizeClass = isHeader
      ? "!w-5 sm:!w-6 md:!w-8 lg:!w-12 !h-5 "
      : "!h-4 !w-4 sm:!h-6 sm:!w-6";
    switch (lang) {
      case "en": {
        const Britain = Flags.GB;
        return <Britain className={sizeClass} />;
      }
      case "fr": {
        const French = Flags.FR;
        return <French className={sizeClass} />;
      }
      case "ar": {
        const SaudiArabia = Flags.SA;
        return <SaudiArabia className={sizeClass} />;
      }
      default: {
        const Britain = Flags.GB;
        return <Britain className={sizeClass} />;
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className=" focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <Button
          variant={"ghost"}
          className="flex items-center NOp-1 NObg-black/5 rounded-sm"
        >
          {flagComponent(currentLang, true)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="backdrop-blur bg-white dark:bg-carText/80 border-none flex flex-col gap-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center ${
              lang.code === currentLang ? "!bg-carText/40" : ""
            }`}
          >
            {flagComponent(lang.code)}
            <span
              className={`ml-2 ${
                lang.code === currentLang ? "font-semibold" : ""
              }`}
            >
              {lang.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangSelector;
