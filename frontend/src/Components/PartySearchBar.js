import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { makeRequest } from "../service/apiconfig";
import { COLORS } from "../assets/colors";

const PartySearchBar = ({ onPartySelect }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchedParty, setSearchedParty] = useState([]);
  const [partyName, setPartyName] = useState("");

  useEffect(() => {
    const handleEscKeyPress = (ev) => {
      if (ev.key === "Escape") {
        setShowDropDown(false);
      }
    };
    const handleMouseClick = (ev) => {
      const area = document.getElementById("dropdown");
      if (area && area.contains(ev.target)) {
        ev.preventDefault();
        return;
      }
      setShowDropDown(false);
    };
    document.addEventListener("keydown", handleEscKeyPress);
    document.addEventListener("mousedown", handleMouseClick);
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
      document.removeEventListener("mousedown", handleMouseClick);
    };
  }, []);

  useEffect(() => {
    if (partyName.length === 0) {
      setShowDropDown(true);
    }

    makeRequest(
      `/party/search`,
      "POST",
      { query: partyName },
      searchedPartyCB,
      true
    );
  }, [partyName]);

  const searchedPartyCB = (res) => {
    setSearchedParty(res.data);
  };

  const handleTextChange = (val) => {
    setPartyName(val);
  };

  return (
    <div className="w-full relative">
      <SearchBar
        onFocus={() => {
          setShowDropDown(true);
        }}
        placeholder={"Enter party Name"}
        onTextChage={handleTextChange}
        value={partyName}
      />
      {showDropDown ? (
        <div
          id="dropdown"
          className="absolute w-full p-2 top-full mt-2 z-10 flex flex-col gap-1 rounded-lg max-h-60 overflow-scroll"
          style={{ backgroundColor: COLORS.cardBg, scrollbarWidth: "none" }}
        >
          {searchedParty.length ? (
            searchedParty.map((party, index) => {
              const selectPartyName = () => {
                onPartySelect(party);
                setPartyName(party.partyName);
                setShowDropDown(false);
              };
              return (
                <p
                  className={`p-2 rounded-md cursor-pointer hover:bg-[#f3f4e9]`}
                  key={index}
                  onClick={selectPartyName}
                >
                  {party.partyName}
                </p>
              );
            })
          ) : (
            <p className="p-4 rounded-md text-center font-medium ">
              No data found
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PartySearchBar;
