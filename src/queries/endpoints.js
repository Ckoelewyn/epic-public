import api from "services/api";

import { TABLE_DEFAULTS } from "constants";

const apiConfig = {
	url:
		process.env.REACT_APP_API ||
		localStorage.getItem("from_public_server--remote_api_path") ||
		"http://localhost:3000/api/public",
};

const parseFilters = (filter) => {
	let filterAsString = ``;
	filter.forEach((filter) => {
		filterAsString += `&and[${filter.filterKey}]=${filter.key}`;
	});
	return filterAsString;
};

const parseSortBy = (tableColumn, direction) => {
	if (tableColumn === "") {
		return "";
	}
	if (direction === "asc") {
		return `&sortBy=+${tableColumn}`;
	} else {
		return `&sortBy=-${tableColumn}`;
	}
};

const parseTableParams = (tableParameters) => {
	let paramsAsString = ``;
	Object.keys(tableParameters).forEach((key) => {
		if (tableParameters[key] !== null && tableParameters[key] !== undefined) {
			if (key === "sortBy") {
				paramsAsString += parseSortBy(tableParameters[key].orderBy, tableParameters[key].order);
			} else {
				paramsAsString += `&${key}=${tableParameters[key]}`;
			}
		}
	});
	return paramsAsString;
};

export const getLists = () => {
	return api.get(apiConfig, `/search?dataset=List&pageSize=1000`);
};

export const getOrganizations = (type) => {
	return api.get(apiConfig, `/organization?companyType=${type}&sortBy=+name&fields=name`);
};

export const getProjects = (keywords, filters, tableParameters) => {
	parseTableParams(tableParameters);
	return api.get(
		apiConfig,
		`/search?dataset=Project&keywords=${keywords}&projectLegislation=default&populate=true&fuzzy=true${parseTableParams(
			tableParameters,
		)}${parseFilters(filters)}`,
	);
};

export const getRecentActivity = () => {
	return api.get(apiConfig, `/recentActivity?top=true`);
};
