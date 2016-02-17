var CanvasPlayerCommand = function (properties, duration) {
    this.properties = properties;
    this.duration = duration;
}

var CanvasPlayerTrack = function (layerGroupName) {
    this.layerGroupName = layerGroupName;
    this.commands = [];
}
$.extend(CanvasPlayerTrack.prototype, {
    addFrame: function (properties, duration) {
        var command = new CanvasPlayerCommand(properties, duration);
        this.commands.push(command);
        return this;
    }
});

var CanvasProgram = function () {
    this.tracks = [];
};
$.extend(CanvasProgram.prototype, {
    addTrack: function (layerGroupName) {
        this.tracks[layerGroupName] = new CanvasPlayerTrack(layerGroupName);
        return this.tracks[layerGroupName];
    }
});

var CanvasPlayer = function ($canvas) {
    this.canvas = $canvas;
    this.program = null;
    this.commandIndexes = null;
};
$.extend(CanvasPlayer.prototype, {
    play: function (program) {
        if (!CanvasProgram.prototype.isPrototypeOf(program))
            return;

        this.program = program;
        this.commandIndexes = [];
        for (var trackName in program.tracks)
            this.commandIndexes[trackName] = 0;
        
        var commandIndexes = this.commandIndexes;
        var $canvas = this.canvas;
        function playAFrame (trackName) {
            var track = program.tracks[trackName];
            var command = track.commands[commandIndexes[trackName]];
            var iOfCompleteCallback = 0;
            $canvas.animateLayerGroup(track.layerGroupName, command.properties, {
                duration: command.duration,
                complete: function (layer) {
                    if (iOfCompleteCallback++)
                        return;

                    commandIndexes[trackName]++;
                    if (commandIndexes[trackName] < Object.keys(track.commands).length)
                        playAFrame(trackName);
                }
            });
        }

        for (var trackName in program.tracks)
            playAFrame(trackName);
    }
});

