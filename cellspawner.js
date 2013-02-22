(function (undefined) {
    var CellSpawner = function () { };

    CellSpawner.prototype.spawnRedCell = function (factor) {
        var spawnFactor = Math.floor(factor) + 1;

        var x = Math.floor(Math.random() * viewport.width) + 1;
        var y = Math.floor(Math.random() * viewport.height) + 1;

        var rCell = new RedBloodCell(x, y, Math.ceil(spawnFactor * 0.09) + 1);

        var dirX = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        var dirY = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        rCell.moveTo(x + (Math.floor(Math.random() * 100) + 50) * dirX, y + (Math.floor(Math.random() * 100) + 50) * dirY);

        return rCell;
    };

    CellSpawner.prototype.spawnWhiteCell = function (factor) {
        var spawnFactor = Math.floor(factor) + 1;
        var position = Math.floor(Math.random() * 4);

        var x = Math.floor(Math.random() * viewport.width) + 1;
        var y = Math.floor(Math.random() * viewport.height) + 1;

        var wCell = new WhiteBloodCell(x, y, Math.ceil(spawnFactor * 0.13) + 2);

        var dirX = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        var dirY = Math.floor(Math.random() * 10) % 2 ? -1 : 1;
        wCell.moveTo(x + (Math.floor(Math.random() * 100) + 50) * dirX, y + (Math.floor(Math.random() * 100) + 50) * dirY);

        return wCell;
    }

    window.CellSpawner = CellSpawner;
})();