
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