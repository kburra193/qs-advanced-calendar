var qlik = window.require("qlik");
var app = qlik.currApp();

import moment from "../../static/lib/moment.min";
import encoder from "../../static/lib/encoder";

export default function ($element, layout) {
  console.log(layout);
  var self = this;
  const $$scope = this.$scope;
  //To get the state count and logic for selected count state bar
  var qCardinal = layout.qListObject.qDimensionInfo.qCardinal;
  var qselectedCount = layout.qListObject.qDimensionInfo.qStateCounts.qSelected;
  var percentSelected = (qselectedCount / qCardinal) * 100;
  var percentAlternative = 100 - percentSelected;
  var defaultTextNew = "";
  if (layout.props.customLabelSwitch == !1 && layout.props.isSingleDate == !0) {
    defaultTextNew = layout.props.defaultText[1];
  } else if (
    layout.props.customLabelSwitch == !1 &&
    layout.props.isSingleDate == !1
  ) {
    defaultTextNew = layout.props.defaultText[0];
  } else if (layout.props.customLabelSwitch == !0) {
    defaultTextNew = layout.props.customLabel;
  }
  var first_letters = moment.weekdays().map((x) => x[0]);
  var two_letters = moment.weekdays().map((x) => x.substring(2, 0));
  var three_letters = moment.weekdays().map((x) => x.substring(3, 0));
  var daysofWeek = layout.props.dayheaderFormat;
  var daysofWeekNew = "";
  if (daysofWeek == "d") {
    daysofWeekNew = first_letters;
  } else if (daysofWeek == "dd") {
    daysofWeekNew = two_letters;
  } else {
    daysofWeekNew = three_letters;
  }
  //Create Session Object
  var listObj = self.backendApi.model;
  async function getListData(listObj, qTop, qHeight) {
    const result = await listObj.getListObjectData({
      qPath: "/qListObjectDef",
      qPages: [
        {
          qTop: qTop * qHeight,
          qLeft: 0,
          qHeight: qHeight,
          qWidth: 2,
        },
      ],
    });
    return result[0].qMatrix;
  }
  var defaultSelection = layout.defaultSelection,
    defaultvalue,
    selectioncount =
      listObj.layout.qListObject.qDimensionInfo.qStateCounts.qSelected;
  // Logic for Single Default Values
  layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
    if (defaultSelection == row[0].qText) {
      defaultvalue = row[0].qElemNumber;
    }
  });
  if (selectioncount == 0) {
    listObj.selectListObjectValues({
      qPath: "/qListObjectDef",
      qValues: [defaultvalue],
      qToggleMode: false, // true for multi select
      //qSoftLock: true,
    });
  }
  // Logic for Multiple Default Values
  var selectAlsoThese = layout.selectAlsoThese;
  console.log("selectalsothese",selectAlsoThese);
  var defaultselectionList = selectAlsoThese.split(",");
  console.log("defaultselectionList",defaultselectionList);
  var data = [];
  var multipleselectValues = [];
  var selected = 0;
  //Logic for Multiple Default Values
  if (selectAlsoThese) {
    layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
      if (row[0].qState === "S") {
        selected = 1;
      }
      data.push(row[0]);
    });
    console.log("data",data);
    for (var i = 0; i < data.length; i++) {
      var text = data[i].qText;
      if (selectioncount == 0) {
        if (defaultselectionList.length > 0) {
          for (var v = 0; v < defaultselectionList.length; v++) {
            if (data[i].qText == defaultselectionList[v]) {
              multipleselectValues.push(data[i].qElemNumber);
            }
          }
        }
      } else {
        multipleselectValues.push(data[i].qElemNumber);
      }
    }
    console.log("multipleselectvalues",multipleselectValues);
    if (selectioncount == 0) {
      listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: multipleselectValues,
        qToggleMode: true, // true for multi select
        //qSoftLock: true,
      });
    }
  }

  //logic for custom range dates default selections
  var defaultselectionminDate = layout.props.defaultselectionminDate; //From Date
  var defualtselectionmaxDate = layout.props.defualtselectionmaxDate; //To Date
  function enumerateDaysBetweenDates (startDate, endDate){
    let date = []
    while(moment(startDate) <= moment(endDate)){
      date.push(startDate);
      startDate = moment(startDate).add(1, 'days').format('M/D/YYYY');
    }
    return date;
  }
  let defaultselectionrangedateArr = enumerateDaysBetweenDates(defaultselectionminDate, defualtselectionmaxDate);
  console.log(defaultselectionrangedateArr);
  var data_range = [];
  var multipleselectValues_range = [];
 
  if (defaultselectionminDate && defaultselectionminDate) {
    layout.qListObject.qDataPages[0].qMatrix.forEach(function (row) {
      if (row[0].qState === "S") {
        selected = 1;
      }
      data_range.push(row[0]);
    });
    console.log("data_range",data_range);
    for (var i = 0; i < data_range.length; i++) {
      var text = data_range[i].qText;
      if (selectioncount == 0) {
        if (defaultselectionrangedateArr.length > 0) {
          for (var v = 0; v < defaultselectionrangedateArr.length; v++) {
            if (data_range[i].qText == defaultselectionrangedateArr[v]) {
              multipleselectValues_range.push(data_range[i].qElemNumber);
            }
          }
        }
      } else {
        multipleselectValues_range.push(data_range[i].qElemNumber);
      }
    }
    console.log("multipleselectValues_range",multipleselectValues_range);
    if (selectioncount == 0) {
      listObj.selectListObjectValues({
        qPath: "/qListObjectDef",
        qValues: multipleselectValues_range,
        qToggleMode: true, // true for multi select
        //qSoftLock: true,
      });
    }
  } 



  function createDate(num) {
    return moment(86400 * (num - 25569) * 1e3)
      .utc()
      .format("YYYYMMDD")
      .toString();
  }
  function createMoment(str, format) {
    return isNaN(str)
      ? moment.utc(str, format)
      : moment.utc(createDate(str), "YYYYMMDD");
  }
  function createDateStates(pages) {
    var dateStates = {};
    return (
      pages.forEach(function (page) {
        page.qMatrix.forEach(function (row) {
          var d = createDate(row[0].qNum);
          (dateStates[d] = row[0].qState),
            "S" === row[0].qState &&
              ((dateStates.rangeEnd = dateStates.rangeEnd || row[0].qNum),
              (dateStates.rangeStart = row[0].qNum));
        });
      }),
      dateStates
    );
  }
  function createHtml(dateStates, DateFormat, props, sortAscending) {
    var startRange,
      endRange,
      html = "<div>";
    return (
      !(function (obj) {
        for (var key in obj) if (obj.hasOwnProperty(key)) return !1;
        return !0;
      })(dateStates)
        ? ((html +=
            '<div class="bootstrap_inside pull-right show-range" style="border: 1px solid #ccc;border-radius: 4px;height: 30px;line-height: 30px;display: block;margin: 0 0 5px 0;padding: 0 6px 0 6px;width: 100%;text-overflow: ellipsis;box-sizing: border-box;vertical-align: middle;">'),
          (html +=
            '   <i class="lui-icon lui-icon--calendar"></i>&nbsp;<span>'),
          dateStates.rangeStart
            ? ((startRange = createMoment(dateStates.rangeStart).format(
                DateFormat
              )),
              (endRange =
                dateStates.rangeEnd &&
                dateStates.rangeEnd !== dateStates.rangeStart
                  ? createMoment(dateStates.rangeEnd).format(DateFormat)
                  : null),
              sortAscending
                ? (html +=
                    null !== endRange
                      ? encoder.encodeForHTML(endRange) +
                        encoder.encodeForHTML(props.separator) +
                        encoder.encodeForHTML(startRange)
                      : encoder.encodeForHTML(startRange))
                : ((html += encoder.encodeForHTML(startRange)),
                  null !== endRange &&
                    (html +=
                      encoder.encodeForHTML(props.separator) +
                      encoder.encodeForHTML(endRange))))
            : (html += encoder.encodeForHTML(defaultTextNew)),
          (html += `</span> <b class="lui-button__caret lui-caret" style="float: right;"></b>
            <div class="state-count-bar" tid="stateCount">
            <div class="state selected" style="width:${percentSelected}%; background-color:${layout.props.selectedBgColor.color}"></div>
            <div class="state alternative" style="width:${percentAlternative}%; background-color:${layout.props.alternateBgColor.color}"></div>
            </div>
            `),
          (html += "</div>"))
        : ((html +=
            '   <i class="lui-icon lui-icon--calendar"></i>&nbsp;&nbsp;&nbsp;<span>'),
          (html += "Add Date Field</span>")),
      (html += "</div>")
    );
  }
  function getTopPosition(element) {
    return $(window).height() - element.offset().top > 310 ? "down" : "up";
  }
  // ..paint code here
  var self = this;
  var viewModeNew = layout.props.isDay;
  if (layout.props.isDay == !1) {
    var propsoutDateFormat = layout.props.dayFormat;
  } else if (layout.props.isDay == !0) {
    var propsoutDateFormat = layout.props.monthFormat;
  }
  var interactionState = this._interactionState,
    noSelections = !0 === this.options.noSelections,
    sortAscending =
      (layout &&
        layout.qListObject &&
        layout.qListObject.qSortCriterias &&
        "1" == layout.qListObject.qSortCriterias.qSortByNumeric) ||
      (layout &&
        layout.qListObject &&
        layout.qListObject.qDimensionInfo &&
        "A" == layout.qListObject.qDimensionInfo.qSortIndicator);
  (this.dateStates = createDateStates(layout.qListObject.qDataPages)),
    self.app || (self.app = qlik.currApp(this));

  var minDate,
    maxDate,
    startDate,
    endDate,
    qlikDateFormat =
      layout.qListObject.qDimensionInfo.qNumFormat.qFmt ||
      self.app.model.layout.qLocaleInfo.qDateFmt,
    outDateFormat = propsoutDateFormat || qlikDateFormat;
  moment.locale(layout.props.locale),
    (minDate = createMoment(layout.props.minDate, qlikDateFormat)),
    (maxDate = createMoment(layout.props.maxDate, qlikDateFormat)),
    (startDate = createMoment(layout.props.startDate, qlikDateFormat)),
    (endDate = createMoment(layout.props.endDate, qlikDateFormat)),
    // $("#dropDown_" + layout.qInfo.qId).remove(),
    $element.html(
      createHtml(this.dateStates, outDateFormat, layout.props, sortAscending)
    );
  var element,
    config = {
      viewMode: layout.props.isDay ? "month" : "day",
      linkedCalendars: layout.props.linkedCalendars,
      singleDatePicker: layout.props.isSingleDate,
      daysofWeekNew: daysofWeekNew,
      monthCellFormat: layout.props.monthcellformat,
      preventSelections: noSelections,
      locale: { format: outDateFormat, separator: layout.props.separator },
      parentEl: "#grid",
      autoUpdateInput: false,
      autoApply: false,
      opens:
        ((element = $element),
        element.offset().left < 600
          ? "right"
          : element.offset().right < 600
          ? "left"
          : void 0),
      top: getTopPosition($element),
      id: layout.qInfo.qId,
      getClass: function (date) {
        var d = date.format("YYYYMMDD");
        return self.dateStates[d] ? "state" + self.dateStates[d] : "nodata";
      },
    };
  minDate.isValid() && (config.minDate = minDate),
    maxDate.isValid() && (config.maxDate = maxDate),
    startDate.isValid()
      ? (config.startDate = startDate)
      : (config.startDate = config.minDate),
    endDate.isValid()
      ? (config.endDate = endDate)
      : (config.endDate = config.maxDate);
  var rangesLiteral = {};

  if (minDate.isValid()) {
    config.minDate = minDate;
  }

  if (maxDate.isValid()) {
    config.maxDate = maxDate;
  }

  if (startDate.isValid()) {
    config.startDate = startDate;
  }
  if (layout.props.CustomRangesEnabled) {
    config.locale.customRangeLabel = layout.props.customRangeLabel;
    var $lastXDays = layout.props.lastXDays;
    var $X = $lastXDays.match(/\d/g);
    $X = $X.join("");
    //logic for custom range dates
    var customfromDate = layout.props.customminDate; //From Date
    var customfromdateObj = new Date(customfromDate);
    var customfromdatemomentObj = moment(customfromdateObj);
    var customendDate = layout.props.custommaxDate; //To Date
    var customenddateObj = new Date(customendDate);
    var customenddatemomentObj = moment(customenddateObj);
    if (layout.props.enablecustomRange)
      rangesLiteral[layout.props.enablecustomRange] = [
        customfromdatemomentObj,
        customenddatemomentObj,
      ];
    if (layout.props.enableToday)
      rangesLiteral[layout.props.today] = [
        moment().startOf("day"),
        moment().startOf("day"),
      ];
    if (layout.props.enableYesterday)
      rangesLiteral[layout.props.yesterday] = [
        moment().subtract(1, "days"),
        moment().subtract(1, "days"),
      ];
    if (layout.props.enableLastXDays)
      rangesLiteral[layout.props.lastXDays.replace("$", $X)] = [
        moment().subtract($X - 1, "days"),
        moment(),
      ];
    if (layout.props.enableThisMonth)
      rangesLiteral[layout.props.thisMonth] = [
        moment().startOf("month"),
        moment().endOf("month"),
      ];
    if (layout.props.enableLastMonth)
      rangesLiteral[layout.props.lastMonth] = [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ];

    if (layout.props.enableCurrentQuarter)
      rangesLiteral[layout.props.currentQuarter] = [
        moment().startOf("quarter"),
        moment().endOf("quarter"),
      ];
    if (layout.props.enableLastQuarter)
      rangesLiteral[layout.props.lastQuarter] = [
        moment().startOf("quarter").subtract(1, "quarter"),
        moment().startOf("quarter").subtract(1, "day"),
      ];
    if (layout.props.enableCurrentYear)
      rangesLiteral[layout.props.currentYear] = [
        moment().startOf("year"),
        moment().endOf("year"),
      ];
    if (layout.props.enableLastYear)
      rangesLiteral[layout.props.lastYear] = [
        moment().startOf("year").subtract(1, "years"),
        moment().startOf("year").subtract(1, "days"),
      ];
    if (layout.props.enableQuarterToDate)
      rangesLiteral[layout.props.quarterToDate] = [
        moment().startOf("quarter"),
        moment(),
      ];
    if (layout.props.enableYearToDate)
      rangesLiteral[layout.props.yearToDate] = [
        moment().startOf("year"),
        moment(),
      ];
    if (layout.props.enableRolling12Months)
      rangesLiteral[layout.props.rolling12Months] = [
        moment().subtract(12, "months"),
        moment(),
      ];
    if (layout.props.enableRolling12MonthsFull)
      rangesLiteral[layout.props.rolling12MonthsFull] = [
        moment().subtract(12, "months").startOf("month"),
        moment().startOf("month").subtract(1, "days"),
      ];
    let renameKeys = (keysMap, rangesLiteral) =>
      Object.keys(rangesLiteral).reduce(
        (acc, key) => ({
          ...acc,
          ...{ [keysMap[key] || key]: rangesLiteral[key] },
        }),
        {}
      );
    let rangesLiteralnew = renameKeys({ true: "Custom Range" }, rangesLiteral);
    config.ranges = rangesLiteralnew;
    console.log({ rangesLiteral });
  }

  $element
    .find(".show-range")
    .daterangepicker(config, function (pickStart, pickEnd, label) {
      if (!noSelections && pickStart.isValid() && pickEnd.isValid()) {
        var pickStartString,
          pickEndString,
          lastIndex,
          lowIndex,
          highIndex,
          qElemNumbers;
        -1 === qlikDateFormat.indexOf("#")
          ? ((pickStartString = moment
              .utc(pickStart.format("YYYYMMDD").toString(), "YYYYMMDD")
              .format(qlikDateFormat)),
            (pickEndString = moment
              .utc(pickEnd.format("YYYYMMDD").toString(), "YYYYMMDD")
              .format(qlikDateFormat)),
            (pickStart = createMoment(pickStartString, qlikDateFormat)),
            (pickEnd = createMoment(pickEndString, qlikDateFormat)))
          : ((pickStart = moment.utc(
              pickStart.format("YYYYMMDD").toString(),
              "YYYYMMDD"
            )),
            (pickEnd = moment.utc(
              pickEnd.format("YYYYMMDD").toString(),
              "YYYYMMDD"
            )));
        var dateBinarySearch = function (seachDate, lowIndex, highIndex) {
          if (lowIndex === highIndex) return lowIndex;
          var middleIndex = lowIndex + Math.ceil((highIndex - lowIndex) / 2),
            middleDate = createMoment(
              layout.qListObject.qDataPages[0].qMatrix[middleIndex][0].qText,
              qlikDateFormat
            );
          if (sortAscending) {
            if (seachDate.isBefore(middleDate))
              return dateBinarySearch(seachDate, lowIndex, middleIndex - 1);
          } else if (seachDate.isAfter(middleDate))
            return dateBinarySearch(seachDate, lowIndex, middleIndex - 1);
          return dateBinarySearch(seachDate, middleIndex, highIndex);
        };
        sortAscending
          ? ((lastIndex = layout.qListObject.qDataPages[0].qMatrix.length - 1),
            (lowIndex = dateBinarySearch(pickStart, 0, lastIndex)),
            (highIndex = dateBinarySearch(pickEnd, lowIndex, lastIndex)),
            (qElemNumbers = layout.qListObject.qDataPages[0].qMatrix
              .slice(lowIndex, highIndex + 1)
              .map(function (fieldValue) {
                return fieldValue[0].qElemNumber;
              })))
          : ((lastIndex = layout.qListObject.qDataPages[0].qMatrix.length - 1),
            (lowIndex = dateBinarySearch(pickEnd, 0, lastIndex)),
            (highIndex = dateBinarySearch(pickStart, lowIndex, lastIndex)),
            (qElemNumbers = layout.qListObject.qDataPages[0].qMatrix
              .slice(lowIndex, highIndex + 1)
              .map(function (fieldValue) {
                var date = createMoment(fieldValue[0].qText, qlikDateFormat);
                return date.isSame(pickEnd) ||
                  date.isSame(pickStart) ||
                  (date.isBefore(pickEnd) && date.isAfter(pickStart))
                  ? fieldValue[0].qElemNumber
                  : -1;
              }))),
          self.backendApi.selectValues(0, qElemNumbers, 0);
      }
    });

  //Display none for Ranges when button is off
  if (layout.props.CustomRangesEnabled == !1) {
    $("div.ranges").css("display", "none");
  }
  //Display none for single date
  if (layout.props.isSingleDate == !0) {
    $("span.drp-selected-from").css("display", "none");
    $("span.drp-selected-to").css("display", "none");
    $("span.separatorfromto").css("display", "none");
  }

  /* Cell Styling*/
  $$scope.qId = layout.qInfo.qId;
  var sheet = $(`style#css${layout.qInfo.qId}`);
  if (sheet.length == 0) {
    sheet = document.createElement(`style`);
    sheet.id = `css${layout.qInfo.qId}`;
  } else {
    sheet = sheet[0];
  }
  document.body.appendChild(sheet);
  sheet.innerHTML = `
/* For icons on hover to remove */
.object-wrapper:has([aria-labelledby="${$$scope.qId}_type ${$$scope.qId}_title ${$$scope.qId}_noTitle ${$$scope.qId}_content"]) .qv-object-nav
{
  display: none !important;
}
/* When you are in sense other theme modes, to hide the border we use this logic and for background to hide we have code on css styels. This is for dropdown mainly*/
.object-wrapper:has([aria-labelledby="${$$scope.qId}_type ${$$scope.qId}_title ${$$scope.qId}_noTitle ${$$scope.qId}_content"]) .qv-object
{
  border: 0 !important;
}
.qv-object-qs-advanced-calendar .show-range  {
  width: ${layout.props.dropdownWidth}% !important;
  font-size: ${layout.props.dropdownfontSize}px !important;
  background-color: ${layout.props.dropdownBgColor.color} !important;
  color: ${layout.props.dropdownfontColor.color} !important;
  border-style: ${layout.props.dropdownborderType} !important;
  border-color: ${layout.props.dropdownborderColor.color} !important;
  border-width: ${layout.props.dropdownborderWidth}px !important;
  border-radius: ${layout.props.dropdownborderRadius}px !important;
  width: ${layout.props.dropdownBgColor.color}px !important;
}

#dropDown_${$$scope.qId}.daterangepicker {
  background-color: ${layout.props.CalendarBgColor.color} !important;
  border-style: ${layout.props.calendarborderType} !important;
  border-color: ${layout.props.calendarborderColor.color} !important;
  border-width: ${layout.props.calendarborderWidth}px !important;
}
#dropDown_${$$scope.qId}.daterangepicker .calendar-table th {
  width: ${layout.props.headerWidth}px !important;
  height: ${layout.props.headerHeight}px !important;
  font-size: ${layout.props.headerfontSize}px !important;
  font-style: ${layout.props.headerfontStyle} !important;
  background-color: ${layout.props.headerBgColor.color} !important;
  color: ${layout.props.headerfontColor.color} !important;
  border-style: ${layout.props.headerborderType} !important;
  border-color: ${layout.props.headerborderColor.color} !important;
  border-width: ${layout.props.headerborderWidth}px !important;
  border-radius: ${layout.props.headerborderRadius}px !important;
}
#dropDown_${$$scope.qId}.daterangepicker  .calendar-table td {
  height: ${layout.props.cellHeight}px !important;
  font-size:  ${layout.props.cellfontSize}px !important;
  border-style:  ${layout.props.cellborderType} !important;
  border-color: ${layout.props.cellborderColor.color} !important;
  border-width: ${layout.props.cellborderWidth}px !important;
  border-radius: ${layout.props.cellborderRadius}px !important;
  background: ${layout.props.possibleBgColor.color};
  color: ${layout.props.possiblefontColor.color};
}
#dropDown_${$$scope.qId}.daterangepicker td.in-range {
  height: ${layout.props.cellHeight}px !important;
  font-size:  ${layout.props.cellfontSize}px !important;
  border-style: ${layout.props.cellborderType} !important;
  border-color: ${layout.props.cellborderColor.color} !important;
  border-width: ${layout.props.cellborderWidth}px !important;
  border-radius: ${layout.props.cellborderRadius}px !important;
  background: ${layout.props.selectedBgColor.color};
  color: ${layout.props.selectedfontColor.color};
}
#dropDown_${$$scope.qId}.daterangepicker td.active {
  background: ${layout.props.selectedBgColor.color} !important;
  color: ${layout.props.selectedfontColor.color} !important;
  opacity: 1;
}
#dropDown_${$$scope.qId}.daterangepicker td.disabled, .daterangepicker option.disabled {
  background: ${layout.props.excludedBgColor.color} !important;
  color: ${layout.props.excludedFontColor.color} !important;
  cursor: not-allowed;
  text-decoration: line-through;
}
#dropDown_${$$scope.qId}.daterangepicker.show-calendar .ranges {
  font-size:  ${layout.props.rangesfontSize}px !important;
  font-weight:  ${layout.props.fontWeight} !important;
  background:  ${layout.props.rangesBgColor.color} !important;
  border-style: ${layout.props.rangesborderType} !important;
  border-color: ${layout.props.rangesborderColor.color} !important;
  border-width: ${layout.props.rangesborderWidth}px !important;
  border-radius: ${layout.props.rangesborderRadius}px !important;
  color: ${layout.props.rangesfontColor.color} !important;
  padding: 5px 12px !important;
  cursor: pointer !important;
}
#dropDown_${$$scope.qId}.daterangepicker.show-calendar .drp-buttons {
  font-size:  ${layout.props.footerfontSize}px !important;
  background:  ${layout.props.footerBgColor.color} !important;
  border-style: ${layout.props.footerborderType} !important;
  border-color: ${layout.props.footerborderColor.color} !important;
  border-width: ${layout.props.footerborderWidth}px !important;
  border-radius: ${layout.props.footerborderRadius}px !important;
  color: ${layout.props.footerfontColor.color} !important;
}
`;
}
