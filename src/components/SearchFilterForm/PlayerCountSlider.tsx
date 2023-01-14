import type { CollectionFilterReducer } from "@/types";
import Slider from "@mui/material/Slider";

type Props = {
  filter: CollectionFilterReducer;
};

const getValueLabel = (value: number) =>
  value > 10 ? "10+" : value.toString();

const marks = Array.from({ length: 11 }, (_, i) => i + 1).map((value) => ({
  value,
  label: getValueLabel(value),
}));

const convertElevenToInfinity = (value: number) =>
  value >= 11 ? Number.POSITIVE_INFINITY : value;

export const PlayerCountSlider = ({
  filter: { filterState, filterDispatch },
}: Props) => (
  <div className="mt-2 mr-6 flex flex-col">
    <label htmlFor="player-count" className="text-sm">
      Filter by Player Count
    </label>
    <Slider
      id="player-count"
      className="mx-4 mt-8"
      getAriaLabel={getValueLabel}
      getAriaValueText={getValueLabel}
      valueLabelFormat={getValueLabel}
      valueLabelDisplay="on"
      min={1}
      max={11}
      marks={marks}
      scale={convertElevenToInfinity}
      value={filterState.playerCountRange}
      onChange={(_, value) => {
        filterDispatch({
          type: "SET_PLAYER_COUNT_RANGE",
          payload: value as [number, number],
        });
      }}
    />
  </div>
);
