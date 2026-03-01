import { useTranslation } from "../helpers/i18n";
import Filter, { ContentTypeFilter, LinkSiteFilter, PreferredLinkSite } from "./filter";
import Timezone from "./timezone";

interface IFooter {
  changeTimezone: (timezone: string) => void;
  timezone: string;
  theme: string;
  toggleTheme: () => void;
  filterPreset: ContentTypeFilter;
  changeFilterPreset: (preset: ContentTypeFilter) => void;
  preferredLinkSite: PreferredLinkSite;
  changePreferredLinkSite: (site: PreferredLinkSite) => void;
}

const Footer = (props: IFooter) => {
  const { t } = useTranslation();
  return (
    <>
      <ul className="footer-list">
        <li>
          {t("footer.theme")}{" "}
          <button onClick={props.toggleTheme} className="theme-toggle" title={"Click to toggle light/dark"}>
            {props.theme}
          </button>
        </li>
        <li>
          {t("footer.timezone")}{" "}
          <Timezone onChange={props.changeTimezone} timezone={props.timezone} />
        </li>
        <li>
          {t("footer.filter")}{" "}
          <Filter onChange={props.changeFilterPreset} value={props.filterPreset} />
        </li>
        <li>
          {t("footer.open_titles_on")}{" "}
          <LinkSiteFilter
            onChange={props.changePreferredLinkSite}
            value={props.preferredLinkSite}
          />
        </li>
      </ul>
      <ul className="footer-list">
        <li>
          <a
            href="https://x.com/intent/tweet?source=https%3A%2F%2Fonthisday.watch%2F&text=What%20should%20I%20watch%20today%3F:%20https%3A%2F%2Fonthisday.watch"
            target="_blank"
            rel="noopener noreferrer"
            title="Share on X (formerly Twitter)"
          >
            {t("footer.share")}
          </a>
        </li>
        <li>
          <a
            href="http://github.com/leandcesar/onthisday.watch"
            target="_blank"
            rel="noopener noreferrer"
            title="View source code on GitHub"
          >
            {t("footer.source")}
          </a>
        </li>
      </ul>
    </>
  );
};

export default Footer;
