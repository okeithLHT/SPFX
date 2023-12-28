import * as React from 'react';
import { IFaqFullWidthProps } from './IFaqFullWidthProps';
export interface IMyListComponentState {
    listName: string;
    listItems: any[];
    titleCSS: string;
}
export default class FaqFullWidth extends React.Component<IFaqFullWidthProps, IMyListComponentState> {
    constructor(props: IFaqFullWidthProps);
    componentDidMount(): void;
    private _getListItems;
    render(): React.ReactElement<IFaqFullWidthProps>;
}
//# sourceMappingURL=FaqFullWidth.d.ts.map