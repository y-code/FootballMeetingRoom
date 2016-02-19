
// Utility Methods
Math.distance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
};

var CanvasPlayerCommand = function (properties, duration) {
    this.properties = properties;
    this.duration = duration;
}

var CanvasPlayerTrack = function (layerGroupName) {
    this.layerGroupName = layerGroupName;
    this.commands = [];
}
$.extend(CanvasPlayerTrack.prototype, {
    addCommand: function (properties, duration) {
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

var CanvasPlayer = function (footballBoard) {
    this.board = footballBoard;
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
        var board = this.board;
        function executeCommand (trackName) {
            var track = program.tracks[trackName];
            var command = track.commands[commandIndexes[trackName]];
            var iOfCompleteCallback = 0;
            board.movePlayer(track.layerGroupName, command.properties, {
                duration: command.duration,
                complete: function (layer) {
                    if (iOfCompleteCallback++)
                        return;

                    commandIndexes[trackName]++;
                    if (commandIndexes[trackName] < Object.keys(track.commands).length)
                        executeCommand(trackName);
                }
            });
        }

        for (var trackName in program.tracks)
            executeCommand(trackName);
    }
});

var FootballBoard = function ($canvas, options) {
    var fb = this;
    this.$canvas = $canvas;
    this.options = {
        sideMergin: 20,
        lineStyle: '#fff',
        lineWidth: 2,
        playerSize: 20,
        backgroundColor: '#0f0',
        width: 400,
        height: 500,
        PlayerStateMoving: {
            strokeStyle: '#fff',
            strokeWidth: 2
        },
        PlayerStateStop: {
            strokeWidth: 0
        }
    };
    $.extend(this.options, options);

    this.$canvas
    .attr("width", "" + this.options.width)
    .attr("height", "" + this.options.height)
    .css("width", "" + this.options.width)
    .css("height", "" + this.options.height);

    this.logPanel = $("#log");
    this.logList = null;
    if (this.logPanel.length) {
        $("<div/>").insertBefore(this.logPanel).css({
            height: this.logPanel.height(),
            width: "100%"
        });
        this.logList = $("<ol/>").appendTo(this.logPanel);
    }

    this.$canvas
	.css({
	    backgroundColor: this.options.backgroundColor
	})
	.drawRect({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.options.sideMergin, y: this.options.sideMergin,
	    width: this.$canvas.width() - this.options.sideMergin * 2, height: this.$canvas.height() - this.options.sideMergin * 2,
	    fromCenter: false
	})
    // Penalty Arcs
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.options.sideMergin + this.$canvas.height() * 3 / 25 * 5 / 6,
	    radius: this.$canvas.width() / 10
	})
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.$canvas.height() - (this.options.sideMergin + this.$canvas.height() * 3 / 25 * 5 / 6),
	    radius: this.$canvas.width() / 10
	})
    // Penalty Area
	.drawRect({
	    name: "penalty-area-0",
	    layer: true,
	    fillStyle: this.options.backgroundColor,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.options.sideMergin + this.$canvas.height() * 9 / 50 * 5 / 6 / 2,
	    width: this.$canvas.width() * 11 / 25, height: this.$canvas.height() * 9 / 50 * 5 / 6
	})
	.drawRect({
	    layer: true,
	    name: "penalty-area-1",
	    fillStyle: this.options.backgroundColor,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.$canvas.height() - (this.options.sideMergin + this.$canvas.height() * 9 / 50 * 5 / 6 / 2),
	    width: this.$canvas.width() * 11 / 25, height: this.$canvas.height() * 9 / 50 * 5 / 6
	})
	.drawRect({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.options.sideMergin + this.$canvas.height() * 3 / 50 * 5 / 6 / 2,
	    width: this.$canvas.width() / 5, height: this.$canvas.height() * 3 / 50 * 5 / 6
	})
	.drawRect({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.$canvas.height() - (this.options.sideMergin + this.$canvas.height() * 3 / 50 * 5 / 6 / 2),
	    width: this.$canvas.width() / 5, height: this.$canvas.height() * 3 / 50 * 5 / 6
	})
    // Penalty Spots
	.drawArc({
	    layer: true,
	    fillStyle: this.options.lineStyle,
	    x: this.$canvas.width() / 2, y: this.options.sideMergin + this.$canvas.height() * 3 / 25 * 5 / 6,
	    radius: this.$canvas.width() / 100
	})
	.drawArc({
	    layer: true,
	    fillStyle: this.options.lineStyle,
	    x: this.$canvas.width() / 2, y: this.$canvas.height() - (this.options.sideMergin + this.$canvas.height() * 3 / 25 * 5 / 6),
	    radius: this.$canvas.width() / 100
	})
    // Corners
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.options.sideMergin, y: this.options.sideMergin,
	    start: 90, end: 180,
	    radius: this.$canvas.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() - this.options.sideMergin, y: this.options.sideMergin,
	    start: 180, end: 270,
	    radius: this.$canvas.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() - this.options.sideMergin, y: this.$canvas.height() - this.options.sideMergin,
	    start: 270, end: 0,
	    radius: this.$canvas.width() / 50
	})
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.options.sideMergin, y: this.$canvas.height() - this.options.sideMergin,
	    start: 0, end: 90,
	    radius: this.$canvas.width() / 50
	})
    // Center Circle
	.drawArc({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x: this.$canvas.width() / 2, y: this.$canvas.height() / 2,
	    radius: (this.$canvas.width() / 10 + this.$canvas.height() / 10 * 5 / 6) / 2
	})
    // Center Line
	.drawLine({
	    layer: true,
	    strokeStyle: this.options.lineStyle,
	    strokeWidth: this.options.lineWidth,
	    x1: this.options.sideMergin, y1: this.$canvas.height() / 2,
	    x2: this.$canvas.width() - this.options.sideMergin, y2: this.$canvas.height() / 2
	});

    // Draw Ball
    this.$canvas
	.drawArc({
	    name: 'ball',
	    layer: true,
	    draggable: true,
	    bringToFront: true,
	    groups: ['ball-owner'],
	    fillStyle: '#999',
	    x: this.$canvas.width() / 2, y: this.$canvas.height() / 2,
	    radius: this.options.playerSize / 4,
	    dragstart: function () {
	        fb.letBallGo();
	    },
	    dragstop: function () {
	        fb.log("The ball moved to (" + fb.ball.x + ", " + fb.ball.y + ")");
	    }
	});
    this.ball = this.$canvas.getLayer('ball');
    this.letBallGo();

    this.freeBall = null;
    this.ballOwner = null;
    this.players = [];
    this.teamMates = [];
    this.oppornents = [];

    this.boardPlayer = new CanvasPlayer(this);
};
$.extend(FootballBoard.prototype, {
    log: function (msg) {
        if (this.logList) {
            this.logList.append($("<li/>").html(msg));
            this.logPanel.animate({ scrollTop: this.logPanel.prop("scrollHeight") }, 1000);
        }
    },
    setPlayerStateMoving: function (layerName) {
        this.$canvas.animateLayer(layerName, this.options.PlayerStateMoving, 250);
        this.$canvas.moveLayer("ball", this.$canvas.getLayerIndex(layerName));
        this.$canvas.drawLayer("ball");
    },
    setPlayerStateStop: function (layerName) {
        this.$canvas.animateLayer(layerName, this.options.PlayerStateStop, 250);
    },
    movePlayer: function (layerGroupName, properties, duration) {
        this.setPlayerStateMoving(layerGroupName);

        this.$canvas.animateLayerGroup(layerGroupName, properties, duration);

        this.setPlayerStateStop(layerGroupName);
    },
    letBallGo: function () {
        if (this.freeBall)
            return;

        if (this.ballOwner != null) {
            this.log(this.ballOwner.name + ' released a ball.');

            this.$canvas.removeLayerFromGroup(this.ball.name, this.ballOwner.name);
            this.ballOwner = null;
        }

        this.freeBall = this.ball;
    },
    getBall: function (layerName) {
        if (!this.freeBall)
            return;

        var layer = this.$canvas.getLayer(layerName)
        if ($.inArray(layer.name, this.ball.groups) >= 0)
            return;

        function distance(layer0, layer1) {
            return Math.distance(layer0.x, layer0.y, layer1.x, layer1.y);
        }

        if (distance(layer, this.ball) > layer.radius + this.ball.radius)
            return;

        this.ballOwner = layer;

        this.log(layer.name + ' got a ball');
        if (this.ballOwner != null)
            this.letBallGo(layer);
        this.$canvas.addLayerToGroup(this.freeBall.name, this.ballOwner.name);

        this.freeBall = null;
    },
    addPlayer: function (name, group, rgb, initialX, initialY) {
        var fb = this;
        this.$canvas
        .drawArc({
            name: name,
            layer: true,
            draggable: true,
            bringToFront: true,
            groups: ['players', group, name],
            dragGroups: [name],
            fillStyle: rgb,
            x: initialX, y: initialY,
            radius: this.options.playerSize / 2,
            click: function(layer) {
                fb.getBall(layer.name);
            },
            dragstart: function (layer) {
                fb.setPlayerStateMoving(layer.name);
            },
            dragstop: function (layer) {
                fb.setPlayerStateStop(layer.name);
                fb.log("Player " + layer.name + " moved to (" + layer.x + ", " + layer.y + ")");
            }
        });
        this.players.push(this.$canvas.getLayer(name));
        return this;
    },
    addTeamMate: function (name, initialX, initialY) {
        this.addPlayer(name, 'teammate', '#36c', initialX, initialY);
        this.teamMates.push(this.$canvas.getLayer(name));
    },
    addOppornent: function (name, initialX, initialY) {
        this.addPlayer(name, 'oppornent', '#c33', initialX, initialY);
        this.oppornents.push(this.$canvas.getLayer(name));
    }
});


