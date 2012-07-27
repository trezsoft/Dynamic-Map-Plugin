/**
 * Impact Plugin dynamic-map.js : Dynamic map plugin
 * Only updates when you request
 * Size and position can be set
 * Supports scaling.
 * User: Stuart Tresadern
 * Date: 09.07.12
 * Time: 22:00
 * Version 1.0.1.
 */
ig.module(
    'plugins.dynamic-map'
)
    .defines(function () {
        ig.DynamicMap = ig.Class.extend(
            {
                cacheImage:null,
                TileSize:32,
                Map:null,
                TileSet:null,
                mapSize:{x:0,y:0},
                mapOffset:{x:0,y:0},

                init:function (tileSet,tileSize,mapSizeX,mapSizeY,mapOffsetX,mapOffsetY) {

                    this.TileSet = tileSet;
                    this.TileSize = tileSize;
                    this.mapSize.x = mapSizeX;
                    this.mapSize.y = mapSizeY;
                    this.mapOffset.x = mapOffsetX;
                    this.mapOffset.y = mapOffsetY;

                    var data = new Array(this.mapSize.y);
                    for (var iY = 0; iY < this.mapSize.y; iY++) {
                        data[iY] = new Array(this.mapSize.x);
                        for (var iX = 0; iX < this.mapSize.x; iX++) {
                            data[iY][iX] = 0;
                        }
                    }

                    this.Map = new ig.BackgroundMap(this.TileSize, data, this.TileSet);
                    this.cacheImage = ig.$new('canvas');
                    this.cacheImage.width = (this.mapSize.x * this.TileSize) * ig.system.scale;
                    this.cacheImage.height = (this.mapSize.y * this.TileSize) * ig.system.scale;

                },
                clear:function () {

                    for (var iY = 0; iY < this.mapSize.y; iY++) {

                        for (var iX = 0; iX < this.mapSize.x; iX++) {

                            this.Map.data[iY][iX] = 0;

                        }
                    }

                },

                setTile:function (y, x, tileValue) {

                    if (!(x < 0 || y < 0 || x > this.mapSize.x - 1 || y > this.mapSize.y - 1)) {

                        this.Map.data[y][x] = tileValue;
                    }

                },

                draw:function (forceReDraw) {

                    if (forceReDraw)
                    {
                        var impactCtx = ig.system.context;
                        ig.system.context = this.cacheImage.getContext('2d');
                        this.Map.setScreenPos(0, 0);
                        ig.system.context.clearRect(0, 0, this.cacheImage.width, this.cacheImage.height);

                        this.Map.draw();

                        ig.system.context = impactCtx;

                    }

                    ig.system.context.drawImage(this.cacheImage, this.mapOffset.x * this.TileSize *ig.system.scale, this.mapOffset.y*this.TileSize*ig.system.scale);

                }
            });
    });
