import React, { useState } from "react";
import { FaCalculator } from "react-icons/fa";

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (val) => {
    setInput(input + val);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
  };

  const handleEquals = () => {
    try {
      // eslint-disable-next-line no-eval
      setResult(eval(input).toString());
    } catch {
      setResult("Error");
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "+",
  ];

  return (
    <div className="max-w-xs mx-auto py-10">
      <h2 className="text-2xl font-bold mb-5 items-center flex text-center text-indigo-200">
        <span className=" mr-2">
          <FaCalculator />
        </span>
        Calculator
      </h2>
      <div className="bg-white/10 rounded-xl p-4 shadow-lg mb-4">
        <div className="text-white text-lg mb-2 break-all">{input || "0"}</div>
        <div className="text-indigo-300 text-xl font-bold">{result}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {buttons.map((b) => (
          <button
            key={b}
            className="py-3 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg text-lg"
            onClick={() => handleClick(b)}
          >
            {b}
          </button>
        ))}
        <button
          className="py-3 rounded bg-red-700 text-white font-bold shadow-lg text-lg col-span-2"
          onClick={handleClear}
        >
          C
        </button>
        <button
          className="py-3 rounded bg-yellow-600 text-white font-bold shadow-lg text-lg"
          onClick={handleDelete}
        >
          DEL
        </button>
        <button
          className="py-3 rounded bg-green-700 text-white font-bold shadow-lg text-lg"
          onClick={handleEquals}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;
