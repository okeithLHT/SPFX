import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPropertyFieldList } from "@pnp/spfx-property-controls";
export interface IFaqFullWidthProps {
    description: string;
    lists: IPropertyFieldList;
    listName: string;
    titleCSS: string;
    isDarkTheme: boolean;
    environmentMessage: string;
    hasTeamsContext: boolean;
    userDisplayName: string;
    spfxContext: WebPartContext;
}
//# sourceMappingURL=IFaqFullWidthProps.d.ts.map