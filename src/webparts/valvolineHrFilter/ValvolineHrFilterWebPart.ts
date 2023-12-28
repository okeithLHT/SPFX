import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ValvolineHrFilterWebPartStrings';
import ValvolineHrFilter from './components/ValvolineHrFilter';
import { IValvolineHrFilterProps } from './components/IValvolineHrFilterProps';

import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from "@microsoft/sp-dynamic-data";
import { IHumanResourceRoleCategoryResourceFilter } from "../../data/IHumanResourceRoleCategoryResourceFilter";

import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';

export interface IValvolineHrFilterWebPartProps {
  description: string;
  //Filter Title label name change
  filterTitleLabel: string;
  //Code Editor for Paragraph Text
  bodyText: string;
  //left Cell label name change
  leftCellLabel: string;
  //right Cell label name change
  rightCellLabel: string;
  //role filter label name change
  roleFilterLabel: string;
  //category filter label name change
  categoryFilterLabel: string;
  //resource filter label name change
  resourceFilterLabel: string;
  //Role Legend Labels
  roleLegend1Label: string;
  roleLegend2Label: string;
  roleLegend3Label: string;
  //toggle resouce type visibility
  toggleRoleFilter: boolean;
  //toggle category type visibility
  toggleCategoryFilter: boolean;
  //toggle category type visibility
  toggleResourceFilter: boolean;
  //file picker 
  filePickerResult: IFilePickerResult;
  //Icon Picker 2
  icon2PickerResult: IFilePickerResult;
  //Icon Picker 3
  icon3PickerResult: IFilePickerResult;
  //main filter css
  mainHrFilterCSS: string;
  //change the header title css
  headerTitleCSS: string;
  //change the header body css
  headerBodyCSS: string;
  //change the humanResourceFilter css
  humanResourceFilterCSS: string;
  //change the cellLeft css
  leftCellCSS: string;
  //change the cellRight css
  rightCellCSS: string;
}

