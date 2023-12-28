import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneConditionalGroup, 
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField,
  DynamicDataSharedDepth,  
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, IWebPartPropertiesMetadata } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ValvolineHrProductsWebPartStrings';
import ValvolineHrProducts from './components/ValvolineHrProducts';
import { IValvolineHrProductsProps } from './components/IValvolineHrProductsProps';

import { IHumanResourceRoleCategoryResourceFilter } from '../../data/IHumanResourceRoleCategoryResourceFilter';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';

//import styles from "./components/ValvolineHrProducts.module.scss";

export interface IValvolineProductsWebPartProps {
  description: string;
  numberOfCardsToDisplay: string;
  humanResourceFilter: DynamicProperty<IHumanResourceRoleCategoryResourceFilter>;
  toggleViewAll: boolean;
  toggleViewAllBottom: boolean;
  toggleResults: boolean;
  //file picker for Icon2 'IC' 
  filePickerResult: IFilePickerResult;
  //icon 1 picker
  icon1PickerResult: IFilePickerResult;
  //icon 2 picker
  icon2PickerResult: IFilePickerResult;
  //icon 3 picker
  icon3PickerResult: IFilePickerResult;
  //card scss picker string
  cardCSS: string;
  //topBar
  topBarCSS: string;
  //iconArea
  iconAreaCSS: string;
  //icon - main picture from list
  iconCSS: string;
  //resourceTypeArea
  resourceTypeAreaCSS: string;
  //bodyArea
  bodyAreaCSS: string;
  //bodyAreaTitleCSS
  bodyAreaTitleCSS: string;
  //bodyAreaHiddenLinkCSS
  bodyAreaHiddenLinkCSS: string;
  //bodyAreaTextCSS
  bodyAreaTextCSS: string;
  //bodyAreaTextCSS
  bodyAreaText2CSS: string;
  //userArea
  userAreaCSS: string;
  //icon - main picture from list
  userIconCSS: string;
  //resultRow
  resultRowCSS: string;
  //View All Bottom CSS
  viewAllBottomCSS: string;
  //view all button label
  viewAllButtonLabel: string;
}

