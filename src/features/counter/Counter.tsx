import { useState, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, decrementBy, reset } from './counterSlice';
import type { RootState } from '../../app/store';

function Counter() {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState<number>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIncrementAmount(Number(e.target.value) || 0);
  };

  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())} type='button'>
          ++
        </button>
        <button onClick={() => dispatch(decrement())} type='button'>
          --
        </button>
        <button onClick={() => dispatch(reset())} type='button'>
          reset
        </button>
        <input
          type='number'
          value={incrementAmount}
          onChange={handleInputChange}
        />
        <button
          onClick={() => dispatch(decrementBy(incrementAmount))}
          type='button'
        >
          by
        </button>
      </div>
    </section>
  );
}

export default Counter;