export default class ValvolineHrFilterWebPart extends BaseClientSideWebPart<IValvolineHrFilterWebPartProps> 
implements IDynamicDataCallables {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _selectedHumanResourceFilter: IHumanResourceRoleCategoryResourceFilter;

  public render(): void {
    const element: React.ReactElement<IValvolineHrFilterProps> = React.createElement(
      ValvolineHrFilter,
      {
        description: this.properties.description,
        filterTitleLabel: this.properties.filterTitleLabel,
        bodyText: this.properties.bodyText,
        leftCellLabel: this.properties.leftCellLabel, 
        rightCellLabel: this.properties.rightCellLabel, 
        roleFilterLabel: this.properties.roleFilterLabel,
        categoryFilterLabel: this.properties.categoryFilterLabel,
        resourceFilterLabel: this.properties.resourceFilterLabel,
        roleLegend1Label: this.properties.roleLegend1Label,
        roleLegend2Label: this.properties.roleLegend2Label,
        roleLegend3Label: this.properties.roleLegend3Label,
        toggleRoleFilter: this.properties.toggleRoleFilter,
        toggleCategoryFilter: this.properties.toggleCategoryFilter,
        toggleResourceFilter: this.properties.toggleResourceFilter,
        filePickerResult: this.properties.filePickerResult,
        icon2PickerResult: this.properties.icon2PickerResult,
        icon3PickerResult: this.properties.icon3PickerResult,
        mainHrFilterCSS: this.properties.mainHrFilterCSS,
        headerTitleCSS: this.properties.headerTitleCSS,
        headerBodyCSS: this.properties.headerBodyCSS,
        humanResourceFilterCSS: this.properties.humanResourceFilterCSS,
        leftCellCSS: this.properties.leftCellCSS,
        rightCellCSS: this.properties.rightCellCSS,
				isDarkTheme: this._isDarkTheme,
				environmentMessage: this._environmentMessage,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				userDisplayName: this.context.pageContext.user.displayName,
				context: this.context,
				onFilterSelected: this._filterSelected,
      }
    );

    ReactDom.render(element, this.domElement);
  }


	/**
	 * Event handler for selecting an event in the list
	 */
	private _filterSelected = (filter: IHumanResourceRoleCategoryResourceFilter): void => {
		// store the currently selected human resource role in the class variable. Required
		// so that connected component will be able to retrieve its value
		this._selectedHumanResourceFilter = filter;
		// notify subscribers that the selected humanResourceRole has changed
		this.context.dynamicDataSourceManager.notifyPropertyChanged("humanResourceFilter");
	};

	protected onInit(): Promise<void> {
		// register this web part as dynamic data source
		this.context.dynamicDataSourceManager.initializeSource(this);

		return this._getEnvironmentMessage().then((message) => {
			this._environmentMessage = message;
		});
	}

  	/**
	 * Return list of dynamic data properties that this dynamic data source
	 * returns
	 */
	public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
		return [
			{
				id: "humanResourceFilter",
				title: "humanResourceFilter",
			},
		];
	}

  	/**
	 * Return the current value of the specified dynamic data set
	 * @param propertyId ID of the dynamic data set to retrieve the value for
	 */
	public getPropertyValue(propertyId: string): IHumanResourceRoleCategoryResourceFilter {
		return this._selectedHumanResourceFilter;
		throw new Error("Bad property id");
	}



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),                
                //Property - Edit the CSS for the Role Filter Name
                PropertyFieldCodeEditor('mainHrFilterCSS', {
                  label: 'Edit CSS for the main Filter CSS the card',
                  panelTitle: 'Edit CSS for main Filter CSS of the card',
                  initialValue: this.properties.mainHrFilterCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                    wrap: true,
                    fontSize: 20,
                    // more options
                    }
                 }),
                //Property - Change label text of Role Filter Name
                PropertyPaneTextField('filterTitleLabel', {
                  label: 'Name of the Filter Title here'
                }),
                //Property - Edit the CSS for the Role Filter Name
                PropertyFieldCodeEditor('headerTitleCSS', {
                  label: 'Edit CSS for the Header Title the card',
                  panelTitle: 'Edit CSS for Header Title of the card',
                  initialValue: this.properties.headerTitleCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                    wrap: true,
                    fontSize: 20,
                    // more options
                    }
                 }), 
                //Code Editor block for Body Paragraph
                PropertyFieldCodeEditor('bodyText', {
                  label: 'Edit Body Text/HTML Code',
                  panelTitle: 'Edit Body Text/HTML Code',
                  initialValue: this.properties.bodyText,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.HTML,
                  options: {
                    wrap: true,
                    fontSize: 20,
                    // more options
                  }
                }),
                //Property - Edit the CSS for the Body Text
                PropertyFieldCodeEditor('headerBodyCSS', {
                  label: 'Edit CSS for the Body the card',
                  panelTitle: 'Edit CSS for Body of the card',
                  initialValue: this.properties.headerBodyCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                   wrap: true,
                   fontSize: 20,
                   // more options
                  }
                }),
                //Property - Edit the CSS for the humanResourceFilter
                PropertyFieldCodeEditor('humanResourceFilterCSS', {
                  label: 'Edit CSS for the humanResourceFilter on the card',
                  panelTitle: 'Edit CSS for the humanResourceFilter on the card',
                  initialValue: this.properties.humanResourceFilterCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                   wrap: true,
                   fontSize: 20,
                   // more options
                  }
                }),  
                //Property - Change label text of Role Filter Name
                PropertyPaneTextField('leftCellLabel', {
                  label: 'Name of the Left Cell Block Title here'
                }),
                //Property - Edit the CSS for the left Cell
                PropertyFieldCodeEditor('leftCellCSS', {
                  label: 'Edit CSS for the left Cell on the card',
                  panelTitle: 'Edit CSS for the left Cell on the card',
                  initialValue: this.properties.leftCellCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                   wrap: true,
                   fontSize: 20,
                   // more options
                  }
                }), 
                //Property - Change label text of right cell block title Name
                PropertyPaneTextField('rightCellLabel', {
                  label: 'Name of the Right Cell Block Title here'
                }),
                //Property - Edit the CSS for the right Cell
                PropertyFieldCodeEditor('rightCellCSS', {
                  label: 'Edit CSS for the right Cell on the card',
                  panelTitle: 'Edit CSS for the right Cell on the card',
                  initialValue: this.properties.rightCellCSS,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  key: 'codeEditorFieldId',
                  language: PropertyFieldCodeEditorLanguages.css,
                  options: {
                   wrap: true,
                   fontSize: 20,
                   // more options
                  }
                }), 
                //Property - Change label text of Role Filter Name
                PropertyPaneTextField('roleFilterLabel', {
                  label: 'Name of the role filter here'
                }),
                //Property - Change label text of Category Filter Name
                PropertyPaneTextField('categoryFilterLabel', {
                  label: 'Name of the category filter here'
                }),
                //Property - Change label text of Resource Filter Name
                PropertyPaneTextField('resourceFilterLabel', {
                  label: 'Name of the resource filter here'
                }),
                //Property - Change label text of Resource Filter Name
                PropertyPaneTextField('roleLegend1Label', {
                  label: 'Name of role legend 1 label here'
                }),
                //Property - Change label text of Resource Filter Name
                PropertyPaneTextField('roleLegend2Label', {
                  label: 'Name of role legend 2 label here'
                }),
                //Property - Change label text of Resource Filter Name
                PropertyPaneTextField('roleLegend3Label', {
                  label: 'Name of role legend 3 label here'
                }),
                //Property - Toggle Show/Hide Role Filter
                PropertyPaneToggle('toggleRoleFilter', {
                  //name of the toggle
                  label: "Show or Hide Role Filter"
                }),
                //Property - Toggle Show/Hide Catgory Filter
                PropertyPaneToggle('toggleCategoryFilter', {
                  //name of the toggle
                  label: "Show or Hide Category Filter"
                }),
                //Property - Toggle Show/Hide Catgory Filter
                PropertyPaneToggle('toggleResourceFilter', {
                  //name of the toggle
                  label: "Show or Hide Resource Filter"
                }),
                PropertyFieldFilePicker('filePicker', {
                  context: this.context as any,
                  filePickerResult: this.properties.filePickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e; },
                  key: "filePickerId",
                  buttonLabel: "Swap File Here",
                  label: "Change Icon 1",
                }),
                PropertyFieldFilePicker('icon2Picker', {
                  context: this.context as any,
                  filePickerResult: this.properties.icon2PickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.icon2PickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.icon2PickerResult = e; },
                  key: "icon2PickerId",
                  buttonLabel: "Swap File Here",
                  label: "Change Icon 2",
                }),
                PropertyFieldFilePicker('icon3Picker', {
                  context: this.context as any,
                  filePickerResult: this.properties.icon3PickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.icon3PickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.icon3PickerResult = e; },
                  key: "icon3PickerId",
                  buttonLabel: "Swap File Here",
                  label: "Change Icon 3",
                }),     
              ]
            }
          ]
        }
      ]
    };
  }
}
