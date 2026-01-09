import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, decrementBy, reset } from "./counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState(0);
  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())} type="button">
          ++
        </button>
        <button onClick={() => dispatch(decrement())} type="button">
          --
        </button>
        <button onClick={() => dispatch(reset())} type="button">
          reset
        </button>
        <input
          type="test"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          onClick={() => dispatch(decrementBy(incrementAmount))}
          type="button"
        >
          by
        </button>
      </div>
    </section>
  );
}

export default Counter;
