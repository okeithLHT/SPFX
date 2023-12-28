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
import styles from './ResourceQuickLink.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
var ResourceQuickLink = /** @class */ (function (_super) {
    __extends(ResourceQuickLink, _super);
    function ResourceQuickLink(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            listName: ((props.listName.trim() != '') ? props.listName : "Payroll_Resources"),
            listItems: []
        };
        return _this;
    }
    ResourceQuickLink.prototype.componentDidMount = function () {
        console.log('did mount');
        this._getListItems(this.state.listName);
    };
    ResourceQuickLink.prototype._getListItems = function (listName) {
        var _this = this;
        //lookup/Title&$expand=lookup
        var url = "".concat(this.props.spfxContext.pageContext.web.absoluteUrl, "/_api/web/lists/GetByTitle('").concat(listName, "')/items?$select=Title,ResourceType,ResourceTypeDescription,ResourceLink");
        console.log(url);
        this.props.spfxContext.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json().then(function (responseJSON) {
                    console.log(responseJSON.value);
                    _this.setState({
                        listItems: responseJSON.value
                    });
                });
            }
            else {
                console.log("".concat(response.status, ": ").concat(response.statusText));
            }
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    ResourceQuickLink.prototype.render = function () {
        var _a = this.props, description = _a.description, hasTeamsContext = _a.hasTeamsContext;
        var ImageLookupEnum;
        (function (ImageLookupEnum) {
            ImageLookupEnum["JobAid"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAACXBIWXMAAAsSAAALEgHS3X78AAACKklEQVRoge2aP26DMBTGv0QdKzV7h+YGjdQLtOIC4QShM0u6MEJhZGkW5iYnIBeI2g4dK5EbZOjQMZW6p3qRHTmIEv46LuEnISQw+H02fvbzo7PZbNAUuo1R0opRmEaJOfvrxsLSb+WakplI88N1UuE9b7aw9B6ACYCRagpiLAGMNT98FS/vxDAhdPMawAzAHEBiCxyZIQADwAWAe80Pp0lipqxH9gqoiNDwfTr4Z9cVeoWEzFQXQjDjx6x3hvw692YDdp4fx7z8COOlzx+Ou2YVx0hmTmOeIUzXM8RuLMA0cOxV3SI4qWIAPFdQx2MF78jEITGEGzh2boNM15MeW2QRUwmm6/WYOy1KFDh2qreVJoaNPT43FGF2aOqQJiZw7AhAr8462nhGVU5n0qwS0/VoQRiWeOUycOxBWgGZ3owWhm6J56NDBWR6s3Xdq4HWAaiKtM+MRbOlljOaH7bLGRHDdL3Se2iaHx59OUOtUTS4emPuWBqpPRM4tiHTmLK0rllV4mJqHaB1w8Xwdc/wOGbkR8hS7Pb6tmLYdid5rtHC0pUf9EK24pu2s/j1eBaAeujq32cB0KT8TJycmTMKmp4APGSJOxgGa7S7HPUQK80PEyfySv4DYMJfyLB4a6U8Q7GNo/lhp7QBjHbSVJVGiSk0ZhaWPhGybcQ5gBvmZbK6c4pvLgG8J9yjQCx3IFdVcPYD4IOds/IJ4Kui+re0fzWpSitGVZojBsAvr7OuwCjTi8QAAAAASUVORK5CYII=";
            ImageLookupEnum["Guide"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAACXBIWXMAAAsSAAALEgHS3X78AAAB90lEQVRoge2asU6DUBSG/xofoJuJi7yBPoKGOFuewDqz6MIIwsjUhc3BN6B9AJK6ODNq4mAHE8f2CWpuctSmkQsc7sXb5n5Jw9Cecr4Qzjn3wmC9XmNfONgbEwCHXYKLwBsCeAFwpC6lWu7cNJ/89SO2DInMSeQDwIO29H8ZAxgBUCezIXIK4BXAp5vm92rylZ73XPZ963tmS+RGiHTKUCGtZLZF3DR/NEUEbWRMF0FTmV0QQROZXRFBncwuiUBWmovAOwHwDOAYwAyAUwTeX+XXAfCuN81myPrMJYkIruhTxdwAF6nMGx0v3DQ3Itk69mrQtFOzHydi2MvVp/PDLIvCUdsg7tR8RseYGS9DTMZDTmCn9UwWhconZT9OpJOxDFsATMVWs2/8ONHRTEVxKTmB3CsjTvbEjG3y3ywZ1pXJonAKYMqJ1YktAKbSqQBsUgReSYu4rqzcNO9/AtjiFgC7e2/AuvmhUobWPP+67rH3TBF4Dk23OlhWbYxrkaEuHWmSWVRtjNfBknHTXDTMQZeMdWCbpqmYuAewyKLQ4QRyC0Cpaf0vWHIDuVOz2I7V/qSsLfae8eNkSLOYDkpaL/UjQ91fV9Ncoc99sywKJ9wurRPbNE3FyphKkwIwrnvNo0ekz09lMksqk9eGXYjKycO+PGckAL4AEIeAnxhUy+UAAAAASUVORK5CYII=";
            ImageLookupEnum["MicroLearning"] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAACXBIWXMAAAsSAAALEgHS3X78AAAC2UlEQVRoge1ZMY7aQBR9iTZply3SRVqkHCCbE4QVB0h8gpB6iuw2lDbjkiZs4TrkBGYPgJacIOQAkVgpXRrSZguij94gY1iEYWbsIF4DtmE8b/789//8/2Q2m+FQ8PRgmAA4yV4M28EVgPflTacQBgD6zW46NX9akBm2gxGAtwD+ABhXnMgF59ri9znmPjNsB3LjO4k0mt200mQ4X1n8UwCXzW4q3xc+U+Nnq+pEBJxjK38/LwDT/A8qjJW5HpSaHck8BqXjmtJxw+oMC8C2ZcQp75SOR0rHF1v83ipskzGqOJd6peOeWOt/JWMgZG4BfJIArHTsJatwQiaJwkkShUIg4K1U6XigdFx38T4Dp2qWROGAVroB8I5W6rh6n3NpTqJwmkShJLBvmPNFSsdjF6rnLc4kUThOolAIXAOoU/WsCoT3oJlEYY9kjEBMlI5X8qxdUEoGwK0nAnHJzPeLDcUrLZ1hUO3x8htT+r1wsu8AO5AQH+lwi8n56Zpbb294JUMF6wM4p89cSUyyNb4XMmusETAGWYVzMmus0RIBcPEuZ2R8WSMLJ2R8WiMLV5a582WNLGzHGbP6Yo26TyJwYBnZWiPJwyyPuxWskqFflFZ3O1Znqoo8Ge8VlT2wcg4yZEx+9HnYDqycLVyChfM+X7GIX4vO2bAdyMMPVSeSw9dmN10s/lIbkFZxWkGxiEmzm/azwx17mlXF4TZofYMVzg6bwqdMTiWf6+xyAi3NZ1jQMH3JW6ZBdSrqvLdaNMcrk8yEgW9p0hmSYOa99TmoFJ9hjeycBY2l1ed1ixYrVEszrfMaI6qXXsqP5y/rP5+9EDJnj6280vHs1cPv+9d/f23ynSk75PMxSlUz20fpUnyG2ywF8DGJwv6a5w0evQsVCMuqNYv83kt5Nt/7ZFWnR0VbIboJVZBmcNJT+qxx/rVW24RSczMS6rCrZiBFdAmahQvpx0SzkgDwD3pMH38GZYdeAAAAAElFTkSuQmCC";
        })(ImageLookupEnum || (ImageLookupEnum = {}));
        var dynamicResources = this.state.listItems.map(function (r, i) {
            return (React.createElement("div", { className: styles.docLink },
                React.createElement("div", { className: styles.icon },
                    React.createElement("img", { src: ImageLookupEnum[r.ResourceType] })),
                React.createElement("div", { className: styles.rightText },
                    React.createElement("a", { className: styles.name, href: r.ResourceLink.Url }, r.Title),
                    React.createElement("div", { className: styles.resourceType }, r.ResourceTypeDescription))));
        });
        return (React.createElement("section", { className: "".concat(styles.resourceQuickLink, " ").concat(hasTeamsContext ? styles.teams : '') },
            React.createElement("div", { className: styles.resourcesTitle }, escape(description)),
            React.createElement("div", { className: styles.docLinks }, dynamicResources)));
    };
    return ResourceQuickLink;
}(React.Component));
export default ResourceQuickLink;
//# sourceMappingURL=ResourceQuickLink.js.map