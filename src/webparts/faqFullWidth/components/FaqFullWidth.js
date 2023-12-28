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
import styles from './FaqFullWidth.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
var FaqFullWidth = /** @class */ (function (_super) {
    __extends(FaqFullWidth, _super);
    function FaqFullWidth(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            titleCSS: _this.props.titleCSS,
            listName: _this.props.lists.title,
            listItems: []
        };
        return _this;
    }
    FaqFullWidth.prototype.componentDidMount = function () {
        console.log('did mount');
        this._getListItems(this.state.listName);
    };
    FaqFullWidth.prototype._getListItems = function (listName) {
        var _this = this;
        //lookup/Title&$expand=lookup
        console.log(this.props.lists.title);
        var url = "".concat(this.props.spfxContext.pageContext.web.absoluteUrl, "/_api/web/lists/GetByTitle('").concat(listName, "')/items?$select=Title,Answer");
        console.log(listName);
        //need to ask Pete how he populated this locally
        //const url: string = `${this.props.spfxContext.pageContext.web.absoluteUrl}/sites/GentivaIntegrationGateway/_api/web/lists/GetByTitle('${listName}')/items?$select=Title,Answer`;
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
    FaqFullWidth.prototype.render = function () {
        var _a = this.props, description = _a.description, hasTeamsContext = _a.hasTeamsContext;
        //converts string of CSS into a useable style
        function inlineStylesToObject(styles) {
            var regex = /([\w-]+)\s*:\s*((?:(?:"[^"]+")|(?:'[^']+')|[^;])*);?/g;
            var obj = {};
            var match;
            while (match = regex.exec(styles)) {
                obj[match[1]] = match[2].trim();
            }
            return obj;
        }
        //
        //i should probably not be setting this 'dangerously' but it works
        var dynamicFAQs = this.state.listItems.map(function (faq, i) {
            return (React.createElement("div", { className: styles.faqItem },
                React.createElement("details", null,
                    React.createElement("summary", { className: styles.faqHeader },
                        React.createElement("div", null, faq.Title),
                        React.createElement("div", { className: styles.marker })),
                    React.createElement("hr", null),
                    React.createElement("p", { className: styles.faqAnswer, dangerouslySetInnerHTML: { __html: faq.Answer } })),
                React.createElement("hr", null)));
        });
        return (React.createElement("section", { className: "".concat(styles.faqFullWidth, " ").concat(hasTeamsContext ? styles.teams : '') },
            React.createElement("div", { style: inlineStylesToObject(this.props.titleCSS) }, escape(description)),
            React.createElement("div", null, dynamicFAQs)));
    };
    return FaqFullWidth;
}(React.Component));
export default FaqFullWidth;
//# sourceMappingURL=FaqFullWidth.js.map