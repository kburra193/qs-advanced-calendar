import {
  initialProperties,
  template,
  definition,
  controller,
  paint,
  resize,
} from "./methods";
import "./style.css";
import moment from "../static/lib/moment.min";
import encoder from "../static/lib/encoder";
// daterangepicker is not inline (being included at runtime and inserted at window level)
window.define(
  ["jquery", "./static/lib/daterangepicker_v3.1", "css!./static/lib/daterangepicker_v3.1.css"],
  function ($, daterangepicker) {
    return {
      initialProperties,
      template,
      definition,
      controller,
      paint,
      resize,
	    moment,
      encoder,
      $,
      daterangepicker
    };
  }
);

//Few important notes :
//1. Had to replace "qlik-date-picker" class to "qs-advanced-calendar" in daterangepicker.css file
//2. Use daterangepicker js and css within the window.define
//3. Use all functions in Paint and logic in Paint
//4. Convert the code to template 