$.fn.constructFootballBoard = function (options) {
    options = $.extend({
            sideMergin: 20,
            lineStyle: '#fff',
            lineWidth: 2,
            playerSize: 20,
            backgroundColor: '#0f0',
            width: 400,
            height: 500
        }, options);
    var op = options;

    var $log = $("#log");
    if ($log.length) {
        $("<div/>").insertBefore($log).css({
            height: $log.height(),
            width: "100%"
        });
        $log = $("<ol/>").appendTo($log);
    }
    else
        $log = null;

    function log(msg) {
        if ($log) {
            $log.append($("<li/>").html(msg));
            $("#log").animate({ scrollTop: $('#log').prop("scrollHeight") }, 1000);
        }
    }

    var $board = null;
    var $ball = null;
    var $freeBall = null;
    var $ballOwner = null;

    $(this)
    .attr("width", "" + op.width)
    .attr("height", "" + op.height)
    .css("width", "" + op.width)
    .css("height", "" + op.height);

    $.extend($.prototype, {
        canvasPlayer: new CanvasPlayer(this)
    });

    function distance(layer0, layer1) {
        return Math.distance(layer0.x, layer0.y, layer1.x, layer1.y);
    }

    function letBallGo(layer) {
        if ($freeBall)
            return;

        if ($ballOwner != null) {
            log($ballOwner.name + ' released a ball.');

            $board.removeLayerFromGroup($ball.name, $ballOwner.name);
            $ballOwner = null;
        }

        $freeBall = $ball;
    }

    function getBall(layer) {
        if (!$freeBall)
            return;
        if ($.inArray(layer.name, $ball.groups) >= 0)
            return;

        if (distance(layer, $ball) > layer.radius + $ball.radius)
            return;

        $ballOwner = layer;

        log(layer.name + ' got a ball');
        if ($ballOwner != null)
            letBallGo(layer);
        $board.addLayerToGroup($freeBall.name, $ballOwner.name);

        $freeBall = null;
    }

    $board = $(this);

    // Draw Court
    $board
	.css({
	    backgroundColor: op.backgroundColor
	})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: op.sideMergin, y: op.sideMergin,
	    width: $board.width() - op.sideMergin * 2, height: $board.height() - op.sideMergin * 2,
	    fromCenter: false
	})
    // Penalty Arcs
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + $board.height() * 3 / 25 * 5 / 6,
	    radius: $board.width() / 10
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + $board.height() * 3 / 25 * 5 / 6),
	    radius: $board.width() / 10
	})
    // Penalty Area
	.drawRect({
	    name: "penalty-area-0",
	    layer: true,
	    fillStyle: op.backgroundColor,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + $board.height() * 9 / 50 * 5 / 6 / 2,
	    width: $board.width() * 11 / 25, height: $board.height() * 9 / 50 * 5 / 6
	})
	//.drawRect({
	//    layer: true,
	//    strokeStyle: op.lineStyle,
	//    strokeWidth: op.lineWidth,
	//    x: $board.width() / 2, y: op.sideMergin + $board.height() * 9 / 50 * 5 / 6 / 2,
	//    width: $board.width() * 11 / 25, height: $board.height() * 9 / 50 * 5 / 6
	//})
	.drawRect({
	    layer: true,
        name: "penalty-area-1",
	    fillStyle: op.backgroundColor,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + $board.height() * 9 / 50 * 5 / 6 / 2),
	    width: $board.width() * 11 / 25, height: $board.height() * 9 / 50 * 5 / 6
	})
	//.drawRect({
	//    layer: true,
	//    name: "penalty-area-0",
	//    strokeStyle: op.lineStyle,
	//    strokeWidth: op.lineWidth,
	//    x: $board.width() / 2, y: $board.height() - (op.sideMergin + $board.height() * 9 / 50 * 5 / 6 / 2),
	//    width: $board.width() * 11 / 25, height: $board.height() * 9 / 50 * 5 / 6
	//})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + $board.height() * 3 / 50 * 5 / 6 / 2,
	    width: $board.width() / 5, height: $board.height() * 3 / 50 * 5 / 6
	})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + $board.height() * 3 / 50 * 5 / 6 / 2),
	    width: $board.width() / 5, height: $board.height() * 3 / 50 * 5 / 6
	})
    // Penalty Spots
	.drawArc({
	    layer: true,
	    fillStyle: op.lineStyle,
	    x: $board.width() / 2, y: op.sideMergin + $board.height() * 3 / 25 * 5 / 6,
	    radius: $board.width() / 100
	})
	.drawArc({
	    layer: true,
	    fillStyle: op.lineStyle,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + $board.height() * 3 / 25 * 5 / 6),
	    radius: $board.width() / 100
	})
    // Corners
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: op.sideMergin, y: op.sideMergin,
	    start: 90, end: 180,
	    radius: $board.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() - op.sideMergin, y: op.sideMergin,
	    start: 180, end: 270,
	    radius: $board.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() - op.sideMergin, y: $board.height() - op.sideMergin,
	    start: 270, end: 0,
	    radius: $board.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: op.sideMergin, y: $board.height() - op.sideMergin,
	    start: 0, end: 90,
	    radius: $board.width() / 50
	})
    // Center Circle
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() / 2,
	    radius: ($board.width() / 10 + $board.height() / 10 * 5 / 6) / 2
	})
    // Center Line
	.drawLine({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x1: op.sideMergin, y1: $board.height() / 2,
	    x2: $board.width() - op.sideMergin, y2: $board.height() / 2
	});

    // Add players
    function addPlayer(name, group, rgb, initialX, initialY) {
        $board
		.drawArc({
		    name: name,
		    layer: true,
		    draggable: true,
		    bringToFront: true,
		    groups: ['players', group, name],
		    dragGroups: [name],
		    fillStyle: rgb,
		    x: initialX, y: initialY,
		    radius: op.playerSize / 2,
		    mouseover: getBall,
		    dragstart: function (layer) {
		        $board.animateLayer(layer.name, {
		            strokeStyle: op.lineStyle,
		            strokeWidth: op.lineWidth
		        }, 250);
		        $board.moveLayer($ball.name, 1000);
		        $board.drawLayer($ball.name);
		    },
		    dragstop: function (layer) {
		        $board.animateLayer(layer.name, {
		            strokeWidth: 0
		        }, 250);
		        $board.moveLayer($ball.name, 1000);
		        $board.drawLayer($ball.name);
		        log("Player " + layer.name + " moved to (" + layer.x + ", " + layer.y + ")");
		    }
		});
        $('canvas').getLayer(name);
    }

    function addTeamMate(name, initialX, initialY) {
        var planyer = addPlayer(name, 'teammate', '#36c', initialX, initialY);
    }
    function addOppornent(name, initialX, initialY) {
        var planyer = addPlayer(name, 'oppornent', '#c33', initialX, initialY);
    }

    addTeamMate('tm1', $board.width() / 2, $board.height() / 2);
    addTeamMate('tm2', $board.width() / 2, $board.height() / 2);
    addTeamMate('tm3', $board.width() / 2, $board.height() / 2);
    addTeamMate('tm4', $board.width() / 2, $board.height() / 2);
    addTeamMate('tm5', $board.width() / 2, $board.height() / 2);
    addOppornent('op1', $board.width() / 2, $board.height() / 2);
    addOppornent('op2', $board.width() / 2, $board.height() / 2);
    addOppornent('op3', $board.width() / 2, $board.height() / 2);
    addOppornent('op4', $board.width() / 2, $board.height() / 2);
    addOppornent('op5', $board.width() / 2, $board.height() / 2);

    // Draw Ball
    $board
	.drawArc({
	    name: 'ball',
	    layer: true,
	    draggable: true,
	    bringToFront: true,
	    groups: ['ball-owner'],
	    fillStyle: '#ff0',
	    x: $board.width() / 2, y: $board.height() / 2,
	    radius: op.playerSize / 4,
	    dragstart: function () {
	        letBallGo();
	        var ipa0 = $board.getLayerIndex('penalty-area-0');
	        var ipa1 = $board.getLayerIndex('penalty-area-1');
	        var ipa = Math.max(ipa0, ipa1);
	        $board.moveLayer($ball.name, ipa + 1);
	        $board.drawLayer($ball.name);
	    },
	    dragstop: function () {
	        $board.moveLayer($ball.name, 1000);
	        $board.drawLayer($ball.name);
	        log("The ball moved to (" + $ball.x + ", " + $ball.y + ")");
	    }
	});
    $ball = $board.getLayer('ball');
    letBallGo();

    // Move players to the initial position
    var program = new CanvasProgram();
    program.addTrack('tm1')
    .addFrame({ x: "+=100", y: "+=50" }, 2000)
    .addFrame({ x: "-=20", y: "-=100" }, 2000)
    .addFrame({ x: "-=20", y: "-=100" }, 2000)
    .addFrame({ x: "-=10", y: "-=100" }, 1000);
    program.addTrack('tm2')
    .addFrame({ x: "-=100", y: "+=50" }, 2000)
    .addFrame({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm3')
    .addFrame({ x: "+=100", y: "+=100" }, 2000)
    .addFrame({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm4')
    .addFrame({ x: "-=100", y: "+=100" }, 2000)
    .addFrame({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm5')
    .addFrame({ x: "+=0", y: "+=150" }, 2000)
    .addFrame({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('op1')
    .addFrame({ x: "+=100", y: "-=50" }, 2000);
    program.addTrack('op2')
    .addFrame({ x: "-=100", y: "-=50" }, 2000);
    program.addTrack('op3')
    .addFrame({ x: "+=100", y: "-=100" }, 2000);
    program.addTrack('op4')
    .addFrame({ x: "-=100", y: "-=100" }, 2000);
    program.addTrack('op5')
    .addFrame({ x: "+=0", y: "-=150" }, 2000);

    log('Kick off!');

    $board.canvasPlayer.play(program);
};

// Utility Methods
Math.distance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
};