$.fn.initializeFootballBoard = function (options) {
    var fb = new FootballBoard($(this), options);

    fb.addTeamMate('tm1', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm2', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm3', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm4', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm5', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm6', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm7', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm8', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm9', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm10', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addTeamMate('tm11', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op1', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op2', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op3', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op4', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op5', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op6', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op7', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op8', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op9', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op10', fb.$canvas.width() / 2, fb.$canvas.height() / 2);
    fb.addOppornent('op11', fb.$canvas.width() / 2, fb.$canvas.height() / 2);

    // Move players to the initial position
    var program = new CanvasProgram();
    program.addTrack('tm1')
    .addCommand({ x: "+=100", y: "+=40" }, 2000)
    //.addCommand({ x: "-=20", y: "-=100" }, 2000)
    //.addCommand({ x: "-=20", y: "-=100" }, 2000)
    //.addCommand({ x: "-=10", y: "-=100" }, 1000);
    program.addTrack('tm2')
    .addCommand({ x: "-=0", y: "+=20" }, 2000)
    program.addTrack('tm3')
    .addCommand({ x: "-=100", y: "+=40" }, 2000)
    //.addCommand({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm4')
    .addCommand({ x: "+=60", y: "+=110" }, 2000)
    //.addCommand({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm5')
    .addCommand({ x: "-=0", y: "+=70" }, 2000)
    program.addTrack('tm6')
    .addCommand({ x: "-=60", y: "+=110" }, 2000)
    //.addCommand({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('tm7')
    .addCommand({ x: "+=130", y: "+=150" }, 2000)
    program.addTrack('tm8')
    .addCommand({ x: "+=40", y: "+=160" }, 2000)
    program.addTrack('tm9')
    .addCommand({ x: "-=40", y: "+=160" }, 2000)
    program.addTrack('tm10')
    .addCommand({ x: "-=130", y: "+=150" }, 2000)
    program.addTrack('tm11')
    .addCommand({ x: "+=0", y: "+=220" }, 2000)
    //.addCommand({ x: "+=20", y: "-=100" }, 3000);
    program.addTrack('op1')
    .addCommand({ x: "+=100", y: "-=40" }, 2000)
    program.addTrack('op2')
    .addCommand({ x: "-=0", y: "-=20" }, 2000)
    program.addTrack('op3')
    .addCommand({ x: "-=100", y: "-=40" }, 2000)
    program.addTrack('op4')
    .addCommand({ x: "+=60", y: "-=110" }, 2000)
    program.addTrack('op5')
    .addCommand({ x: "-=0", y: "-=70" }, 2000)
    program.addTrack('op6')
    .addCommand({ x: "-=60", y: "-=110" }, 2000)
    program.addTrack('op7')
    .addCommand({ x: "+=130", y: "-=150" }, 2000)
    program.addTrack('op8')
    .addCommand({ x: "+=40", y: "-=160" }, 2000)
    program.addTrack('op9')
    .addCommand({ x: "-=40", y: "-=160" }, 2000)
    program.addTrack('op10')
    .addCommand({ x: "-=130", y: "-=150" }, 2000)
    program.addTrack('op11')
    .addCommand({ x: "+=0", y: "-=220" }, 2000)

    fb.log('Kick off!');

    fb.boardPlayer.play(program);

    return fb;
};

