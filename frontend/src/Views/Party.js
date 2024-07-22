import { useEffect } from "react";
import { makeRequest } from "../service/apiconfig";
import { useState } from "react";
import Card from "../Components/Card";
import Layout from "./Layout";
import AppButton from "../Components/AppButton";
import { Link } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import EmptyList from "../Components/EmptyList";
import { toast } from "react-toastify";

const Party = () => {
  const [allParties, setAllParties] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  useEffect(() => {
    makeRequest("/party", "GET", null, getPartiesCB);
  }, []);

  const getPartiesCB = (res) => {
    if (res?.success) {
      const sortedOrder = res?.data.sort((a, b) => {
        return a.partyName.localeCompare(b.partyName);
      });
      setAllParties(sortedOrder);
    }
  };

  const filterData = () => {
    if (searchedText) {
      return allParties.filter((party) => {
        return (
          String(party.mobileNo).indexOf(searchedText) > -1 ||
          party.partyName.toLowerCase().indexOf(searchedText.toLowerCase()) > -1
        );
      });
    }
    return allParties;
  };
  const PartyInfo = ({ data }) => {
    const deleteParty = (ev) => {
      const payload = { id: data._id };
      makeRequest(`/party/delete`, "POST", payload, partyDeleteCB);
      ev.preventDefault();
    };

    const partyDeleteCB = (result) => {
      if (result.success) {
        toast.success("Party deleted successfully.");
        makeRequest("/party", "GET", null, getPartiesCB);
      } else {
        toast.error("Can't delete party, try again.");
      }
    };
    return (
      <div className="flex flex-col w-full gap-2 md:gap-4">
        <div className="flex flex-row justify-between">
          <div>
            <span className="text-primary">{data.partyName} </span>
            <span className="text-normal">({data.mobileNo})</span>
          </div>
          <h3
            className="text-normal"
            style={{ color: data.amount > 0 ? "red" : "green" }}
          >
            Amount: {Math.abs(data.amount).toFixed(2)}
          </h3>
        </div>
        <div className="flex">
          <h3
            className="text-normal text-red-500 cursor-pointer  hover:border-b hover:border-red-500"
            onClick={deleteParty}
          >
            DELETE PARTY
          </h3>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col relative gap-8">
        <SearchBar onTextChage={setSearchedText} />
        <div className="grid grid-cols-1  gap-4">
          {filterData().length ? (
            filterData().map((partyData, index) => {
              return (
                <Card to={`/party/${partyData._id}`} key={partyData._id}>
                  <PartyInfo data={partyData} />
                </Card>
              );
            })
          ) : (
            <EmptyList
              label="party"
              buttonLabel="Create Party"
              className={"col-span-full"}
            />
          )}
        </div>
        <Link to="create">
          <AppButton label="Create Party" />
        </Link>
      </div>
    </Layout>
  );
};

export default Party;
