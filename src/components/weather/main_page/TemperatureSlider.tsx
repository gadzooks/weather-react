/* eslint-disable prefer-destructuring */
import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { DailyForecastFilter } from '../../../interfaces/DailyForecastFilter';

function valuetext(value: number) {
  return `${value}°C`;
}

const PrettoSlider = styled(Slider)({
  color: '#ffb413',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#ffb413',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

// TODO move all constants to 1 file
const minTemp = 20;
const maxTemp = 120;
const defaultMinTemp = 40;
const defaultMaxTemp = 90;

const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
  {
    value: 120,
    label: '120°C',
  },
];

const minDistance = 20;

interface TempSliderProps {
  // onChangeCommitted: any;
  dailyForecastFilter: DailyForecastFilter;
  // eslint-disable-next-line react/no-unused-prop-types
  setDailyForecastFilter: any;
}

export default function MinimumDistanceSlider(props: TempSliderProps) {
  // const [value2, setValue2] = React.useState<number[]>([
  //   defaultMinTemp,
  //   defaultMaxTemp,
  // ]);

  const { dailyForecastFilter } = props;
  const { setDailyForecastFilter } = props;
  // console.log(dailyForecastFilter);

  // const value2 = [
  //   dailyForecastFilter.tempmin || defaultMinTemp,
  //   dailyForecastFilter.tempmax || defaultMaxTemp,
  // ];

  // eslint-disable-next-line react/destructuring-assignment
  // const setValue2 = props.setDailyForecastFilter;

  const handleChange2 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    console.log(`handlechange : ${JSON.stringify(dailyForecastFilter)}`);
    console.log(`new value is ${newValue}`);
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        // setValue2([clamped, clamped + minDistance]);
        const newDFF = { ...dailyForecastFilter };
        newDFF.tempmin = clamped;
        newDFF.tempmax = clamped + minDistance;
        console.log(`aaa : setting dailyff : ${JSON.stringify(newDFF)}`);
        setDailyForecastFilter(newDFF);
        // setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        // setValue2([clamped - minDistance, clamped]);
        const newDFF = { ...dailyForecastFilter };
        newDFF.tempmin = clamped - minDistance;
        newDFF.tempmax = clamped;
        console.log(`bbb : setting dailyff : ${JSON.stringify(newDFF)}`);
        setDailyForecastFilter(newDFF);
      }
    } else {
      // setValue2(newValue as number[]);
      const newDFF = { ...dailyForecastFilter };
      newDFF.tempmin = newValue[0];
      newDFF.tempmax = newValue[1];
      console.log(`ccc : setting dailyff : ${JSON.stringify(newDFF)}`);
      setDailyForecastFilter(newDFF);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <PrettoSlider
        getAriaLabel={() => 'Minimum distance shift'}
        value={[
          dailyForecastFilter.tempmin || defaultMinTemp,
          dailyForecastFilter.tempmax || defaultMaxTemp,
        ]}
        onChange={handleChange2}
        // onChangeCommitted={handleChange2}
        getAriaValueText={valuetext}
        disableSwap
        marks={marks}
        max={maxTemp}
        min={minTemp}
        valueLabelDisplay='auto'
      />
    </Box>
  );
}
