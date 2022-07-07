import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, Table } from '@mui/material';
import { format } from 'fecha';
import React from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Box } from 'grommet/components/Box';
import { LocationInterface } from '../../../interfaces/LocationInterface';
import { ForeacastDates, ForecastResponse } from '../../../interfaces/ForecastResponseInterface';
import Region from './Region';
import { RegionInterface } from '../../../interfaces/RegionInterface';
import { MatchedAreas } from '../../../interfaces/MatchedAreas';
import { DailyForecastFilter, dateSelectedMatchesForecastDates, matchesSelecteDate } from '../../../interfaces/DailyForecastFilter';

// eslint-disable-next-line max-len
export function matchedLocations(needle: RegExp | null, region: RegionInterface) :LocationInterface[] {
  if (!needle) return region.locations;
  return region.locations.filter((l) => l.description.match(needle));
}

export interface SummaryTableProps {
  forecastResponse: ForecastResponse | null;
  forecastDates: ForeacastDates;
  matchedAreas: MatchedAreas;
  dailyForecastFilter: DailyForecastFilter;
  setDailyForecastFilter: any;
}

function SummaryTable(props: SummaryTableProps) {
  const { forecastDates } = props;
  const { weekends } = forecastDates;
  const { parsedDates } = forecastDates;
  const { matchedAreas } = props;
  const regions = matchedAreas.regions || [];
  const locationsByRegion = matchedAreas.locationsByRegion || {};
  const { dailyForecastFilter } = props;
  const { forecastResponse } = props;
  const { setDailyForecastFilter } = props;

  const dateSelectedIsWithinForecastRange = dateSelectedMatchesForecastDates(
    forecastDates.dates,
    dailyForecastFilter.date,
  );

  const selectDate = (date: string) => {
    const dFF = { ...dailyForecastFilter } as DailyForecastFilter;
    if (date === dFF.date) {
      dFF.date = '';
    } else {
      dFF.date = date;
    }
    setDailyForecastFilter(dFF);
  };

  return (
    <Table className='table table-sm weather-forecast-summary'>
      <TableHead className='table-heading'>
        <TableRow>
          {/* <TableCell>Weather Alerts</TableCell> */}
          <TableCell>Location</TableCell>
          {parsedDates.map((date) => {
            const txt = date === null ? '' : format(date, 'ddd DD').toUpperCase();
            const dateKey = date === null ? '' : format(date, 'YYYY-MM-DD').toUpperCase();
            const dateMatches = matchesSelecteDate(date, dailyForecastFilter.date);
            return (
              (!dateSelectedIsWithinForecastRange || dateMatches) && (
                <TableCell key={txt}>
                  <Box direction='column'>
                    <Box align='center'>
                      { !dateSelectedIsWithinForecastRange
                        && (
                        <Button onClick={() => selectDate(dateKey)}>
                          <BookmarkBorderIcon
                            style={{ color: 'grey', fontSize: 25 }}
                          />
                        </Button>
                        )}
                      { dateSelectedIsWithinForecastRange
                        && (
                        <Button onClick={() => selectDate(dateKey)}>
                          <BookmarkIcon
                            style={{ color: 'grey', fontSize: 25 }}
                          />
                        </Button>
                        )}
                    </Box>
                    <Box>{txt}</Box>
                  </Box>
                </TableCell>
              )
            );
          })}
        </TableRow>
      </TableHead>
      {regions.map((region: RegionInterface) => {
        const locations = locationsByRegion[region.name];
        if (forecastResponse?.forecasts) {
          return (
            <Region
              key={region.name}
              isWeekend={weekends}
              region={region}
              forecastsById={forecastResponse?.forecasts}
              locations={locations}
              dailyForecastFilter={dailyForecastFilter}
              dateSelectedIsWithinForecastRange={
              dateSelectedIsWithinForecastRange
            }
            />
          );
        }
        return null;
      })}
    </Table>
  );
}

export default SummaryTable;
