"use strict";(self.webpackChunkreact_number_format=self.webpackChunkreact_number_format||[]).push([[63],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>u});var r=a(7294);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,r,o=function(e,t){if(null==e)return{};var a,r,o={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var m=r.createContext({}),s=function(e){var t=r.useContext(m),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=s(e.components);return r.createElement(m.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,o=e.mdxType,n=e.originalType,m=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(a),u=o,g=d["".concat(m,".").concat(u)]||d[u]||c[u]||n;return a?r.createElement(g,i(i({ref:t},p),{},{components:a})):r.createElement(g,i({ref:t},p))}));function u(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=a.length,i=new Array(n);i[0]=d;var l={};for(var m in t)hasOwnProperty.call(t,m)&&(l[m]=t[m]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var s=2;s<n;s++)i[s]=a[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},6261:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>m,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>c});var r=a(7462),o=a(3366),n=(a(7294),a(3905)),i=["components"],l={title:"Numeric Format",sidebar_position:3},m="Props",s={unversionedId:"numeric_format",id:"numeric_format",title:"Numeric Format",description:"allowLeadingZeros boolean",source:"@site/docs/numeric_format.md",sourceDirName:".",slug:"/numeric_format",permalink:"/react-number-format/docs/numeric_format",editUrl:"https://github.com/s-yadav/react-number-format/docs/numeric_format.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Numeric Format",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Props",permalink:"/react-number-format/docs/props"},next:{title:"Pattern Format",permalink:"/react-number-format/docs/pattern_format"}},p={},c=[{value:"allowLeadingZeros <code>boolean</code>",id:"allowleadingzeros-boolean",level:3},{value:"allowNegative <code>boolean</code>",id:"allownegative-boolean",level:3},{value:"allowedDecimalSeparators <code>Array&lt;string&gt;</code>",id:"alloweddecimalseparators-arraystring",level:3},{value:"customInput <code>React.Component&lt;any&gt;</code>",id:"custominput-reactcomponentany",level:3},{value:"decimalScale <code>number</code>",id:"decimalscale-number",level:3},{value:"decimalSeparator <code>string</code>",id:"decimalseparator-string",level:3},{value:"fixedDecimalScale <code>boolean</code>",id:"fixeddecimalscale-boolean",level:3},{value:"prefix <code>string</code>",id:"prefix-string",level:3},{value:"suffix <code>string</code>",id:"suffix-string",level:3},{value:"thousandsGroupStyle <code>string</code>",id:"thousandsgroupstyle-string",level:3},{value:"Common Props",id:"common-props",level:3},{value:"Other exports",id:"other-exports",level:2},{value:"numericFormatter <code>(numString: string, props: NumericFormatProps) =&gt; string</code>",id:"numericformatter-numstring-string-props-numericformatprops--string",level:3},{value:"removeNumericFormat <code>(inputValue: string, changeMeta: ChangeMeta, props: NumericFormatProps) =&gt; string</code>",id:"removenumericformat-inputvalue-string-changemeta-changemeta-props-numericformatprops--string",level:3},{value:"getNumericCaretBoundary <code>(formattedValue: string, props: NumericFormatProps) =&gt; Array&lt;boolean&gt;</code>",id:"getnumericcaretboundary-formattedvalue-string-props-numericformatprops--arrayboolean",level:3},{value:"useNumericFormat: <code>(props: NumericFormatProps) =&gt; NumberFormatBaseProps</code>",id:"usenumericformat-props-numericformatprops--numberformatbaseprops",level:3}],d={toc:c};function u(e){var t=e.components,a=(0,o.Z)(e,i);return(0,n.kt)("wrapper",(0,r.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"props"},"Props"),(0,n.kt)("h3",{id:"allowleadingzeros-boolean"},"allowLeadingZeros ",(0,n.kt)("inlineCode",{parentName:"h3"},"boolean")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"false")),(0,n.kt)("p",null,"This allows enabling or disabling leading zeros in the input field. By default, on blur of an input, leading zeros are removed. To allow leading 0s in the input field, set ",(0,n.kt)("inlineCode",{parentName:"p"},"allowLeadingZeros")," to ",(0,n.kt)("inlineCode",{parentName:"p"},"true"),". This does not, however, control trailing zeros."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'import { NumericFormat } from \'react-number-format\';\n\n<NumericFormat value="20020220" allowLeadingZeros thousandSeparator="," />;\n')),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/allowleadingzeros-demo-ji97mv?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"allowLeadingZeros-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"allownegative-boolean"},"allowNegative ",(0,n.kt)("inlineCode",{parentName:"h3"},"boolean")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"true")),(0,n.kt)("p",null,"If set to ",(0,n.kt)("inlineCode",{parentName:"p"},"false"),", negative numbers will not be allowed"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value=\"-12\" allowNegative />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/allownegative-demo-dx8gdf?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"allowNegative-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"alloweddecimalseparators-arraystring"},"allowedDecimalSeparators ",(0,n.kt)("inlineCode",{parentName:"h3"},"Array<string>")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"undefined")),(0,n.kt)("p",null,"Characters which when pressed result in a decimal separator. When missing, decimal separator and '.' are used."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value=\"12\" allowedDecimalSeparators={['%']} />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/allownegative-demo-forked-3ufso6?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"allowNegative-demo (forked)",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"custominput-reactcomponentany"},"customInput ",(0,n.kt)("inlineCode",{parentName:"h3"},"React.Component<any>")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"null")),(0,n.kt)("p",null,"This allow supporting custom input components with number format."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\nimport { TextField } from '@mui/material';\n\n<NumericFormat value={12323} customInput={TextField} />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/custominput-demo-u3wg9m?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"customInput-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"decimalscale-number"},"decimalScale ",(0,n.kt)("inlineCode",{parentName:"h3"},"number")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"undefined")),(0,n.kt)("p",null,"If defined, it limits the number of digits after the decimal point."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value={12323.3334} decimalScale={3} />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/decimalscale-demo-uc92li?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"decimalScale-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"decimalseparator-string"},"decimalSeparator ",(0,n.kt)("inlineCode",{parentName:"h3"},"string")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": '.'"),(0,n.kt)("p",null,"Defines the decimal character."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value={12323.3333} decimalSeparator=\",\" />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/decimalseparator-demo-tv9ptw?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"decimalSeparator-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"fixeddecimalscale-boolean"},"fixedDecimalScale ",(0,n.kt)("inlineCode",{parentName:"h3"},"boolean")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"false")),(0,n.kt)("p",null,"If set to ",(0,n.kt)("inlineCode",{parentName:"p"},"true"),", it adds trailing 0s after ",(0,n.kt)("inlineCode",{parentName:"p"},"decimalSeparator")," to match given ",(0,n.kt)("inlineCode",{parentName:"p"},"decimalScale"),"."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value={12323.1} decimalScale={3} fixedDecimalScale />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/fixeddecimalscale-demo-3jnvz7?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"allowNegative-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"prefix-string"},"prefix ",(0,n.kt)("inlineCode",{parentName:"h3"},"string")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),":",(0,n.kt)("inlineCode",{parentName:"p"},"undefined")),(0,n.kt)("p",null,"Adds the prefix character before the input value."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value={1234} prefix={'$'} />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/prefix-demo-6ibo72?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"prefix-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"suffix-string"},"suffix ",(0,n.kt)("inlineCode",{parentName:"h3"},"string")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},"undefined")),(0,n.kt)("p",null,"Adds the suffix after the input value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { NumericFormat } from 'react-number-format';\n\n<NumericFormat value={123} suffix={'/ -'} />;\n")),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/suffice-demo-7tlerm?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"suffice-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"thousandsgroupstyle-string"},"thousandsGroupStyle ",(0,n.kt)("inlineCode",{parentName:"h3"},"string")),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"default"),": ",(0,n.kt)("inlineCode",{parentName:"p"},",")),(0,n.kt)("p",null,"Defines the thousand grouping style."),(0,n.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,n.kt)("div",{parentName:"div",className:"admonition-heading"},(0,n.kt)("h5",{parentName:"div"},(0,n.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,n.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,n.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,n.kt)("div",{parentName:"div",className:"admonition-content"},(0,n.kt)("p",{parentName:"div"},"Supported types. thousand style (thousand) : 123,456,789, indian style (lakh) : 12,34,56,789, chinese style (wan) : 1,2345,6789."))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'import { NumericFormat } from \'react-number-format\';\n\n<NumericFormat type="text" value={1231231} thousandsGroupStyle="lakh" thousandSeparator="," />;\n')),(0,n.kt)("details",null,(0,n.kt)("summary",null,"Demo"),(0,n.kt)("iframe",{src:"https://codesandbox.io/embed/thousandsgroupstyle-demo-u3ip59?fontsize=14&hidenavigation=1&theme=dark&view=preview",className:"csb",title:"thousandsGroupStyle-demo",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})),(0,n.kt)("h3",{id:"common-props"},"Common Props"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/props"},"See Common Props"))),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Other than this it accepts all the props which can be given to a input or span based on displayType you selected.")),(0,n.kt)("h2",{id:"other-exports"},"Other exports"),(0,n.kt)("p",null,"With v5.0 we expose some more utils/hooks which can be used for customization or other utilities"),(0,n.kt)("h3",{id:"numericformatter-numstring-string-props-numericformatprops--string"},"numericFormatter ",(0,n.kt)("inlineCode",{parentName:"h3"},"(numString: string, props: NumericFormatProps) => string")),(0,n.kt)("p",null,"In some places we need to just format the number before we pass it down as value, or in general just to render it. In such cases ",(0,n.kt)("inlineCode",{parentName:"p"},"numericFormatter")," can be used directly."),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Parameters")),(0,n.kt)("p",null,"1st. ",(0,n.kt)("inlineCode",{parentName:"p"},"numString"),"(non formatted number string)"),(0,n.kt)("p",null,"2nd. ",(0,n.kt)("inlineCode",{parentName:"p"},"props")," (the format props applicable on numeric format)"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Return"),"\n",(0,n.kt)("inlineCode",{parentName:"p"},"formattedString")," returns the formatted number."),(0,n.kt)("h3",{id:"removenumericformat-inputvalue-string-changemeta-changemeta-props-numericformatprops--string"},"removeNumericFormat ",(0,n.kt)("inlineCode",{parentName:"h3"},"(inputValue: string, changeMeta: ChangeMeta, props: NumericFormatProps) => string")),(0,n.kt)("p",null,"Most of the time you might not need this, but in some customization case you might wan't to write a patched version on top of removeNumericFormat."),(0,n.kt)("p",null,"However for customization case its recommended to use ",(0,n.kt)("inlineCode",{parentName:"p"},"useNumericFormat")," and patch the methods it returns, as lot of other handling is done in the hook."),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Parameters")),(0,n.kt)("p",null,"1st. ",(0,n.kt)("inlineCode",{parentName:"p"},"inputValue"),": the value after user has typed, this will be formatted value with the additional character typed by user."),(0,n.kt)("p",null,"2nd. ",(0,n.kt)("inlineCode",{parentName:"p"},"changeMeta"),": This is the change information rnf sends internally, its basically the change information from the last formatted value and the current typed input value."),(0,n.kt)("p",null,"The type is following"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"{\n  from: {start: number, end: number},\n  to: {start: number, end: number},\n  lastValue: string\n}\n")),(0,n.kt)("p",null,"3rd. ",(0,n.kt)("inlineCode",{parentName:"p"},"props"),": all the numeric format props"),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Return"),"\n",(0,n.kt)("inlineCode",{parentName:"p"},"numString")," returns the number in string format."),(0,n.kt)("h3",{id:"getnumericcaretboundary-formattedvalue-string-props-numericformatprops--arrayboolean"},"getNumericCaretBoundary ",(0,n.kt)("inlineCode",{parentName:"h3"},"(formattedValue: string, props: NumericFormatProps) => Array<boolean>")),(0,n.kt)("p",null,"This method returns information about what all position in formatted value where caret can be places, it returns n+1 length array of booleans(where n is the length of formattedValue)."),(0,n.kt)("p",null,"Most of time you don't need this, but in case if you very specific usecase you can patch the function to handle your case."),(0,n.kt)("p",null,"See more details on ",(0,n.kt)("a",{parentName:"p",href:"https://s-yadav.github.io/react-number-format/docs/customization/#concept"},"Concept")),(0,n.kt)("h3",{id:"usenumericformat-props-numericformatprops--numberformatbaseprops"},"useNumericFormat: ",(0,n.kt)("inlineCode",{parentName:"h3"},"(props: NumericFormatProps) => NumberFormatBaseProps")),(0,n.kt)("p",null,"The whole numeric format logic is inside useNumericFormat hook, this returns all the required props which can be passed to ",(0,n.kt)("inlineCode",{parentName:"p"},"NumberFormatBase"),". For customization you can use to patch methods returned by ",(0,n.kt)("inlineCode",{parentName:"p"},"useNumericFormat")," and pass to ",(0,n.kt)("inlineCode",{parentName:"p"},"NumberFormatBase"),"."),(0,n.kt)("p",null,"See more details in ",(0,n.kt)("a",{parentName:"p",href:"https://s-yadav.github.io/react-number-format/docs/customization/"},"Customization")))}u.isMDXComponent=!0}}]);