import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { CompanyInputBox } from "../Inputs/CompanyInputBox";
import Image from "next/image";
import { RoleInputBox } from "../Inputs/RoleInputBox";
import { LocationInputBox } from "../Inputs/LocationInputBox";
import useScreenSize from "~/hooks/useScreenSize";
import { SaveSearchSelect } from "../Inputs/SaveSearchSelect";
import { useFilter } from "~/context/FilterContext";
import { UserJobsTrackerSkeleton } from "../LoadingAndSkeletonsAndOverlays/userJobsTrackerSkeleton";
import toast from "react-hot-toast";
import type { Search } from "@prisma/client";
import { useEffect, useState } from "react";
import { SaveSearchInputDisabled } from "./saveSearchInputDisabled";
import { SavedSearchCountCircle } from "./SavedSearchCountCircle";

const SavedSearches: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editButtonIcon, setEditButtonIcon] = useState("/111-write white.svg");
  const [editableName, setEditableName] = useState("");
  const { userId } = useAuth();
  const defaultSearch = {
    id: -1,
    userId: userId!,
    name: "Select a saved search",
    title: "...",
    location: "...",
    company: "...",
    jobDescription: "...",
    salary: "...",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const {
    selectedSearch,
    setSelectedSearch,
    setLocationFilter,
    setRoleFilter,
    setCompanyFilter,
    setIsInputDisabled,
    isInputDisabled,
    roleFilter,
    locationFilter,
    companyFilter,
    setRoleInputValue,
    setLocationInputValue,
    setCompanyInputValue,
  } = useFilter();

  useEffect(() => {
    setIsInputDisabled(!isEditMode);
    setEditButtonIcon(isEditMode ? "/save.svg" : "/111-write white.svg");
    if (isEditMode) {
      setEditableName(selectedSearch.name);
    }
  }, [isEditMode, setIsInputDisabled, selectedSearch.name]);

  const screenSize = useScreenSize();

  const {
    data: userSearches,
    isLoading,
    refetch,
  } = api.search.getSearches.useQuery();

  const { mutate: deleteSearch } = api.search.deleteSearch.useMutation();
  const { mutate: updateSearch } = api.search.updateSearch.useMutation();

  useEffect(() => {
    setRoleFilter(selectedSearch.title!);
    setRoleInputValue(selectedSearch.title!);
    setLocationFilter(selectedSearch.location!);
    setLocationInputValue(selectedSearch.location!);
    setCompanyFilter(selectedSearch.company!);
    setCompanyInputValue(selectedSearch.company!);
  }, [selectedSearch]);

  if (isLoading) return <UserJobsTrackerSkeleton />;

  if (!userId) return <div>Please log in to view saved searches.</div>;

  if (!userSearches || userSearches.length === 0)
    return <div>No saved searches to show!</div>;

  function handleSelectSearch(search: Search) {
    if (isEditMode) {
      setIsEditMode(false);
    }
    setSelectedSearch(search);
  }
  function delSearch(selectedSearch: Search) {
    if (selectedSearch?.id) {
      deleteSearch(selectedSearch.id, {
        onSuccess: () => {
          setRoleFilter("");
          setLocationFilter("");
          setCompanyFilter("");

          setSelectedSearch(defaultSearch);
          refetch().catch((error) => {
            console.error("Failed to refetch: ", error);
          });

          toast.success("Search deleted successfully", {
            style: {
              borderRadius: "10px",
              background: "#00A907",
              color: "#fff",
            },
          });
        },
        onError: () => {
          toast.error("Error deleting search", {
            style: {
              borderRadius: "10px",
              background: "#E61A1A",
              color: "#fff",
            },
          });
        },
      });
    }
  }

  function editSearch() {
    setIsEditMode(!isEditMode);
  }

  function saveSearch() {
    const updatedSearch = {
      id: selectedSearch.id,
      userId: userId!,
      name: editableName,
      title: roleFilter,
      location: locationFilter,
      company: companyFilter,
      jobDescription: selectedSearch.jobDescription,
      salary: selectedSearch.salary,
      createdAt: selectedSearch.createdAt,
      updatedAt: new Date(),
    };

    updateSearch(
      {
        id: selectedSearch.id,
        name: editableName,
        title: roleFilter,
        location: locationFilter,
        company: companyFilter,
      },
      {
        onSuccess: () => {
          toast.success("Search updated successfully", {
            style: {
              borderRadius: "10px",
              background: "#00A907",
              color: "#fff",
            },
          });
          setIsEditMode(false);

          setSelectedSearch(updatedSearch);

          refetch().catch((error) => {
            console.error("Failed to refetch: ", error);
          });
        },
        onError: () => {
          toast.error("Error updating search", {
            style: {
              borderRadius: "10px",
              background: "#E61A1A",
              color: "#fff",
            },
          });
        },
      },
    );
  }

  return (
    <>
      <div className="bg-[#1A78E6]shadow-lg relative mb-60 flex min-h-[400px] flex-col justify-start rounded-lg border-2 border-solid border-[#1A78E6] bg-[#1A78E6] shadow-lg sm:flex-row md:mx-4 lg:min-w-full lg:max-w-prose">
        {screenSize! < 640 ? (
          <div className="mt-2 flex items-center justify-center">
            <SaveSearchSelect handleSelectSearch={handleSelectSearch} />
          </div>
        ) : (
          <div className=" min-w-fit overflow-y-auto rounded-lg bg-white p-4 sm:rounded-md">
            <ul className="max-w mb-4 flex flex-col items-start justify-start text-lg sm:mx-auto">
              {userSearches.map((search) => (
                <li className="flex w-full flex-row items-center justify-between border-b border-slate-300 shadow-sm">
                  <button
                    className="mr-4 cursor-pointer text-start"
                    onClick={() => {
                      handleSelectSearch(search);
                    }}
                  >
                    {search.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex w-max flex-row flex-wrap justify-center lg:w-full lg:flex-nowrap">
          <div
            id="filters"
            className="flex grow flex-col justify-center bg-[#1A78E6] p-4 font-bold text-white"
          >
            <div
              id="searchName"
              className="flex grow flex-row items-center justify-between border-b text-center"
            >
              {isEditMode ? (
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="w-fit rounded-lg px-3 py-1 pr-2 text-xl text-black shadow-md"
                />
              ) : (
                <h1 className="text-xl">{selectedSearch.name}</h1>
              )}
              <div className="flex w-fit flex-col items-end justify-center min-w-max">
                <button onClick={isEditMode ? saveSearch : editSearch}>
                  <Image
                    src={editButtonIcon}
                    alt={isEditMode ? "Save" : "Edit"}
                    height={20}
                    width={20}
                    className="m-1"
                  />
                </button>
                <button
                  onClick={() => {
                    delSearch(selectedSearch);
                  }}
                >
                  <Image
                    src={"/002-remove white.svg"}
                    alt="Edit"
                    height={20}
                    width={20}
                    className="m-1"
                  />
                </button>
              </div>
            </div>
            <div id="filtersFields" className="my-4 flex h-[80%] grow flex-col">
              <div className="flex grow flex-col">
                <span className="">I'm looking for</span>
                <div className={isInputDisabled ? "hidden" : ""}>
                  <RoleInputBox />
                </div>
                <div className={isInputDisabled ? "" : "hidden"}>
                  <SaveSearchInputDisabled data={selectedSearch.title} />
                </div>
              </div>

              <div className="flex grow flex-col">
                <span className="">In</span>
                <div className={isInputDisabled ? "hidden" : ""}>
                  <LocationInputBox />
                </div>
                <div className={isInputDisabled ? "" : "hidden"}>
                  <SaveSearchInputDisabled data={selectedSearch.location} />
                </div>
              </div>
              <div className="flex grow flex-col">
                <span className="">At</span>
                <div className={isInputDisabled ? "hidden" : ""}>
                  <CompanyInputBox />
                </div>
                <div className={isInputDisabled ? "" : "hidden"}>
                  <SaveSearchInputDisabled data={selectedSearch.company} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex min-w-full max-w-full grow items-center justify-center rounded-bl-lg rounded-br-lg md:rounded-bl-none bg-black p-4 text-black lg:rounded-tr-lg lg:min-w-[400px]">
            <SavedSearchCountCircle />
          </div>
        </div>
      </div>
    </>
  );
};
export default SavedSearches;