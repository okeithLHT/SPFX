import * as React from 'react';
import { IResourceQuickLinkProps } from './IResourceQuickLinkProps';
export interface IMyListComponentState {
    listName: string;
    listItems: any[];
}
export default class ResourceQuickLink extends React.Component<IResourceQuickLinkProps, IMyListComponentState> {
    constructor(props: IResourceQuickLinkProps);
    componentDidMount(): void;
    private _getListItems;
    render(): React.ReactElement<IResourceQuickLinkProps>;
}
//# sourceMappingURL=ResourceQuickLink.d.ts.map