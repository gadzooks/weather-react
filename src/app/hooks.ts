import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';

// https://egghead.io/lessons/react-using-the-redux-devtool-support-built-in-to-redux-toolkit
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
