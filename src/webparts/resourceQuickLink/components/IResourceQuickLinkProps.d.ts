import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IResourceQuickLinkProps {
    description: string;
    isDarkTheme: boolean;
    environmentMessage: string;
    hasTeamsContext: boolean;
    userDisplayName: string;
    lists: string | string[];
    listName: string;
    spfxContext: WebPartContext;
}
//# sourceMappingURL=IResourceQuickLinkProps.d.ts.map