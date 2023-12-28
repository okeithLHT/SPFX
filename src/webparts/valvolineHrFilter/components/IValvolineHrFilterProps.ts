import { IHumanResourceRoleCategoryResourceFilter } from "../../../data/IHumanResourceRoleCategoryResourceFilter";

import {IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";

export interface IValvolineHrFilterProps {
	description: string;
	filterTitleLabel: string,
	bodyText: string,
	leftCellLabel: string,
	rightCellLabel: string,
	roleFilterLabel: string,
	categoryFilterLabel: string,
	resourceFilterLabel: string,
	roleLegend1Label: string,
	roleLegend2Label: string,
	roleLegend3Label: string,
	toggleRoleFilter: boolean,
	toggleCategoryFilter: boolean,
	toggleResourceFilter: boolean,
	filePickerResult: IFilePickerResult,
	icon2PickerResult: IFilePickerResult,
	icon3PickerResult: IFilePickerResult,
	headerTitleCSS: string;
	headerBodyCSS: string;
	humanResourceFilterCSS: string;
	mainHrFilterCSS: string;
	leftCellCSS: string;
	rightCellCSS: string;
	isDarkTheme: boolean;
	environmentMessage: string;
	hasTeamsContext: boolean;
	userDisplayName: string;
	context: any;
	/**
	 * Event handler for selecting an role in the list
	 */
	onFilterSelected: (role: IHumanResourceRoleCategoryResourceFilter) => void;
}
