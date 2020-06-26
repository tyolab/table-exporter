/*
 *   Copyright (c) 2020 TYONLINE TECHNOLOGY PTY. LTD. (TYO Lab) All rights reserved. 
 *   @author Eric Tang (twitter: @_e_tang).
 */

module.exports.toPath = function ($node) {
    var parents = [];

    $node.parents().addBack().not('html').each(function() {

        var entry = this.tagName.toLowerCase();
        if (this.className) {
            entry += "." + this.className.replace(/ /g, '.');
            }
            parents.push(entry);
    });

    return parents.join(" ");
}