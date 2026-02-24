import React from "react";
import { useTranslation } from "../helpers/i18n";

export type ContentTypeFilter =
  | "all"
  | "only_movies"
  | "only_tv"
  | "only_people";

interface IFilter {
  value: ContentTypeFilter;
  onChange: (value: ContentTypeFilter) => void;
}

const Filter = (props: IFilter) => {
  const { t } = useTranslation();

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(event.target.value as ContentTypeFilter);
  };

  return (
    <select value={props.value} onChange={onChange}>
      <option value="all">{t("footer.filter_all")}</option>
      <option value="only_movies">{t("footer.filter_only_movies")}</option>
      <option value="only_tv">{t("footer.filter_only_tv")}</option>
      <option value="only_people">{t("footer.filter_only_people")}</option>
    </select>
  );
};

export default Filter;
