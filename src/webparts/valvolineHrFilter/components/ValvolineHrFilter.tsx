import * as React from "react";
import { useState, useEffect } from "react";
import { SPHttpClient } from "@microsoft/sp-http";

import styles from "./ValvolineHrFilter.module.scss";
import { IValvolineHrFilterProps } from "./IValvolineHrFilterProps";

const ValvolineHrFilter = (
	Props: IValvolineHrFilterProps
) => {
	//set the Title label to the inner html of the Title
	if(document.getElementById("filterTitle") != null)document.getElementById("filterTitle").innerHTML = Props.filterTitleLabel;

	//replace the HTML code editor text with the one here.  
	if(document.getElementById("bodyText") != null)document.getElementById("bodyText").innerHTML = Props.bodyText;

	//set the Cell left label to the inner html of the Title
	if(document.getElementById("leftCellLabel") != null)document.getElementById("leftCellLabel").innerHTML = Props.leftCellLabel;

	//set the Cell right label to the inner html of the Title
	if(document.getElementById("rightCellLabel") != null)document.getElementById("rightCellLabel").innerHTML = Props.rightCellLabel;

	//set the role filter label to the inner html of the role filter label IF it is loaded 
	if(document.getElementById("roleFilterHTML_Label") != null)document.getElementById("roleFilterHTML_Label").innerHTML = Props.roleFilterLabel;

	//set the category filter label to the inner html of the category filter label IF it is loaded 
	if(document.getElementById("categoryFilterHTML_Label") != null)document.getElementById("categoryFilterHTML_Label").innerHTML = Props.categoryFilterLabel;

	//set the resource filter label to the inner html of the category filter label IF it is loaded 
	if(document.getElementById("resourceFilterHTML_Label") != null)document.getElementById("resourceFilterHTML_Label").innerHTML = Props.resourceFilterLabel;

	//set the role legends 1-3 to the inner html of the category filter label IF it is loaded 
	if(document.getElementById("roleLegend1_Label") != null)document.getElementById("roleLegend1_Label").innerHTML = Props.roleLegend1Label;
	if(document.getElementById("roleLegend2_Label") != null)document.getElementById("roleLegend2_Label").innerHTML = Props.roleLegend2Label;
	if(document.getElementById("roleLegend3_Label") != null)document.getElementById("roleLegend3_Label").innerHTML = Props.roleLegend3Label;

	//show and hide the Role Filter
	if(document.getElementById("toggleRoleFilter") != null) {
		if(!Props.toggleRoleFilter)document.getElementById("toggleRoleFilter").style.display = "none";
		else if(Props.toggleRoleFilter)document.getElementById("toggleRoleFilter").style.display = "block";
	}
	
	//show and hide the Category Filter
	if(document.getElementById("toggleCategoryFilter") != null) {
		if(!Props.toggleCategoryFilter)document.getElementById("toggleCategoryFilter").style.display = "none";
		else if(Props.toggleCategoryFilter)document.getElementById("toggleCategoryFilter").style.display = "block";
	}

	//ensure that the document is loaded onto the page
	if((document.getElementById("toggleCategoryFilter") && document.getElementById("toggleRoleFilter")) != null) {
		//hide the cell left if toggleCategoryFilter and toggleRoleFilter and not enabled
		if(!Props.toggleCategoryFilter && !Props.toggleRoleFilter)document.getElementById("cellLeft").style.display = "none";
		else if(Props.toggleCategoryFilter || Props.toggleRoleFilter)document.getElementById("cellLeft").style.display = "flex";
		//if the Resouce Filter is hidden then align center, else then use the grid
		if(!Props.toggleResourceFilter) {
			document.getElementById("humanResouceFilter").style.display = "flex";
			document.getElementById("humanResouceFilter").style.justifyContent = "center";
		} else if(Props.toggleResourceFilter)document.getElementById("humanResouceFilter").style.display = "grid";
	}
	
	//show and hide the cellRight that has the Resource Filter within
	if(document.getElementById("toggleResourceFilter") != null) {
		if(!Props.toggleResourceFilter)document.getElementById("toggleResourceFilter").style.display = "none";
		else if(Props.toggleResourceFilter)document.getElementById("toggleResourceFilter").style.display = "block";
	}

	const url: string = Props.context.pageContext.web.absoluteUrl;
	const getLookups = async (lookupList: string): Promise<any> => {
		const response = await Props.context.spHttpClient.get(
			//flip these when testing local
			//`${url}/sites/ValvolineDevelopmentGatewayPortal/_api/web/lists/getbytitle('${lookupList}')/items`,
			`${url}/_api/web/lists/getbytitle('${lookupList}')/items`,
			SPHttpClient.configurations.v1,
			{
				headers: {
					Accept: "application/json;odata=nometadata",
					"odata-version": "",
				},
			}
		);
		const jsonResponse = await response.json();
		return jsonResponse;
	};
	const [optionsInfo, setOptionsInfo] = useState<{ [Title: string]: string[] }>({});

	const processLookups = async () => {
		let roles = await getLookups("Human Resource Roles");
		//organize the drop down list alphabetically
		if(roles.value) {
			/* sorting for String Titles
			roles.value.sort((a:any, b:any) => {
				const valueA = a["Title"];
				const valueB = b["Title"];
				return(valueA.localeCompare(valueB));
			  });
			*/
			//sort by Id
			roles.value.sort((a:any, b:any) => a["Id0"] - b["Id0"]);
			console.log(roles);
		} else {
			return "loading..."
		}
		console.log(roles.values);
		let categories = await getLookups("Human Resource Categories");
		//organize the drop down list alphabetically
		if(categories.value) {
			categories.value.sort((a:any, b:any) => {
				const valueA = a["Title"];
				const valueB = b["Title"];
				return(valueA.localeCompare(valueB));
			  });
			  //console.log(categories);
		} else {
			return "loading..."
		}
		let resources = await getLookups("Product Icons");
		//organize the drop down list alphabetically
		if(resources.value) {
			resources.value.sort((a:any, b:any) => {
				const valueA = a["Title"];
				const valueB = b["Title"];
				return(valueA.localeCompare(valueB));
			  });
			  //console.log(resources);
		} else {
			return "loading..."
		}
		////
		setOptionsInfo({ ["--all--"]: [...categories.value.map((cat: any) => cat.Title)] });
		
		for (const role of roles.value) {
			setOptionsInfo((prev) => {
				return {
					...prev,

					[role.Title]: [
						...categories.value
							.filter((cat: any) => {
								//console.log(role.CategoryReferenceId);
								return role.CategoryReferenceId.includes(cat.Id);
							})
							.map((filteredCat: any) => filteredCat.Title),
					],
				};
			});
		}

		setRole_filterOptions((prev) => [
			prev[0],
			roles.value.map((role: any) => (
				<option id={role.Title} key={role.Title}>
					{role.Title}
				</option>
			)),
		]);
		setResource_filterOptions((prev) => [
			prev[0],
			resources.value.map((resource: any) => (
				<option id={resource.Title} key={resource.Title}>
					{resource.Title}
				</option>
			)),
		]);
	};

	const [role_filter, setRole_filter] = useState<string>("");
	const [category_filter, setCategory_filter] = useState<string>("");
	const [resource_filter, setResource_filter] = useState<string>("");
	const [role_filterOptions, setRole_filterOptions] = useState([
		<option key="--all--" id="--all--">
			--all--
		</option>,
	]);
	const [category_filterOptions, setCategory_filterOptions] = useState([
		<option key="--all--" id="--all--">
			--all--
		</option>,
	]);
	const [resource_filterOptions, setResource_filterOptions] = useState([
		<option key="--all--" id="--all--">
			--all--
		</option>,
	]);

	useEffect(() => {
		const categories = optionsInfo[role_filter];
		if (categories && categories.length > 1) {
			setCategory_filterOptions((prev) => [
				prev[0],
				...categories.map((cat) => (
					<option id={cat} key={cat}>
						{cat}
					</option>
				)),
			]);
		}
	}, [role_filter, optionsInfo]);

	const hasTeamsContext = Props.hasTeamsContext;

	useEffect(() => {
		processLookups().then().catch();

		const url = window.location.href;
		const paramString = url.split("?")[1];
		const queryString = new URLSearchParams(paramString);
		let role = "--all--";
		let category = "--all--";
		let resource = "--all--";

		if (queryString.get("role")) {
			role = queryString.get("role");
		}
		setRole_filter(role);
		if (queryString.get("category")) {
			category = queryString.get("category");
		}
		setCategory_filter(category);
		if (queryString.get("resource")) {
			resource = queryString.get("resource");
		}
		setResource_filter(resource);
		Props.onFilterSelected({
			role_filter: role,
			category_filter: category,
			resource_type_filter: resource,
		});
	}, []);

	//converts string of CSS into a useable style
	function inlineStylesToObject(styles: string) : Record<string, string> {

		const regex = /([\w-]+)\s*:\s*((?:(?:"[^"]+")|(?:'[^']+')|[^;])*);?/g;
			  
		const obj : Record<string, string> = {};
			  
		let match;
		while (match = regex.exec(styles)) {
			obj[match[1]] = match[2].trim();
		}
			return obj;
	}

	return (
		<section
			className={`${styles.valvolineHrFilter} ${
				hasTeamsContext ? styles.teams : ""
			}`} style={inlineStylesToObject(Props.mainHrFilterCSS)}
		>
			<div className={`${styles.humanResourceFilterHeader}`}>
				<div className={`${styles.headerTitle}`} id="filterTitle" style={inlineStylesToObject(Props.headerTitleCSS)}>
					Ready to Shift your Career into High Gear?
				</div>
				<div className={`${styles.headerSubtitle}`} id="bodyText" style={inlineStylesToObject(Props.headerBodyCSS)}>
					Explore opportunities to learn about yourself, practice skills, network
					internally and build the toolkit you need to lead yourself 
					and others effectively.
					<br></br><br></br>
					You can search by role and category and/or type of resource you are looking for.
				</div>
			</div>

			<div id="humanResouceFilter" style={inlineStylesToObject(Props.humanResourceFilterCSS)}>
				<div className={`${styles.cellLeft}`} id="cellLeft" style={inlineStylesToObject(Props.leftCellCSS)}>
					<div className={`${styles.cellTitle}`} id="leftCellLabel">Choose a role and category:</div>
					<div className={`${styles.roleLegendContainer}`}>
						<div className={`${styles.roleLegend}`}>
							<div>
								<img id="roleIconImage" src={Props.filePickerResult.fileAbsoluteUrl}></img>
							</div>
							<div className={`${styles.roleLegendText}`} id="roleLegend1_Label">Director+</div>
						</div>
						<div className={`${styles.roleLegend}`}>
							<div>
							    <img id="categoryIconImage" src={Props.icon2PickerResult.fileAbsoluteUrl}></img>
							</div>
							<div className={`${styles.roleLegendText}`} id="roleLegend2_Label">Individual Contributor</div>
						</div>
						<div className={`${styles.roleLegend}`}>
							<div>
							    <img id="managerIconImage" src={Props.icon3PickerResult.fileAbsoluteUrl}></img>
							</div>
							<div className={`${styles.roleLegendText}`} id="roleLegend3_Label">Manager</div>
						</div>
					</div>
					<div className={`${styles.selectContainer}`} id="toggleRoleFilter">
						<label id="roleFilterHTML_Label" className={styles.label} htmlFor="role">
							1. Select your Role:
						</label>
						<select
							className={styles.select}
							id="role"
							value={role_filter}
							onChange={(e) => {
								setRole_filter(e.target.value);
								Props.onFilterSelected({
									role_filter: e.target.value,
									category_filter: category_filter,
									resource_type_filter: resource_filter,
								});
							}}
						>
							{role_filterOptions}
						</select>
					</div>
					<div className={`${styles.selectContainer}`} id="toggleCategoryFilter">
						<label id="categoryFilterHTML_Label" className={styles.label} htmlFor="category">
							2. Select a category:
						</label>
						<select
							className={styles.select}
							id="category"
							value={category_filter}
							onChange={(e) => {
								setCategory_filter(e.target.value);
								Props.onFilterSelected({
									role_filter: role_filter,
									category_filter: e.target.value,
									resource_type_filter: resource_filter,
								});
							}}
						>
							{category_filterOptions}
						</select>
					</div>
				</div>
				<div className={`${styles.cellRight}`}  id="toggleResourceFilter"  style={inlineStylesToObject(Props.rightCellCSS)}>
					<div className={`${styles.cellTitle}`} id="rightCellLabel">And, search by a resource type:</div>
					<div className={`${styles.selectContainer}`}>
						<label id="resourceFilterHTML_Label" className={styles.label} htmlFor="resource">
							Select a resource type:
						</label>

						<select
							className={styles.select}
							id="resource"
							value={resource_filter}
							onChange={(e) => {
								setResource_filter(e.target.value);
								Props.onFilterSelected({
									role_filter: role_filter,
									category_filter: category_filter,
									resource_type_filter: e.target.value,
								});
							}}
						>
							{resource_filterOptions}
						</select>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ValvolineHrFilter;