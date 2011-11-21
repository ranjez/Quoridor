// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
$(function() {
	initBoard();
	bindFenceEventHandlers();

	var player1, player2, moves;

	function getAdjacentFence(fence) {
		if($(fence).hasClass('horizontal')) {
			return $(fence).next();
		} else {
			adjacentIndex = parseInt($(fence).attr('id').split('_')[1]) + 17;
			return $($('.fence')[adjacentIndex]);
		}
	}

	function initBoard() {
		var board = $('#board');
		var xSquares = 9;
		var ySquares = 9;

		var i = 0;
		var j = 0;

		for(i; i < ySquares; i++) {
			if(i != 0) {
				for(j = 0; j < xSquares; j++) {
					var horizontalFence = $('<div class="fence horizontal" />')
					if(j == 0) {
						horizontalFence.addClass('left');
					}
					if(j == 8) {
						horizontalFence.addClass('right');
					}
					board.append(horizontalFence);
				}
			}
			for( j = 0; j < xSquares; j++) {
				var square = $('<div class="square" />')
				if(j != 0) {
					var fence = $('<div class="fence" />')
					board.append(fence);
				}
				board.append(square);
			}
		}
	}

	function initPlayers() {
		player1 = new Object();
		player2 = new Object();
		player1.name = "Player 1";
		player1.pos = "square_4";
		player2.name = "Player 2";
		player2.pos = "square_76";
	}

	function bindFenceEventHandlers() {
		$('.fence').each(function(i, v) {
			$(v).attr('id', 'fence_' + i);
		});
		$('.fence').hover(function() {
			$(this).addClass('selected');
			getAdjacentFence(this).addClass('selected');
		}, function() {
			$(this).removeClass('selected');
			getAdjacentFence(this).removeClass('selected');
		});
	}

});
