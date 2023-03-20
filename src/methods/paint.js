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
  if(layout.props.customLabelSwitch ==!1 && layout.props.isSingleDate == !0){
    defaultTextNew = layout.props.defaultText[1];
  }else if(layout.props.customLabelSwitch ==!1 && layout.props.isSingleDate == !1) {
    defaultTextNew = layout.props.defaultText[0];
  }
  else if (layout.props.customLabelSwitch ==!0){
    defaultTextNew = layout.props.customLabel;
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
    outDateFormat = layout.props.format || qlikDateFormat;
    moment.locale(layout.props.locale),
    (minDate = createMoment(layout.props.minDate, qlikDateFormat)),
    (maxDate = createMoment(layout.props.maxDate, qlikDateFormat)),
    (startDate = createMoment(layout.props.startDate, qlikDateFormat)),
    (endDate = createMoment(layout.props.endDate, qlikDateFormat)),
    $("#dropDown_" + layout.qInfo.qId).remove(),
    $element.html(
      createHtml(this.dateStates, outDateFormat, layout.props, sortAscending)
    );
  var element,
    config = {
      viewMode: layout.props.isDay ? "month" : "day",
      linkedCalendars: layout.props.linkedCalendars,
      singleDatePicker: layout.props.isSingleDate,
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
    config.ranges = rangesLiteral;
    var $lastXDays = layout.props.lastXDays;
    var $X = $lastXDays.match(/\d/g);
    $X = $X.join("");
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
    // if(layout.props.enableToday) rangesLiteral[layout.props.lastXDays.replace("$", "7")] = [moment().subtract(6, 'days'), moment()];
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
          self.backendApi.selectValues(0, qElemNumbers, 1);
      }
    });

  /* Cell Styling*/
  $$scope.qId = layout.qInfo.qId;
  console.log($$scope.qId);
  /* Additional State Colors Settings*/
  //Additional css logic
  //Additional colors logic
  var sheet = $(`style#css${layout.qInfo.qId}`);
  if (sheet.length == 0) {
    sheet = document.createElement(`style`);
    sheet.id = `css${layout.qInfo.qId}`;
    console.log(sheet.id);
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

.daterangepicker {
  background-color: ${layout.props.CalendarBgColor.color} !important;
  border-style: ${layout.props.calendarborderType} !important;
  border-color: ${layout.props.calendarborderColor.color} !important;
  border-width: ${layout.props.calendarborderWidth}px !important;
}
.daterangepicker .calendar-table th{
  width: ${layout.props.headerWidth}px !important;
  height: ${layout.props.headerHeight}px !important;
  font-size: ${layout.props.headerfontSize}px !important;
  font-style: ${layout.props.headerfontStyle} !important;
  background-color: ${layout.props.headerBgColor.color} !important;
  color: ${layout.props.headerfontColor.color} !important;
}
.daterangepicker.show-calendar .ranges{
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
.daterangepicker.show-calendar .drp-buttons {
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

// #dropDown_${$$scope.qId}.daterangepicker.in-selection td.in-range {
//   color: ${layout.props.selectedfontColor.color} !important;
//   background-color: ${layout.props.selectedBgColor.color} !important;
// }


// .tooltip { position: relative; }

// .tooltip::before {
//   content: "\2003" attr(class); /* print em-space with class text */
//   display: inline-block;
//   position: absolute; bottom: 50%;
//   background-color: #FFF;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); color: black; padding: 5px; border-radius: 5px;
//   opacity:0; transition:0.3s; overflow:hidden;
//   max-width: 100%; /* avoids very long sentences */
//   pointer-events: none; /* prevents tooltip from firing on pseudo hover */
// }

// .tooltip:hover::before { opacity:1; bottom: 100%; }