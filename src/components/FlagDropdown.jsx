import React, { useState, useRef, useEffect } from "react";
import Flags from "country-flag-icons/react/3x2";
import currencyCountryMap from "../utils/currencyCountryMap";

const currencyCodes = Object.keys(currencyCountryMap);

export default function FlagDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = currencyCountryMap[value];
  const SelectedFlag = selected?.countryCode ? Flags[selected.countryCode] : null;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full border rounded-lg px-4 py-2 text-lg font-semibold flex items-center"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center flex-1 min-w-0">
          {SelectedFlag ? (
            <SelectedFlag className="w-6 h-4 mr-2 rounded-sm shadow flex-shrink-0" />
          ) : (
            <span className="inline-block w-6 h-4 bg-gray-200 rounded mr-2 flex-shrink-0" />
          )}
          <span className="truncate flex-1 text-left">
            {value} {selected?.name}
          </span>
        </span>
        <span className="ml-2">&#x25BC;</span>
      </button>
      {open && (
        <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
          {currencyCodes.map((code) => {
            const { name, countryCode } = currencyCountryMap[code];
            const FlagIcon = countryCode ? Flags[countryCode] : null;
            return (
              <li
                key={code}
                className="px-4 py-2 flex items-center cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  onChange(code);
                  setOpen(false);
                }}
              >
                {FlagIcon ? (
                  <FlagIcon className="w-6 h-4 mr-2 rounded-sm shadow flex-shrink-0" />
                ) : (
                  <span className="inline-block w-6 h-4 bg-gray-200 rounded mr-2 flex-shrink-0" />
                )}
                <span className="truncate flex-1">
                  {code} {name}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
