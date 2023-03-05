import type { CollectionFilterReducer } from "@/types";
import * as _ from "lodash-es";
import {
  getQueryParamValue,
  getValueLabel,
  maybeSetQueryParam,
  isBoardGameRangeWithinFilterRange,
} from "./slider-utils";
import type { SliderControl } from "./useCollectionFilters";

const QUERY_PARAM_RATINGS = "ratings";
const DEFAULT_RATINGS_MIN = 1;
const DEFAULT_RATINGS_MAX = 10;
const DEFAULT_RANGE = [DEFAULT_RATINGS_MIN, DEFAULT_RATINGS_MAX] as [
  number,
  number
];

const convertRangeQueryParamToValue = (
  value: string | null
): [number, number] => {
  if (!value) {
    return DEFAULT_RANGE;
  }

  const normalizedValue = value.includes("-") ? value : `${value}-${value}`;
  const [minRangeStr, maxRangeStr] = normalizedValue.split("-");

  const parsedMinRange = parseFloat(minRangeStr);
  const minRange = isNaN(parsedMinRange)
    ? DEFAULT_RATINGS_MIN
    : _.clamp(parsedMinRange, DEFAULT_RATINGS_MIN, DEFAULT_RATINGS_MAX);

  const parsedMaxRange = parseFloat(maxRangeStr);
  const maxRange = isNaN(parsedMaxRange)
    ? DEFAULT_RATINGS_MAX
    : _.clamp(parsedMaxRange, DEFAULT_RATINGS_MIN, DEFAULT_RATINGS_MAX);

  return [minRange, maxRange];
};

const getInitialState = () =>
  convertRangeQueryParamToValue(getQueryParamValue(QUERY_PARAM_RATINGS));

const getReducedState: SliderControl["getReducedState"] = (state, payload) => {
  const [minRange, maxRange] = payload;
  const ratingsRange = [minRange, maxRange] as [number, number];
  return { ...state, ratingsRange };
};

const setQueryParam: SliderControl["setQueryParam"] = (searchParams, state) =>
  maybeSetQueryParam(
    searchParams,
    state.ratingsRange,
    DEFAULT_RANGE,
    QUERY_PARAM_RATINGS
  );

const getLabelByFilter = (
  filterState: CollectionFilterReducer["filterState"]
) =>
  filterState.showRatings === "USER_RATING"
    ? "User Ratings"
    : "Average Ratings";

const getAriaLabel =
  (filterState: CollectionFilterReducer["filterState"]) => (index: number) =>
    index === 0
      ? `Minimum ${getLabelByFilter(filterState)}`
      : `Maximum ${getLabelByFilter(filterState)}`;

const marks = Array.from({ length: 101 }, (_, index) => ({
  value: index / 10,
  label: index % 10 === 0 ? (index / 10).toString() : "",
}));

const getSliderProps: SliderControl["getSliderProps"] = (filterState) => ({
  valueLabelDisplay: "auto",
  getAriaLabel: getAriaLabel(filterState),
  getAriaValueText: getValueLabel,
  valueLabelFormat: getValueLabel,
  min: DEFAULT_RATINGS_MIN,
  max: DEFAULT_RATINGS_MAX,
  step: 0.1,
  marks,
});

const isWithinRange: SliderControl["isWithinRange"] =
  (filterState) => (game) => {
    const userOrAverageRating =
      filterState.showRatings === "USER_RATING"
        ? game.userRating
        : game.averageRating;

    const rating =
      typeof userOrAverageRating === "number"
        ? userOrAverageRating
        : DEFAULT_RATINGS_MIN;

    return isBoardGameRangeWithinFilterRange(
      [rating, rating],
      filterState.ratingsRange
    );
  };

export const ratingsService: SliderControl = {
  getInitialState,
  getReducedState,
  setQueryParam,
  getSliderLabel: (filterState) => `Filter by ${getLabelByFilter(filterState)}`,
  getSliderProps,
  isWithinRange,
};
