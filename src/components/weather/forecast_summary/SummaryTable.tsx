import './SummaryTable.scss';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Button, Table } from '@mui/material';
import { format } from 'fecha';
import React from 'react';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
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

function prevDateWithinRange(
  date: Date | null,
  index: number,
  dates: (Date | null)[],
): string | null {
  if (date === null) return null;
  if (index === 0) return null;
  const prevParsedDate = dates[index - 1];
  if (!prevParsedDate) return null;
  return format(prevParsedDate, 'YYYY-MM-DD');
}

function nextDateWithinRange(
  date: Date | null,
  index: number,
  dates: (Date | null)[],
): string | null {
  if (date === null) return null;
  if (index === (dates.length - 1)) return null;
  const nextParsedDate = dates[index + 1];
  if (!nextParsedDate) return null;
  return format(nextParsedDate, 'YYYY-MM-DD');
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
          {parsedDates.map((date, index) => {
            const txt = date === null ? '' : format(date, 'ddd DD').toUpperCase();
            const dateKey = date === null ? '' : format(date, 'YYYY-MM-DD').toUpperCase();
            const dateMatches = matchesSelecteDate(date, dailyForecastFilter.date);
            const prevDateKey = prevDateWithinRange(date, index, parsedDates);
            const nextDateKey = nextDateWithinRange(date, index, parsedDates);
            return (
              (!dateSelectedIsWithinForecastRange || dateMatches) && (
                <TableCell key={txt} align='center'>
                  <Box sx={{ align: 'center', direction: 'row' }}>
                    {dateSelectedIsWithinForecastRange && (
                      <>
                        <ArrowLeftIcon
                          style={{ color: 'grey', fontSize: 65 }}
                          onClick={() => selectDate(prevDateKey || '')}
                          sx={{ padding: '0px', margin: '0px' }}
                        />
                        <Button onClick={() => selectDate(dateKey)}>
                          {txt}
                        </Button>
                        <ArrowRightIcon
                          style={{ color: 'grey', fontSize: 65 }}
                          sx={{ padding: '0px', margin: '0px' }}
                          onClick={() => selectDate(nextDateKey || '')}
                        />
                      </>
                    )}
                    {!dateSelectedIsWithinForecastRange && (
                      <Button onClick={() => selectDate(dateKey)}>{txt}</Button>
                    )}
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
