var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FaqFullWidthWebPartStrings';
import FaqFullWidth from './components/FaqFullWidth';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldCodeEditor, PropertyFieldCodeEditorLanguages } from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';
var FaqFullWidthWebPart = /** @class */ (function (_super) {
    __extends(FaqFullWidthWebPart, _super);
    function FaqFullWidthWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isDarkTheme = false;
        _this._environmentMessage = '';
        return _this;
    }
    FaqFullWidthWebPart.prototype.render = function () {
        var element = React.createElement(FaqFullWidth, {
            description: this.properties.description,
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName,
            lists: this.properties.lists,
            listName: this.properties.lists.title,
            titleCSS: this.properties.titleCSS,
            spfxContext: this.context
        });
        ReactDom.render(element, this.domElement);
    };
    FaqFullWidthWebPart.prototype.onInit = function () {
        var _this = this;
        return this._getEnvironmentMessage().then(function (message) {
            _this._environmentMessage = message;
        });
    };
    FaqFullWidthWebPart.prototype._getEnvironmentMessage = function () {
        var _this = this;
        if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
            return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
                .then(function (context) {
                var environmentMessage = '';
                switch (context.app.host.name) {
                    case 'Office': // running in Office
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                        break;
                    case 'Outlook': // running in Outlook
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                        break;
                    case 'Teams': // running in Teams
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                        break;
                    default:
                        throw new Error('Unknown host');
                }
                return environmentMessage;
            });
        }
        return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    };
    FaqFullWidthWebPart.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        //console.log('onPropertyPaneFieldChanged');
        //console.log(propertyPath)
        //console.log(oldValue.Fields.Title)
        //console.log(newValue.Fields.Title)
        //on every change set the listName to the 'Select a list' title
        this.properties.listName = this.properties.lists.title;
    };
    FaqFullWidthWebPart.prototype.onThemeChanged = function (currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        var semanticColors = currentTheme.semanticColors;
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }
    };
    FaqFullWidthWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(FaqFullWidthWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    FaqFullWidthWebPart.prototype.getPropertyPaneConfiguration = function () {
        console.log(this.properties.listName);
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
                                //Property - Edit the CSS for title
                                PropertyFieldCodeEditor('titleCSS', {
                                    label: 'Edit CSS for the title',
                                    panelTitle: 'Edit CSS for the title',
                                    initialValue: this.properties.titleCSS,
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
                                PropertyFieldListPicker('lists', {
                                    label: 'Select a list',
                                    selectedList: this.properties.lists,
                                    includeHidden: false,
                                    orderBy: PropertyFieldListPickerOrderBy.Title,
                                    disabled: false,
                                    onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                                    properties: this.properties,
                                    context: this.context,
                                    onGetErrorMessage: null,
                                    deferredValidationTime: 0,
                                    key: 'listPickerFieldId',
                                    includeListTitleAndUrl: true,
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return FaqFullWidthWebPart;
}(BaseClientSideWebPart));
export default FaqFullWidthWebPart;
//# sourceMappingURL=FaqFullWidthWebPart.js.map