import useLocalStorage from './localstorage';
import {
  LS_SHOW_AQI_KEY,
  SHOW_AQI_DEFAULT,
} from '../components/weather/Constants';

export const useShowAqi = () => {
  const [showAqi, setShowAqi] = useLocalStorage(
    LS_SHOW_AQI_KEY,
    SHOW_AQI_DEFAULT,
  );

  return { showAqi, setShowAqi };
};
