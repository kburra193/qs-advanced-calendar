var qlik = window.require("qlik");
var lastXDays = "Last 30 days";
var labelName = ["Select date range", "Select date"];
var viewModes = {
  day: {
    duration: "days",
    dayFormat: [
      {
        label: "YYYY/MM/DD",
        value: "YYYY/MM/DD",
      },
      {
        label: "YYYY.MM.DD",
        value: "YYYY.MM.DD",
      },
      {
        label: "YYYY-MM-DD",
        value: "YYYY-MM-DD",
      },
      {
        label: "YYYY/DD/MM",
        value: "YYYY/DD/MM",
      },
      {
        label: "YYYY.DD.MM",
        value: "YYYY.DD.MM",
      },
      {
        label: "YYYY-DD-MM",
        value: "YYYY-DD-MM",
      },

      {
        label: "MM/DD/YYYY",
        value: "MM/DD/YYYY",
      },
      {
        label: "MM.DD.YYYY",
        value: "MM.DD.YYYY",
      },
      {
        label: "MM-DD-YYYY",
        value: "MM-DD-YYYY",
      },
      {
        label: "DD/MM/YYYY",
        value: "DD/MM/YYYY",
      },
      {
        label: "DD.MM.YYYY",
        value: "DD.MM.YYYY",
      },
      {
        label: "DD-MM-YYYY",
        value: "DD-MM-YYYY",
      },
    ],
    defaultFormat: "YYYY/MM/DD",
    cellFormat: "D",
  },
  month: {
    duration: "months",
    monthYearFormat: [
      {
        label: "YYYY/MMM",
        value: "YYYY/MMM",
      },
      {
        label: "YYYY.MMM",
        value: "YYYY.MMM",
      },
      {
        label: "YYYY-MMM",
        value: "YYYY-MMM",
      },
      {
        label: "YYYY,MMM",
        value: "YYYY,MMM",
      },
      {
        label: "YYYY/MMMM",
        value: "YYYY/MMMM",
      },
      {
        label: "YYYY.MMMM",
        value: "YYYY.MMMM",
      },
      {
        label: "YYYY-MMMM",
        value: "YYYY-MMMM",
      },
      {
        label: "YYYY,MMMM",
        value: "YYYY,MMMM",
      },
      {
        label: "MMM/YYYY",
        value: "MMM/YYYY",
      },
      {
        label: "MMM.YYYY",
        value: "MMM.YYYY",
      },
      {
        label: "MMM-YYYY",
        value: "MMM-YYYY",
      },
      {
        label: "MMM,YYYY",
        value: "MMM,YYYY",
      },
      {
        label: "MMMM/YYYY",
        value: "MMMM/YYYY",
      },
      {
        label: "MMMM.YYYY",
        value: "MMMM.YYYY",
      },
      {
        label: "MMMM-YYYY",
        value: "MMMM-YYYY",
      },
      {
        label: "MMMM,YYYY",
        value: "MMMM,YYYY",
      },
    ],
    defaultFormat: "YYYY/MMM",
    cellFormat:  "MMM"  
  },
};
export default {
  type: "items",
  component: "accordion",
  items: {
    dimension: {
      type: "items",
      label: "Field",
      min: 1,
      max: 1,
      items: {
        field: {
          type: "string",
          ref: "qListObjectDef.qDef.qFieldDefs.0",
          label: "Date field",
          component: "dropdown",
          options: function () {
            return qlik
              .currApp()
              .createGenericObject({ qFieldListDef: { qType: "variable" } })
              .then(function (reply) {
                return reply.layout.qFieldList.qItems
                  .filter(function (item) {
                    return item.qTags && item.qTags.indexOf("$date") > -1;
                  })
                  .map(function (item) {
                    return { value: item.qName, label: item.qName };
                  });
              });
          },
          show: function (data) {
            return !data.advanced;
          },
          change: function (data) {
            var field = data.qListObjectDef.qDef.qFieldDefs[0];
            (data.props.minDate = {
              qStringExpression: "=Min( {1} [" + field + "])",
            }),
              (data.props.maxDate = {
                qStringExpression: "=Max( {1} [" + field + "])",
              }),
              (data.props.startDate = {
                qStringExpression: "=Min([" + field + "])",
              }),
              (data.props.endDate = {
                qStringExpression: "=Max([" + field + "])",
              });
          },
        },
        fieldAdvanced: {
          type: "string",
          ref: "qListObjectDef.qDef.qFieldDefs.0",
          label: "Date field",
          expression: "always",
          expressionType: "dimension",
          show: function (data) {
            return data.advanced;
          },
        },
        SingleDateSwitch: {
          type: "boolean",
          component: "switch",
          label: "Single date / interval",
          ref: "props.isSingleDate",
          options: [
            { value: !0, label: "Single date" },
            { value: !1, label: "Date interval" },
          ],
          defaultValue: !1,
        },
        CustomLabelSwitch: {
          type: "boolean",
          component: "switch",
          label: "Custom Label",
          ref: "props.customLabelSwitch",
          options: [
            { value: !0, translation: "properties.on" },
            { value: !1, translation: "properties.off" },
          ],
          defaultValue: !1,
        },
        CustomLabel: {
          ref: "props.customLabel",
          label: "Enter to change Label",
          type: "string",
          expression: "optional",
          show: function (data) {
            return data.props.customLabelSwitch;
          },
        },
        viewModeSwitch: {
          type: "boolean",
          component: "switch",
          label: "Day / Month",
          ref: "props.isDay",
          options: [
            { value: !0, label: "Month" },
            { value: !1, label: "Day" },
          ],
          defaultValue: !1,
        },
        dayFormatType: {
          ref: "props.dayFormat",
          label: "Format Type Select",
          component: "dropdown",
          type: "string",
          options: viewModes.day.dayFormat,
          defaultValue: viewModes.day.dayFormat[0][0],
          show: function (e) {
            return !e.props.isDay && e.props.dayFormat;
          },
        },
        monthFormatType: {
          ref: "props.monthFormat",
          label: "Format Type Select",
          component: "dropdown",
          type: "string",
          options: viewModes.month.monthYearFormat,
          defaultValue: viewModes.month.monthYearFormat[0][0],
          show: function (e) {
            return e.props.isDay && e.props.monthFormat;
          },
        },
        linkedCalendarsSwitch: {
          type: "boolean",
          component: "switch",
          label: "Link Calendars?",
          ref: "props.linkedCalendars",
          options: [
            { value: false, label: "Unlink" },
            { value: true, label: "link" },
          ],
          defaultValue: false,
        },
        Separator: {
          type: "string",
          ref: "props.separator",
          label: "Separator",
          defaultValue: "-",
          expression: "optional",
        },
        defaultText: {
          ref: "props.defaultText",
          defaultValue: labelName,
        },
        advanced: {
          type: "boolean",
          component: "switch",
          label: "Advanced setup",
          ref: "advanced",
          options: [
            { value: !0, translation: "properties.on" },
            { value: !1, translation: "properties.off" },
          ],
          defaultValue: !1,
          show: function (data) {
            return (
              data.qListObjectDef.qDef.qFieldDefs.length > 0 &&
              data.qListObjectDef.qDef.qFieldDefs[0].length > 0
            );
          },
        },
        minDate: {
          ref: "props.minDate",
          label: "Min date",
          type: "string",
          expression: "optional",
          show: function (data) {
            return data.advanced;
          },
        },
        maxDate: {
          ref: "props.maxDate",
          label: "Max date",
          type: "string",
          expression: "optional",
          show: function (data) {
            return data.advanced;
          },
        },
        startDate: {
          ref: "props.startDate",
          label: "Start date",
          type: "string",
          expression: "optional",
          show: function (data) {
            return data.advanced;
          },
        },
        endDate: {
          ref: "props.endDate",
          label: "End date",
          type: "string",
          expression: "optional",
          show: function (data) {
            return data.advanced;
          },
        },
      },
    },
    appearance: {
      uses: "settings",
      items: {
        dropdownStyling: {
          type: "items",
          label: "Dropdown Styling",
          items: {
            aboutdropdownSettings: {
              component: "text",
              label: `Dropdown styling for Calendar:`,
            },
            dropdownWidth: {
              type: "number",
              component: "slider",
              label: "Width (px)",
              ref: "props.dropdownWidth",
              min: 30,
              max: 100,
              step: 10,
              defaultValue: 100,
              show: function (e) {
                return e.props.dropdownWidth;
              },
            },
            dropdownfontSize: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.dropdownfontSize",
              min: 0,
              max: 20,
              step: 1,
              defaultValue: 14,
              show: function (e) {
                return e.props.dropdownfontSize;
              },
            },
            dropdownfontColor: {
              label: "Font Color",
              ref: "props.dropdownfontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#595959",
              },
              show: function (e) {
                return e.props.dropdownfontColor;
              },
            },
            dropdownBgColor: {
              label: "Background Color",
              ref: "props.dropdownBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.dropdownBgColor;
              },
            },
            dropdownborderType: {
              ref: "props.dropdownborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "solid",
            },
            dropdownborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.dropdownborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
            dropdownborderColor: {
              label: "Border Color",
              ref: "props.dropdownborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
            },
            dropdownborderRadius: {
              type: "number",
              component: "slider",
              label: "Border Radius (px)",
              ref: "props.dropdownborderRadius",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
              show: function (e) {
                return e.props.dropdownBorder;
              },
            },
          },
        },
        headerStyling: {
          type: "items",
          label: "Header Styling",
          items: {
            aboutheaderSettings: {
              component: "text",
              label: `Header styling for Calendar:`,
            },
            headerWidth: {
              type: "number",
              component: "slider",
              label: "Width (px)",
              ref: "props.headerWidth",
              min: 0,
              max: 80,
              step: 1,
              defaultValue: 54,
              show: function (e) {
                return e.props.headerWidth;
              },
            },
            headerHeight: {
              type: "number",
              component: "slider",
              label: "Height (px)",
              ref: "props.headerHeight",
              min: 0,
              max: 80,
              step: 1,
              defaultValue:40,
              show: function (e) {
                return e.props.headerHeight;
              },
            },
            headerfontSize: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.headerfontSize",
              min: 0,
              max: 18,
              step: 1,
              defaultValue: 12,
              show: function (e) {
                return e.props.headerfontSize;
              },
            },
            headerfontColor: {
              label: "Font Color",
              ref: "props.headerfontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#4b4b4b",
              },
              show: function (e) {
                return e.props.headerfontColor;
              },
            },
            headerFontStyle: {
              ref: "props.headerfontStyle",
              translation: "Font Style",
              type: "string",
              component: "dropdown",
              options: [
                {
                  value: "normal",
                  label: "Normal",
                },
                {
                  value: "bold",
                  label: "Bold",
                },
                {
                  value: "italic",
                  label: "Italic",
                },
                {
                  value: "underline",
                  label: "Underline",
                },
              ],
              defaultValue: "italic",
            },
            headerBgColor: {
              label: "Background Color",
              ref: "props.headerBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#f2f2f2",
              },
              show: function (e) {
                return e.props.headerBgColor;
              },
            },
            headerborderType: {
              ref: "props.headerborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "solid",
            },
            headerborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.headerborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
             headerborderColor: {
              label: "Border Color",
              ref: "props.headerborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
            },
            headerborderRadius: {
              type: "number",
              component: "slider",
              label: "Border Radius (px)",
              ref: "props.headerborderRadius",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
          },
        },
        cellStyling: {
          type: "items",
          label: "Cell Styling",
          items: {
            aboutcellSettings: {
              component: "text",
              label: `Cell level styling for Calendar:`,
            },
            cellHeight: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.cellHeight",
              min: 0,
              max: 100,
              step: 1,
              defaultValue: 45,
              show: function (e) {
                return e.props.cellHeight;
              },
            },
            cellfontSize: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.cellfontSize",
              min: 0,
              max: 18,
              step: 1,
              defaultValue: 12,
              show: function (e) {
                return e.props.cellfontSize;
              },
            },
            cellborderType: {
              ref: "props.cellborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "solid",
            },
            cellborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.cellborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
            cellborderColor: {
              label: "Border Color",
              ref: "props.cellborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
            },
            cellborderRadius: {
              type: "number",
              component: "slider",
              label: "Border Radius (px)",
              ref: "props.cellborderRadius",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
          },
        },
        additionalcolorStyling: {
          type: "items",
          label: "Cell Color Styling",
          items: {
            aboutcolorSettings: {
              component: "text",
              label: `Color styling for different states:`,
            },
            possibleBgColor: {
              label: "Possible Bg Color",
              ref: "props.possibleBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#DDDDDD",
              },
              show: function (e) {
                return e.props.possibleBgColor;
              },
            },
            possiblefontColor: {
              label: "Possible Font Color",
              ref: "props.possiblefontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#333333",
              },
              show: function (e) {
                return e.props.possiblefontColor;
              },
            },
            selectedBgColor: {
              label: "Selected Bg Color",
              ref: "props.selectedBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#4D9648",
              },
              show: function (e) {
                return e.props.selectedBgColor;
              },
            },
            selectedfontColor: {
              label: "Selected Font Color",
              ref: "props.selectedfontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.selectedfontColor;
              },
            },
            alternateBgColor: {
              label: "Alternate Bg Color",
              ref: "props.alternateBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
              show: function (e) {
                return e.props.alternateBgColor;
              },
            },
            alternatefontColor: {
              label: "Alternate Font Color",
              ref: "props.alternatefontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#595959",
              },
              show: function (e) {
                return e.props.alternatefontColor;
              },
            },
            excludedBgColor: {
              label: "Excluded Bg Color",
              ref: "props.excludedBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#a9a9a9",
              },
              show: function (e) {
                return e.props.excludedBgColor;
              },
            },
            excludedFontColor: {
              label: "Excluded Font Color",
              ref: "props.excludedFontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.excludedFontColor;
              },
            },
          },
        },
        CalendarStyling: {
          type: "items",
          label: "Calendar Styling",
          items: {
            aboutcellSettings: {
              component: "text",
              label: `Styling for Calendar:`,
            },
            BgColor: {
              label: "Background Color",
              ref: "props.CalendarBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.CalendarBgColor;
              },
            },
            calendarborderType: {
              ref: "props.calendarborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "solid",
            },
            calendarborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.calendarborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
            calendarborderColor: {
              label: "Border Color",
              ref: "props.calendarborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
            },
            calendarborderColor: {
              label: "Border Color",
              ref: "props.calendarborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
            },
          },
        },
        rangesStyling: {
          type: "items",
          label: "Ranges Styling",
          items: {
            aboutrangesSettings: {
              component: "text",
              label: `Ranges styling for Calendar:`,
            },

            rangesfontSize: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.rangesfontSize",
              min: 0,
              max: 20,
              step: 1,
              defaultValue: 13,
              show: function (e) {
                return e.props.rangesfontSize;
              },
            },
            rangesfontWeight: {
              component: "ranges",
              label: "Font Weight (px)",
              ref: "props.fontWeight",
              type: "string",
              options: [
                {
                  label: "100",
                  value: "100",
                },
                {
                  label: "200",
                  value: "200",
                },
                {
                  label: "300",
                  value: "300",
                },
                {
                  label: "400",
                  value: "400",
                },
                {
                  label: "500",
                  value: "500",
                },
                {
                  label: "600",
                  value: "600",
                },
                {
                  label: "700",
                  value: "700",
                },
                {
                  label: "Bold",
                  value: "bold",
                },
                {
                  label: "Bolder",
                  value: "bolder",
                },
                {
                  label: "Lighter",
                  value: "lighter",
                },
                {
                  label: "Normal",
                  value: "normal",
                },
              ],
              defaultValue: "700",
              show: function (e) {
                return e.props.fontWeight;
              },
            },
            rangesfontColor: {
              label: "Font Color",
              ref: "props.rangesfontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#595959",
              },
              show: function (e) {
                return e.props.rangesfontColor;
              },
            },
            rangesBgColor: {
              label: "Background Color",
              ref: "props.rangesBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.rangesBgColor;
              },
            },
            rangesborderType: {
              ref: "props.rangesborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "none",
            },
            rangesborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.rangesborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
            rangesborderColor: {
              label: "Border Color",
              ref: "props.rangesborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
            },
            rangesborderRadius: {
              type: "number",
              component: "slider",
              label: "Border Radius (px)",
              ref: "props.rangesborderRadius",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
            },
          },
        },
        footerStyling: {
          type: "items",
          label: "Footer Styling",
          items: {
            aboutrangesSettings: {
              component: "text",
              label: `Footer styling for Calendar:`,
            },

            footerfontSize: {
              type: "number",
              component: "slider",
              label: "Font Size (px)",
              ref: "props.footerfontSize",
              min: 0,
              max: 20,
              step: 1,
              defaultValue: 13,
              show: function (e) {
                return e.props.footerfontSize;
              },
            },
            footerfontColor: {
              label: "Font Color",
              ref: "props.footerfontColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#595959",
              },
              show: function (e) {
                return e.props.footerfontColor;
              },
            },
            footerBgColor: {
              label: "Background Color",
              ref: "props.footerBgColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#fff",
              },
              show: function (e) {
                return e.props.footerBgColor;
              },
            },
            footerBorder: {
              type: "boolean",
              component: "switch",
              label: "Border",
              ref: "props.footerBorder",
              options: [
                {
                  value: true,
                  label: "Enabled",
                },
                {
                  value: false,
                  label: "Disabled",
                },
              ],
              defaultValue: true,
            },
            footerborderType: {
              ref: "props.footerborderType",
              label: "Border Type Select",
              component: "dropdown",
              type: "string",
              options: [
                {
                  label: "Solid",
                  value: "solid",
                },
                {
                  label: "Dotted",
                  value: "dotted",
                },
                {
                  label: "Dashed",
                  value: "dashed",
                },
                {
                  label: "Double",
                  value: "double",
                },
                {
                  label: "None",
                  value: "none",
                },
              ],
              defaultValue: "solid",
              show: function (e) {
                return e.props.footerBorder;
              },
            },
            footerborderWidth: {
              type: "number",
              component: "slider",
              label: "Border Width (px)",
              ref: "props.footerborderWidth",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
              show: function (e) {
                return e.props.footerBorder;
              },
            },
            footerborderColor: {
              label: "Border Color",
              ref: "props.footerborderColor",
              component: "color-picker",
              type: "object",
              defaultValue: {
                color: "#ddd",
              },
              show: function (e) {
                return e.props.footerBorder;
              },
            },
            footerborderRadius: {
              type: "number",
              component: "slider",
              label: "Border Radius (px)",
              ref: "props.footerborderRadius",
              min: 0,
              max: 5,
              step: 1,
              defaultValue: 1,
              show: function (e) {
                return e.props.footerBorder;
              },
            },
          },
        },
      },
    },
    CalSettings: {
      component: "expandable-items",
      label: "Calendar Settings",
      items: {
        ranges: {
          type: "items",
          label: "Predefined ranges",

          items: {
            showPredefinedRanges: {
              type: "items",
              items: {
                CustomRangesSwitch: {
                  type: "boolean",
                  component: "switch",
                  label: "Show predefined ranges",
                  ref: "props.CustomRangesEnabled",
                  options: [
                    { value: !0, translation: "properties.on" },
                    { value: !1, translation: "properties.off" },
                  ],
                  defaultValue: !0,
                },
                CustomRange: {
                  type: "string",
                  ref: "props.customRangeLabel",
                  label: "Custom Range",
                  defaultValue: "Range",
                  expression: "optional",
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                Today: {
                  type: "items",
                  label: "Today",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "Today",
                      ref: "props.enableToday",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.today",
                      label: "Label",
                      defaultValue: "Today",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableToday;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                Yesterday: {
                  type: "items",
                  label: "Yesterday",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "Yesterday",
                      ref: "props.enableYesterday",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.yesterday",
                      label: "Label",
                      defaultValue: "Yesterday",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableYesterday;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                LastXDays: {
                  type: "items",
                  label: "Last X Days",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "LastXDays",
                      ref: "props.enableLastXDays",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.lastXDays",
                      label: "Label",
                      defaultValue: lastXDays,
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableLastXDays;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                ThisMonth: {
                  type: "items",
                  label: "This Month",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "ThisMonth",
                      ref: "props.enableThisMonth",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.thisMonth",
                      label: "Label",
                      defaultValue: "This Month",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableThisMonth;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                LastMonth: {
                  type: "items",
                  label: "Last Month",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "LastMonth",
                      ref: "props.enableLastMonth",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.lastMonth",
                      label: "Label",
                      defaultValue: "Last Month",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableLastMonth;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                CurrentQuarter: {
                  type: "items",
                  label: "Current Quarter",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "CurrentQuarter",
                      ref: "props.enableCurrentQuarter",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.currentQuarter",
                      label: "Label",
                      defaultValue: "Current Quarter",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableCurrentQuarter;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                LastQuarter: {
                  type: "items",
                  label: "Last Quarter",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "LastQuarter",
                      ref: "props.enableLastQuarter",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.lastQuarter",
                      label: "Label",
                      defaultValue: "Last Quarter",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableLastQuarter;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                CurrentYear: {
                  type: "items",
                  label: "Current Year",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "CurrentYear",
                      ref: "props.enableCurrentYear",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.currentYear",
                      label: "Label",
                      defaultValue: "Current Year",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableCurrentYear;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                LastYear: {
                  type: "items",
                  label: "Last Year",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "LastYear",
                      ref: "props.enableLastYear",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.lastYear",
                      label: "Label",
                      defaultValue: "Last Year",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableLastYear;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                QuarterToDate: {
                  type: "items",
                  label: "Quarter To Date",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "QuarterToDate",
                      ref: "props.enableQuarterToDate",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.quarterToDate",
                      label: "Label",
                      defaultValue: "Quarter To Date",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableQuarterToDate;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                YearToDate: {
                  type: "items",
                  label: "Year To Date",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "YearToDate",
                      ref: "props.enableYearToDate",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.yearToDate",
                      label: "Label",
                      defaultValue: "Year To Date",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableYearToDate;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                Rolling12Months: {
                  type: "items",
                  label: "Rolling 12 Months",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "Rolling12Months",
                      ref: "props.enableRolling12Months",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.rolling12Months",
                      label: "Label",
                      defaultValue: "Rolling 12 Months",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableRolling12Months;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
                Rolling12MonthsFull: {
                  type: "items",
                  label: "Rolling 12 Months Full",
                  items: {
                    EnableRange: {
                      type: "boolean",
                      component: "switch",
                      label: "Rolling12MonthsFull",
                      ref: "props.enableRolling12MonthsFull",
                      options: [
                        {
                          value: true,
                          translation: "properties.on",
                        },
                        {
                          value: false,
                          translation: "properties.off",
                        },
                      ],
                      defaultValue: true,
                    },
                    Text: {
                      type: "string",
                      ref: "props.rolling12MonthsFull",
                      label: "Label",
                      defaultValue: "Rolling 12 Months Full",
                      expression: "optional",
                      show: function (data) {
                        return data.props.enableRolling12MonthsFull;
                      },
                    },
                  },
                  show: function (data) {
                    return data.props.CustomRangesEnabled;
                  },
                },
              },
            },
          },
        },
      },
    },

    about: {
      label: "About",
      component: "items",
      items: {
        header: { label: "Date picker", style: "header", component: "text" },
        paragraph1: {
          label:
            "A calendar object that allows a user to make selections in a date field.",
          component: "text",
        },
      },
    },
  },
};
