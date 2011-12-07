var Quoridor = new function() {
	this.boardDimension = 9;
	this.startingFences = 10;
	this.player1=null;
	this.player2=null;
	this.moves=null;
	this.currentTurn = null;
	this.init = function(board){
		var board = $(board);
		
		for(var i = 0; i < this.boardDimension; i++) {
			if(i != 0) {
				for(var j = 0; j < this.boardDimension; j++) {
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
			for( var j = 0; j < this.boardDimension; j++) {
				var squareNumber = (i * this.boardDimension) + j;
				var square = $('<div id="square_' + squareNumber + '" class="square" />')
				if(j != 0) {
					var fence = $('<div class="fence" />')
					board.append(fence);
				}
				board.append(square);
			}
		}
		initPlayers();
		bindSquareEventHandlers();
		bindFenceEventHandlers();		
		updateInformation();
		board.after(Information.getPanel());
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
		$('.fence').click(function() {
			placeFence(this);
		});
	}
	function bindSquareEventHandlers () {
		$('.square').click(function() {
			var newPosition = parseInt($(this).attr('id').split('_')[1]);
			movePlayer(newPosition);
		});
	}
	 function initPlayers () {
		this.player1 = new Player("Player 1", 4, "player_1", Quoridor.startingFences);
		this.player2 = new Player("Player 2", 76, "player_2", Quoridor.startingFences);
		
		currentTurn = this.player1;
		
		updatePlayerPosition(this.currentTurn.pos);
		switchPlayer();
		updatePlayerPosition(this.currentTurn.pos);
		switchPlayer();		
	}
	
	function movePlayer (newPosition){
		if(isPossibleMove(newPosition)){
			updatePlayerPosition(newPosition);
			switchPlayer();
		}
	}
	
	function isPossibleMove (newPosition){
		//TODO:player moving logic
		return isAdjacentSquare(newPosition);
	}
	
	function isAdjacentSquare(newPosition){
		var isAdjacentSquare = false;
		var adjacentSquares = getAdjacentSquares();
		$.each(adjacentSquares,function(i, v){
			if(newPosition == v){
				isAdjacentSquare = true;
			}
		});
		return isAdjacentSquare;
	}
	
	function getAdjacentSquares(){
		var adjacentSquares = [];
		getAdjacentVerticalSquares(adjacentSquares);
		getAdjacentHorizontalSquares(adjacentSquares);
		return adjacentSquares;
	}
	
	function getAdjacentVerticalSquares(adjacentSquares){	
		var boardDimension = Quoridor.boardDimension;
		if(currentTurn.pos < boardDimension){
			adjacentSquares.push(currentTurn.pos + boardDimension);
		}
		else if(currentTurn.pos > (boardDimension * boardDimension)-boardDimension){
			adjacentSquares.push(currentTurn.pos - boardDimension);
		}
		else
		{
			adjacentSquares.push(currentTurn.pos + boardDimension);
			adjacentSquares.push(currentTurn.pos - boardDimension);
		}
	}
	
	function getAdjacentHorizontalSquares(adjacentSquares){	
		if(currentTurn.pos % 9 == 0){
			adjacentSquares.push(currentTurn.pos + 1);
		}
		else if(currentTurn.pos % 9 == 8){
			adjacentSquares.push(currentTurn.pos - 1);
		}
		else
		{
			adjacentSquares.push(currentTurn.pos + 1);
			adjacentSquares.push(currentTurn.pos - 1);
		}
	}
	
	function updatePlayerPosition (position){	
		this.currentTurn.pos = position;
		var playerDiv = $('<div id="' + this.currentTurn.id + '" />');
		$('#' + this.currentTurn.id).remove();
		$('#square_' + position).append(playerDiv);
	}
	
	function getAdjacentFence (fence) {
		if($(fence).hasClass('horizontal')) {
			return $(fence).next();
		} else {
			adjacentIndex = parseInt($(fence).attr('id').split('_')[1]) + 17;
			return $($('.fence')[adjacentIndex]);
		}
	}
	
	function isFencePlaceable (fence) {
		//TODO:fence placing logic
		return hasFencesRemaining();
	}
	
	function hasFencesRemaining(){
		return this.currentTurn.fencesRemaining > 0;
	}
	
	function placeFence (fence) {
		if(isFencePlaceable(fence)){
			$(fence).addClass('placed');
			getAdjacentFence(fence).addClass('placed');
			this.currentTurn.fencesRemaining--;
			switchPlayer();
		}
	}

	function updateInformation(){
		Information.currentTurn.text(this.currentTurn.name);
		Information.player1FencesRemaining.text(this.player1.fencesRemaining);
		Information.player2FencesRemaining.text(this.player2.fencesRemaining);
	}
	
	function switchPlayer(){
		if(this.currentTurn == this.player1){
			this.currentTurn = this.player2;
		}
		else{
			this.currentTurn = this.player1;
		}
		updateInformation();
	}
};

var Information = new function(){
	this.panel = $('<div id="info" />');
	this.currentTurn = $('<div id="currentTurn" />');
	this.player1FencesRemaining = $('<div id="player1FencesRemaining" />');
	this.player2FencesRemaining = $('<div id="player2FencesRemaining" />'); 
	this.getPanel = function(){
		this.panel.append(this.currentTurn);
		this.panel.append(this.player1FencesRemaining);
		this.panel.append(this.player2FencesRemaining);
		return this.panel;
	}
	
}

function Player(name, position, id, fences){
	this.name = name;
	this.pos = position;
	this.id = id;
	this.fencesRemaining = fences;
}

$(function() {
	Quoridor.init('#board');
});
