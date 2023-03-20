/**
 * Copyright (c) 2010 - The OWASP Foundation
 * <p/>
 * The jquery-encoder is published by OWASP under the MIT license.
 * <p/>
 * This is encoder builds on jquery-encoder. It is refactored to suit the need for the QlikView Application.
 * Since it no longer has any dependencies to jQuery it now called
 * <em>encoder</em>
 */
define([],(function(){return{encodeForHTML:function(input){if(void 0===input)return"";let encoded="",encodingDiv=document.createElement("div");const textNode=document.createTextNode(input);return encodingDiv.appendChild(textNode),encoded=encodingDiv.innerHTML,encodingDiv.removeChild(textNode),encoded},encodeAttr:input=>{const immune=["#"," ","(",")"];let encoded="";for(i=0;i<input.length;i++)ch=input.charAt(i),cc=input.charCodeAt(i),!ch.match(/[a-zA-Z0-9]/)&&immune.indexOf(ch)<0?(hex=cc.toString(16),encoded+=`&#x${hex};`):encoded+=ch;return encoded}}}));