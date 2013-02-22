(function ($, w, undefined) {
    var ui = {};

    ui.drawText = function (context, text, x, y, font, style) {
        context.font = font || "20px Verdana";
        context.fillStyle = style || '#CCFFCC';
        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillText(text, x, y);
    };

    ui.drawFPS = function (context, fps) {
        this.drawText(context, fps + " FPS", 10, 20);
    };

    ui.clear = function (context, color) {
        context.clearRect(0, 0, viewport.width, viewport.height);
        context.fillStyle = color;
        context.fillRect(0, 0, viewport.width, viewport.height);
    };

    ui.drawMenu = function (context, elapsed) {
        createButton(context, "S T A R T !", viewport.width / 2 - 100, viewport.height / 2 - 25, 200, 50);
    };

    ui.lowDetected = function (low) {
        updateDetector("#low", low);
    };

    ui.midDetected = function (mid) {
        updateDetector("#mid", mid);
    };

    ui.highDetected = function (high) {
        updateDetector("#high", high);
    };

    ui.globalDetected = function (global) {
        updateDetector("#global", global);
    };

    function updateDetector(element, value) {
        $(element).html(value > 0 ? "&Oslash;&nbsp;" : "-&nbsp;");
    }

    function createButton(context, text, x, y, w, h) {
        context.fillStyle = "#CCFFCC";
        context.fillRect(x, y, w, h);

        context.strokeStyle = "#CCFFCC";
        context.strokeRect(x - 3, y - 3, w + 6, h + 6);

        context.fillStyle = '#000';
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("S T A R T !", x + w / 2, y + h / 2);
    }

    w.ui = ui;
})(jQuery, window);