export default class ValvolineHrProductsWebPart extends BaseClientSideWebPart<IValvolineProductsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';


  public render(): void {

    const needsConfiguration: boolean = !this.properties.humanResourceFilter.tryGetSource();
    
    const element: React.ReactElement<IValvolineHrProductsProps> = React.createElement(
      ValvolineHrProducts,
      {
        description: this.properties.description,
        numberOfCardsToDisplay: this.properties.numberOfCardsToDisplay,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        humanResourceFilter: this.properties.humanResourceFilter,
        needsConfiguration: needsConfiguration,
        spfxContext: this.context,
        //toggle on and off the view all button variable
        toggleViewAll: this.properties.toggleViewAll,
        toggleViewAllBottom: this.properties.toggleViewAllBottom,
        toggleResults: this.properties.toggleResults,
        //background Products page picker
        filePickerResult: this.properties.filePickerResult,
        //icons products page picker
        icon1PickerResult: this.properties.icon1PickerResult,
        icon2PickerResult: this.properties.icon2PickerResult,
        icon3PickerResult: this.properties.icon3PickerResult,
        //card css editor
        cardCSS: this.properties.cardCSS,
        topBarCSS: this.properties.topBarCSS,
        iconAreaCSS: this.properties.iconAreaCSS,
        iconCSS: this.properties.iconCSS,
        userIconCSS: this.properties.userIconCSS,
        resourceTypeAreaCSS: this.properties.resourceTypeAreaCSS,
        bodyAreaCSS: this.properties.bodyAreaCSS,
        bodyAreaTitleCSS: this.properties.bodyAreaTitleCSS,
        bodyAreaHiddenLinkCSS: this.properties.bodyAreaHiddenLinkCSS,
        bodyAreaTextCSS: this.properties.bodyAreaTextCSS,
        bodyAreaText2CSS: this.properties.bodyAreaText2CSS,
        userAreaCSS: this.properties.userAreaCSS,
        resultRowCSS: this.properties.resultRowCSS,
        viewAllBottomCSS: this.properties.viewAllBottomCSS,
        viewAllButtonLabel: this.properties.viewAllButtonLabel,
      }
    );
  
    ReactDom.render(element, this.domElement);
    
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
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
  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      // Denote the address web part property as a dynamic property of type
      // object to allow the address information to be serialized by
      // the SharePoint Framework.
      'humanResourceFilter': {
        dynamicPropertyType: 'object'
      }
    } as IWebPartPropertiesMetadata;
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
                PropertyPaneTextField('numberOfCardsToDisplay', {
                  label: "Number of Cards to Display"
                }),
                //Property - Toggle View All selector 
                PropertyPaneToggle('toggleViewAll', {
                  //name of the toggle
                  label: "Toggle View All Selection"
                }),
                //Property - Toggle View All selector 
                PropertyPaneToggle('toggleViewAllBottom', {
                  //name of the toggle
                  label: "Toggle View All Bottom Selection"
                }),
                //Property - Toggle View All selector 
                PropertyPaneToggle('toggleResults', {
                   //name of the toggle
                   label: "Toggle Results Show/Hide"
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
                  label: "Background Image of Card Display Section (defaults to nothing):",
                }),
                PropertyFieldFilePicker('icon1Picker', {
                  context: this.context as any,
                  filePickerResult: this.properties.icon1PickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.icon1PickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.icon1PickerResult = e; },
                  key: "icon1PickerId",
                  buttonLabel: "Swap Icon 1 Here",
                  label: "Icon 1:",
                }),
                PropertyFieldFilePicker('icon2Picker', {
                  context: this.context as any,
                  filePickerResult: this.properties.icon2PickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.icon2PickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.icon2PickerResult = e; },
                  key: "icon2PickerId",
                  buttonLabel: "Swap Icon 2 Here",
                  label: "Icon 2:",
                }),
                PropertyFieldFilePicker('icon3Picker', {
                  context: this.context as any,
                  filePickerResult: this.properties.icon3PickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { console.log(e); this.properties.icon3PickerResult = e;  },
                  onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.icon3PickerResult = e; },
                  key: "icon3PickerId",
                  buttonLabel: "Swap Icon 3 Here",
                  label: "Icon 3:",
                }),
                //Code Editor block for Card CSS
                PropertyFieldCodeEditor('cardCSS', {
                  label: 'Edit CSS for the Card',
                  panelTitle: 'Edit CSS for the Card',
                  initialValue: this.properties.cardCSS,
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
                 PropertyFieldCodeEditor('topBarCSS', {
                  label: 'Edit CSS for the top bar of the card',
                  panelTitle: 'Edit CSS for the top bar of the card',
                  initialValue: this.properties.topBarCSS,
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
                 PropertyFieldCodeEditor('iconAreaCSS', {
                  label: 'Edit CSS for the icon area of the card',
                  panelTitle: 'Edit CSS for the icon area of the card',
                  initialValue: this.properties.iconAreaCSS,
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
                 PropertyFieldCodeEditor('iconCSS', {
                  label: 'Edit CSS for the icon image of the card',
                  panelTitle: 'Edit CSS for the icon image of the card',
                  initialValue: this.properties.iconCSS,
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
                 PropertyFieldCodeEditor('resourceTypeAreaCSS', {
                  label: 'Edit CSS for resource type area of the card',
                  panelTitle: 'Edit CSS for resource type area of the card',
                  initialValue: this.properties.resourceTypeAreaCSS,
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
                 PropertyFieldCodeEditor('bodyAreaCSS', {
                  label: 'Edit CSS for the body area of the card',
                  panelTitle: 'Edit CSS for the body area of the card',
                  initialValue: this.properties.bodyAreaCSS,
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
                 PropertyFieldCodeEditor('bodyAreaTitleCSS', {
                  label: 'Edit CSS for the body area title of the card',
                  panelTitle: 'Edit CSS for the body area title of the card',
                  initialValue: this.properties.bodyAreaTitleCSS,
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
                 PropertyFieldCodeEditor('bodyAreaHiddenLinkCSS', {
                  label: 'Edit CSS for the body area hidden link of the card',
                  panelTitle: 'Edit CSS for the body area hidden link of the card',
                  initialValue: this.properties.bodyAreaHiddenLinkCSS,
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
                 PropertyFieldCodeEditor('bodyAreaTextCSS', {
                  label: 'Edit CSS for the body area text of the card',
                  panelTitle: 'Edit CSS for the body area text of the card',
                  initialValue: this.properties.bodyAreaTextCSS,
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
                 PropertyFieldCodeEditor('bodyAreaText2CSS', {
                  label: 'Edit CSS for the body area text2 of the card',
                  panelTitle: 'Edit CSS for the body area text2 of the card',
                  initialValue: this.properties.bodyAreaText2CSS,
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
                 PropertyFieldCodeEditor('userAreaCSS', {
                  label: 'Edit CSS for the user area of the card',
                  panelTitle: 'Edit CSS for the user area of the card',
                  initialValue: this.properties.userAreaCSS,
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
                 PropertyFieldCodeEditor('userIconCSS', {
                  label: 'Edit CSS for the userIcon image of the card',
                  panelTitle: 'Edit CSS for the userIcon image of the card',
                  initialValue: this.properties.userIconCSS,
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
                 PropertyFieldCodeEditor('resultRowCSS', {
                  label: 'Edit CSS for the result row of the card',
                  panelTitle: 'Edit CSS for the result row of the card',
                  initialValue: this.properties.resultRowCSS,
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
                 PropertyFieldCodeEditor('viewAllButtonLabel', {
                  label: 'Edit view all button bottom label',
                  panelTitle: 'Edit view all button bottom label',
                  initialValue: this.properties.viewAllButtonLabel,
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
                 PropertyFieldCodeEditor('viewAllBottomCSS', {
                  label: 'Edit CSS for the view all bottom button of the card',
                  panelTitle: 'Edit CSS for the view all bottom button of the card',
                  initialValue: this.properties.viewAllBottomCSS,
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
              ]
            },
            // Web part properties group for specifying the information about
             // the address to show on the map.
             {
               // Primary group is used to provide the address to show on the map
               // in a text field in the web part properties
               primaryGroup: {
                 groupName: "Hello Text Group Name",
                 groupFields: [
                   PropertyPaneTextField('humanResourceFilter', {
                     label: "Hello Text"
                   })
                 ]
               },
               // Secondary group is used to retrieve the address from the
               // connected dynamic data source
               secondaryGroup: {
                 groupName: "Hello Text Group Name",
                 groupFields: [
                   PropertyPaneDynamicFieldSet({
                     label: 'Hello Text 1',
                     fields: [
                       PropertyPaneDynamicField('humanResourceFilter', {
                         label: "Hello Text2"
                       })
                     ],
                     sharedConfiguration: {
                       // because address and city come from the same data source
                       // the connection can share the selected dynamic property
                       depth: DynamicDataSharedDepth.Property
                     }
                   })
                 ]
               },
               // Show the secondary group only if the web part has been
               // connected to a dynamic data source
               showSecondaryGroup: !!this.properties.humanResourceFilter.tryGetSource()
             } as IPropertyPaneConditionalGroup  
          ]
        }
      ]
    };
  }
}

