import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { IPropertyFieldList } from "@pnp/spfx-property-controls";
export interface IFaqFullWidthWebPartProps {
    description: string;
    lists: IPropertyFieldList;
    listName: string;
    titleCSS: string;
}
export default class FaqFullWidthWebPart extends BaseClientSideWebPart<IFaqFullWidthWebPartProps> {
    private _isDarkTheme;
    private _environmentMessage;
    render(): void;
    protected onInit(): Promise<void>;
    private _getEnvironmentMessage;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=FaqFullWidthWebPart.d.ts.map