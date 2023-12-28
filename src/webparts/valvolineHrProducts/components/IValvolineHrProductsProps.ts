import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IHumanResourceRoleCategoryResourceFilter } from "../../../data/IHumanResourceRoleCategoryResourceFilter";
import { DynamicProperty } from "@microsoft/sp-component-base";
import {IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";

export interface IValvolineHrProductsProps {
  description: string;
  numberOfCardsToDisplay: string;  
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  /**
   * The currently selected human resource role
   */
  humanResourceFilter: DynamicProperty<IHumanResourceRoleCategoryResourceFilter>;
    /**
   * Determines if the web part has been connected to a dynamic data source or
   * not
   */
  needsConfiguration: boolean;
  spfxContext: WebPartContext;
  //Toggle for the 'View All' selection
  toggleViewAll: boolean;
   //Toggle for the 'View All Bottom' selection
  toggleViewAllBottom: boolean;
  //Toggle Results
  toggleResults: boolean;
  //background file picker
  filePickerResult: IFilePickerResult,
  //icons file picker
  icon1PickerResult: IFilePickerResult,
  icon2PickerResult: IFilePickerResult,
  icon3PickerResult: IFilePickerResult,
  //CSS Code Editor string for styles.card in css
  cardCSS: string,
  //CSS Code Editor string for topBar in css
  topBarCSS: string,
  //CSS Code Editor string for iconArea in css
  iconAreaCSS: string,
  //CSS Code Editor string for icon in css
  iconCSS: string,
  //CSS Code Editor string for resourceTypeArea in css
  resourceTypeAreaCSS: string,
  //CSS Code Editor string for bodyArea in css
  bodyAreaCSS: string,
  //CSS Code Editor string for bodyAreaTitle in css
  bodyAreaTitleCSS: string,
  //CSS Code Editor string for bodyAreaTitle in css
  bodyAreaHiddenLinkCSS: string,
  //CSS Code Editor string for bodyAreaText in css
  bodyAreaTextCSS: string,
  //CSS Code Editor string for bodyAreaText in css
  bodyAreaText2CSS: string,
  //CSS Code Editor string for userArea in css
  userAreaCSS: string,
  //CSS Code Editor string for user icons in css
  userIconCSS: string,
  //CSS Code Editor string for resultRow in css
  resultRowCSS: string,
  //CSS Code Editor string for View All Bottom in css
  viewAllBottomCSS: string,
  //view all button label
  viewAllButtonLabel: string;
}
