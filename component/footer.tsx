import React from "react";
import { useTranslation } from "../helpers/i18n";
import Timezone from "./timezone";

interface IFooter {
  changeTimezone: (timezone: string) => void;
  timezone: string;
  theme: string;
  toggleTheme: () => void;
}

const Footer = (props: IFooter) => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <>
      <ul className="footer-list">
        <li>
          {t("footer.share")}{" "}
          <a
            href="https://x.com/intent/tweet?source=https%3A%2F%2Fonthisday.watch%2F&text=What%20should%20I%20watch%20today%3F:%20https%3A%2F%2Fonthisday.watch"
            target="_blank"
            rel="noopener noreferrer"
            title="Xed? Share on X"
          >
            X
          </a>
        </li>
        <li>
          {t("footer.source")}{" "}
          <a
            href="http://github.com/leandcesar/onthisday.watch"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </li>
        <li>
          {t("footer.timezone")}{" "}
          <Timezone onChange={props.changeTimezone} timezone={props.timezone} />
        </li>
        <li>
          {t("footer.theme")}{" "}
          <button
            onClick={props.toggleTheme}
            className="theme-toggle"
            title={`Current: ${props.theme}. Click to toggle light/dark`}
          >
            {props.theme}
          </button>
        </li>
        {/* <li>
          {t("footer.language")}{" "}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </li> */}
      </ul>
    </>
  );
};

export default Footer;
