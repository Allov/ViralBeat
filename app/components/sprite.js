define(["virality"], function(v) {
    var _asset,
        _grid,
        _size;
    
    var sprite = {
        create: function(size, asset, grid) {
            v.load(asset);
            
            _asset = asset;
            _grid = grid;
            _size = size;
        },
        draw: function(context, tileName, x, y) {
            var tile = _grid[tileName];
            context.drawImage(v.assets[_asset.name], tile.x * _size, tile.y * _size, _size, _size, x, y, _size, _size);
        }
    };
    
    return sprite;
});