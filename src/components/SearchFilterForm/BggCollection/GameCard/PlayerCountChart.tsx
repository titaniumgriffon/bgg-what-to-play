import { useRef } from "react";
import {
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  Cell,
} from "recharts";
import type { BoardGame } from "..";
import type { CollectionFilters } from "../../useCollectionFilters";
import { useOnScreen } from "../hooks/useOnScreen";

const tooltipSort = ["Best", "Recommended", "Not Recommended"] as const;

type Recommendation = typeof tooltipSort[number];

const colorFillByRec: Record<Recommendation, [string, string]> = {
  "Best": ["#15803d" /* green-700 */, "#bbf7d0" /* green-200 */],
  "Recommended": ["#22c55e" /* green-500 */, "#dcfce7" /* green-100 */],
  "Not Recommended": ["#f87171" /* red-400 */, "#fee2e2" /* red-100 */],
};

type Props = Pick<BoardGame, "recommendedPlayerCount"> & {
  filterState: CollectionFilters;
};

const getFill = (
  numplayers: Props["recommendedPlayerCount"][number]["numplayers"],
  filterState: CollectionFilters,
  recommendation: Recommendation
) => {
  const [defaultColor, fadedColor] = colorFillByRec[recommendation];
  const [minRange, maxRange] = filterState.filterByPlayerCountRange;

  if (minRange !== 1 || maxRange !== Number.POSITIVE_INFINITY) {
    const playerCountOnRec =
      typeof numplayers === "string"
        ? parseInt(numplayers, 10) + 1
        : numplayers;

    return minRange <= playerCountOnRec && playerCountOnRec <= maxRange
      ? defaultColor
      : fadedColor;
  }

  return defaultColor;
};

// TODO: replace tooltip with % in label (p3) - see https://recharts.org/en-US/api/Label
// TODO: display placeholder when no data available (p2) - see https://github.com/recharts/recharts/issues/430

export const PlayerCountChart = ({
  recommendedPlayerCount,
  filterState,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref);

  return (
    <div ref={ref} className="h-36">
      {isOnScreen && (
        <ResponsiveContainer minWidth="6rem" minHeight="9rem">
          <BarChart
            width={500}
            height={300}
            data={recommendedPlayerCount}
            stackOffset="sign"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="numplayers" axisLine={false} />
            <Tooltip
              formatter={(value) => Math.abs(parseInt(value.toString(), 10))}
              itemSorter={(item) =>
                tooltipSort.indexOf(item.dataKey as Recommendation)
              }
              labelFormatter={(label) => `Player Count: ${label}`}
            />
            <ReferenceLine y={0} stroke="#000" />

            {["Recommended", "Best", "Not Recommended"].map(
              (recommendation, recommendationIndex) => (
                <Bar
                  key={`${recommendation}-${recommendationIndex}`}
                  stackId="playerCount"
                  maxBarSize={32}
                  dataKey={recommendation}
                >
                  {recommendedPlayerCount.map(
                    (playerCount, playerCountIndex) => (
                      <Cell
                        key={`${recommendation}-${playerCount.numplayers}-${playerCountIndex}`}
                        fill={getFill(
                          playerCount.numplayers,
                          filterState,
                          recommendation as Recommendation
                        )}
                      />
                    )
                  )}
                </Bar>
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
