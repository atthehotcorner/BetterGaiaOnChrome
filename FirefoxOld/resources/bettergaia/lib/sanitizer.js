exports.sanitizeHTML = function(html){
    var {Cc,Ci} = require("chrome");
    var parser = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
    var sanitizedHTML = parser.sanitize(html, parser.SanitizerAllowStyle);
    return sanitizedHTML;
};