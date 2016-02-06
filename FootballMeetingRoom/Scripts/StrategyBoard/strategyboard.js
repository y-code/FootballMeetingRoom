$.fn.footballBoard = function (options) {
    if (!options)
        options = {
            sideMergin: 20,
            lineStyle: '#fff',
            lineWidth: 2,
            playerSize: 20,
            backgroundColor: '#0f0'
        };
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
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + op.playerSize * 6,
	    radius: op.playerSize * 5
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + op.playerSize * 6),
	    radius: op.playerSize * 5
	})
	.drawRect({
	    layer: true,
	    fillStyle: op.backgroundColor,
	    x: $board.width() / 2, y: op.sideMergin + op.playerSize * 9 / 2,
	    width: op.playerSize * 22, height: op.playerSize * 9
	})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + op.playerSize * 9 / 2,
	    width: op.playerSize * 22, height: op.playerSize * 9
	})
	.drawRect({
	    layer: true,
        name: "penalty-area-1",
	    fillStyle: op.backgroundColor,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + op.playerSize * 9 / 2),
	    width: op.playerSize * 22, height: op.playerSize * 9
	})
	.drawRect({
	    layer: true,
	    name: "penalty-area-0",
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + op.playerSize * 9 / 2),
	    width: op.playerSize * 22, height: op.playerSize * 9
	})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: op.sideMergin + op.playerSize * 3 / 2,
	    width: op.playerSize * 3 * 4, height: op.playerSize * 3
	})
	.drawRect({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + op.playerSize * 3 / 2),
	    width: op.playerSize * 3 * 4, height: op.playerSize * 3
	})
	.drawArc({
	    layer: true,
	    fillStyle: op.lineStyle,
	    x: $board.width() / 2, y: op.sideMergin + op.playerSize * 6,
	    radius: op.playerSize / 4
	})
	.drawArc({
	    layer: true,
	    fillStyle: op.lineStyle,
	    x: $board.width() / 2, y: $board.height() - (op.sideMergin + op.playerSize * 6),
	    radius: op.playerSize / 4
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: op.sideMergin, y: op.sideMergin,
	    start: 90, end: 180,
	    radius: op.playerSize
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() - op.sideMergin, y: op.sideMergin,
	    start: 180, end: 270,
	    radius: op.playerSize
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() - op.sideMergin, y: $board.height() - op.sideMergin,
	    start: 270, end: 0,
	    radius: op.playerSize
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: op.sideMergin, y: $board.height() - op.sideMergin,
	    start: 0, end: 90,
	    radius: op.playerSize
	})
	.drawArc({
	    layer: true,
	    strokeStyle: op.lineStyle,
	    strokeWidth: op.lineWidth,
	    x: $board.width() / 2, y: $board.height() / 2,
	    radius: op.playerSize * 5
	})
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
		    groups: ['players', group],
		    dragGroups: [name],
		    fillStyle: rgb,
		    x: initialX, y: initialY,
		    radius: op.playerSize / 2,
		    mouseover: getBall,
		    dragstart: function (layer) {
		        $board.moveLayer($ball.name, 1000);
		        $board.drawLayer($ball.name);
		    },
		    dragstop: function (layer) {
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
    $board
	.animateLayerGroup('players', {
	    x: function (layer) {
	        switch (layer.name) {
	            case 'tm1':
	                return '+=100';
	            case 'tm2':
	                return '-=100';
	            case 'tm3':
	                return '+=200';
	            case 'tm4':
	                return '-=200';
	            case 'tm5':
	                return '+=0';
	            case 'op1':
	                return '+=100';
	            case 'op2':
	                return '-=100';
	            case 'op3':
	                return '+=200';
	            case 'op4':
	                return '-=200';
	            case 'op5':
	                return '+=0';
	        }
	    },
	    y: function (layer) {
	        switch (layer.name) {
	            case 'tm1':
	                return '+=100';
	            case 'tm2':
	                return '+=100';
	            case 'tm3':
	                return '+=200';
	            case 'tm4':
	                return '+=200';
	            case 'tm5':
	                return '+=270';
	            case 'op1':
	                return '-=100';
	            case 'op2':
	                return '-=100';
	            case 'op3':
	                return '-=200';
	            case 'op4':
	                return '-=200';
	            case 'op5':
	                return '-=270';
	        }
	    }
	}, 2000);

    log('Kick off!');
};

// Utility Methods
Math.distance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
};
