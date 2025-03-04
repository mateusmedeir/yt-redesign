let resultsFiltersCounter = 0;

const resultsFiltersArray = {
    "type": {
        label: "Type",
        name: "type",
        options: [
            {
                label: "All",
                value: "any",
            },
            {
                label: "Video",
                value: "AB",
                value2: "E"
            },
            {
                label: "Channel",
                value: "AC"
            },
            {
                label: "Playlist",
                value: "AD"
            },
            {
                label: "Movie",
                value: "AE",
                value2: "Q"
            },
        ],
        selected: "any"
    },
    "uploadDate": {
        label: "Upload date",
        name: "uploadDate",
        options: [
            {
                label: "Any Time",
                value: "any"
            },
            {
                label: "Last hour",
                value: "BEA"
            },
            {
                label: "Today",
                value: "CEA"
            },
            {
                label: "This week",
                value: "DEA"
            },
            {
                label: "This month",
                value: "EEA"
            },
            {
                label: "This year",
                value: "FEA"
            }
        ],
        selected: "any"
    },
    "duration": {
        label: "Duration",
        name: "duration",
        options: [
            {
                label: "Any",
                value: "any"
            },
            {
                label: "Under 4 minutes",
                value: "GAE",
                value2: "YAQ"
            },
            {
                label: "4-20 minutes",
                value: "GAM",
                value2: "YAW"
            },
            {
                label: "Over 20 minutes",
                value: "GAI",
                value2: "YAg"
            }
        ],
        selected: "any"
    },
    "sortBy": {
        label: "Sort by",
        name: "sortBy",
        options: [
            {
                label: "Relevance",
                value: "CAA"
            },
            {
                label: "Upload date",
                value: "CAI"
            },
            {
                label: "View count",
                value: "CAM"
            },
            {
                label: "Rating",
                value: "CAE"
            }
        ],
        selected: "CAA"
    }
};

function findSelectedOption(oldParams, filter, separators, before = "") {
    return filter.options.find((option) => 
        separators.some(separator => {
            const baseValue = `${separator}${before}${option.value}`;
            return oldParams.includes(baseValue) || (option.value2 && oldParams.includes(`${separator}${before}${option.value2}`));
        })
    );
}

function setResultsSelectedFilter(oldParams, name, separators = [], before) {
    if (before == "any") before = "";

    const filter = resultsFiltersArray[name];
    if (!filter) return null;

    const selected = before || separators.length
        ? findSelectedOption(oldParams, filter, separators, before)
        : findSelectedOption(oldParams, filter, [""]);

    return filter.selected = selected?.value || resultsFiltersArray[name].options[0].value;
}

function setResultsSelectedFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const oldParams = urlParams.get("sp");
    
    if (!oldParams) return;

    const separators = ["SAh", "SBB", "SBAg", "SBgg"];
    
    setResultsSelectedFilter(oldParams, "sortBy");
    const selectedUploadDate = setResultsSelectedFilter(oldParams, "uploadDate", separators);
    setResultsSelectedFilter(oldParams, "duration");
    setResultsSelectedFilter(oldParams, "type", separators, selectedUploadDate);

    return !!selectedUploadDate && selectedUploadDate !== "any";
}


function setResultsFilters(event) {
    const name = event.target.name;
    const value = event.target.value;

    const url = new URL(window.location.href);
    const oldParams = url.searchParams.get("sp");

    if (oldParams)
        setResultsSelectedFilter(oldParams, name);

    resultsFiltersArray[name].selected = value;

    const newParamsObj = Object.entries(resultsFiltersArray)
    .filter((filter) => filter[1].selected !== "any")
    .reduce((obj, filter) => {
        obj[filter[0]] = {
            value: filter[1].selected,
            value2: filter[1].options.find((option) => option.value === filter[1].selected).value2 || ""
        };
        return obj;
    }, {});

    let newParams = "";

    if (!newParamsObj["type"] && (newParamsObj["uploadDate"] || newParamsObj["duration"])) {
        newParamsObj["type"] = resultsFiltersArray["type"].options[1];
    }

    if (newParamsObj["sortBy"] && newParamsObj["uploadDate"] && newParamsObj["duration"]) {
        const separator = "SBgg";
        
        newParams = `${newParamsObj["sortBy"].value}${ separator}${newParamsObj["uploadDate"].value }${ newParamsObj["type"].value2}${newParamsObj["duration"].value2}`;
    }else if (newParamsObj["sortBy"] && newParamsObj["uploadDate"]) {
        const separator = "SBAg";
        
        newParams = `${newParamsObj["sortBy"].value}${separator}${newParamsObj["uploadDate"].value}${newParamsObj["type"].value2}`;
     
    }else if (newParamsObj["sortBy"] && newParamsObj["duration"]) {
        const separator = "SBB";

        newParams = `${newParamsObj["sortBy"].value}${separator}${newParamsObj["type"].value}${newParamsObj["duration"].value}`;
    } else if (newParamsObj["sortBy"] && newParamsObj["type"]) {
        const separator = "SAh";
    
        newParams = `${newParamsObj["sortBy"].value}${separator}${newParamsObj["type"].value}`;
    } else if (newParamsObj["sortBy"]) {
        newParams = newParamsObj["sortBy"].value;
    }

    url.searchParams.set("sp", newParams);
    window.location.href = url.href;
}

function ResultsFilters() {
    if (resultsFiltersCounter > 0) return false;
    
    const ytSearchContainer = document.querySelector("ytd-search #container");
    
    if (ytSearchContainer) {
        if (setResultsSelectedFilters()) {
            resultsFiltersArray["type"].options.forEach((option) => {
                if (option.label != "Video" && option.label != "Movie") {
                    option.disabled = true;
                }
            });
        }
        
        const filtersContainer = document.createElement("div");
        filtersContainer.classList.add("yt-results-filters");
        
        for (const type of Object.entries(resultsFiltersArray)) {
            const select = CreateSelect(type[1].label, type[1].name, type[1].options, type[1].selected, setResultsFilters);
            filtersContainer.appendChild(select);
        }
        
        ytSearchContainer.insertBefore(filtersContainer, ytSearchContainer.firstChild);

        resultsFiltersCounter++;
        return true;
    }

    return false;
}

const ResultsObserver = new MutationObserver(() => {
    if (ResultsFilters()) {
        ResultsObserver.disconnect();
    }
  });
ResultsObserver.observe(document.body, { childList: true, subtree: true });
