$(document).ready(function() {

  var initData = function(type) {
    if (type === 'combos') {
      return [
        '1', '2', '3', '4', '5', '6',
        '3k', '4k', 'fh', 'ss',
        'ls', 'y', 'c'
      ];
    } else if (type === 'boxes') {
      return {
        1: '_', 2: '_', 3: '_', 4: '_', 5: '_', 6: '_',
        '3k': '_', '4k': '_', 'fh': '_', 'ss': '_',
        'ls': '_', 'y': '_', 'c': '_', 'yb': 0
      };
    } else if (type === 'hand') {
      return {
        1: {
          num: 0,
          x: 0,
          y: 0,
          held: false,
          angle: 0
        },
        2: {
          num: 0,
          x: 0,
          y: 0,
          held: false,
          angle: 0
        },
        3: {
          num: 0,
          x: 0,
          y: 0,
          held: false,
          angle: 0
        },
        4: {
          num: 0,
          x: 0,
          y: 0,
          held: false,
          angle: 0
        },
        5: {
          num: 0,
          x: 0,
          y: 0,
          held: false,
          angle: 0
        }
      };
    }
  };

  var playGame = function(combos, boxes, mitzee) {

    var rollDice = function() {
      for (var i = 1; i <= 5; i++) {
        if (!hand[i].held) {
          hand[i].num = Math.floor(Math.random() * 6 + 1);
        }
      }
    };

    var findPlays = function(combos, mitzee) {

      var countDice = function() {
        var counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
        for (var i = 1; i < 7; i++) {
          var count = 0;
          for (var j = 1; j <= 5; j++) {
            if (hand[j].num === i) { count++; }
          }
          counts[i] = count;
          count = 0;
        }
        return counts;
      };

      var isOfKind = function() {
        var highCount = 0;
        var highDice = 0;
        for (var key in counts) {
          if (counts[key] > 2 && counts[key] < 5) {
            if (counts[key] > highCount) {
              highCount = counts[key];
              highDice = key;
            }
          }
        }
        return [[highCount - 1, highDice * (highCount - 1)], [highCount, highDice * highCount]];
      };

      var isFullHouse = function() {
        var two = false;
        var three = false;
        for (var key in counts) {
          if (counts[key] === 2) {
            two = true;
          } else if (counts[key] === 3) {
            three = true;
          }
        }
        return two && three;
      };

      var isStraight = function() {
        var count = 0;
        var highCount = 0;
        for (var i = 1; i < 7; i++) {
          if (counts[i] > 0) {
            count++;
          } else {
            if (count > highCount) { highCount = count; }
            count = 0;
          }
        }
        if (count > highCount) { highCount = count; }
        if (highCount === 4) { return 'small' }
        if (highCount === 5) { return 'large' }
      };

      var isYahtzee = function() {
        for (var key in counts) {
          if (counts[key] === 5) {
            return true;
          }
        }
        return false;
      };

      var countChance = function() {
        var chance = 0;
        for (var key in counts) {
          chance += counts[key] * key;
        }
        return chance;
      };

      var plays = {};
      var counts = countDice();

      for (var key in counts) {
        if (counts[key] > 0) {
          plays[key] = counts[key] * key;
        }
      }
      if (isOfKind(counts)[1][0] === 3) {
        plays['3k'] = isOfKind(counts)[1][1];

      } else if (isOfKind(counts)[1][0] === 4) {
        plays['3k'] = isOfKind(counts)[0][1];
        plays['4k'] = isOfKind(counts)[1][1];
      }
      if (isFullHouse(counts)) {
        plays['fh'] = 25;
      }
      if (isStraight(counts) === 'small') {
        plays['ss'] = 30;

      } else if (isStraight(counts) === 'large') {
        plays['ss'] = 30;
        plays['ls'] = 40;
      }
      if (isYahtzee(counts)) {
        mitzee ? plays['y'] = 100 : plays['y'] = 50;
      }
      if (rolled) {
        plays['c'] = countChance(counts);
      }
      for (var key in plays) {
        if (!combos.includes(key)) {
          delete plays[key];
        }
      }
      return plays;
    };

    var renderGame = function() {

      var generatePositions = function() {
        var grid = [];

        var minX = 75;
        var maxX = 325;
        var minY = 75;
        var maxY = 325;

        for (var i = minX; i <= maxX; i += (maxX - minX) / 2) {
          for (var j = minY; j <= maxY; j += (maxY - minY) / 2) {
            grid.push( [i, j] );
          }
        }
        for (var i = 1; i <= 5; i++) {
          var randPos = grid[ Math.floor(Math.random() * (grid.length - 1)) ];
          grid.splice(grid.indexOf(randPos), 2);

          hand[i].x = randPos[0];
          hand[i].y = randPos[1];
          hand[i].angle = Math.floor(Math.random() * 360);
        }
      }

      var renderBoard = function() {
        $('.canvas-container').remove();

        var $board = $('<canvas id="board" width="400" height="400"></canvas>');
        $board.appendTo($boardContainer);
        var canvas = new fabric.Canvas('board');

        for (var i = 1; i <= 5; i++) {
          if (!hand[i].held) {
            var imgElement = document.getElementById(hand[i].num);
            var imgInstance = new fabric.Image(imgElement, {
              left: hand[i].x,
              top: hand[i].y,
              selectable: true,
              lockMovementY: true,
              lockMovementX: true,
              hasBorders: false,
              hasControls: false,
              hoverCursor: 'pointer',
              angle: hand[i].angle,
              name: i
            });
            imgInstance.scale(0.1);
            canvas.add(imgInstance);
          }
        }
        canvas.on('mouse:down', function(event){
          if (event.target) {
            canvas.remove(event.target);
            var i = event.target.name;
            hand[i].held = true;
            renderHolds();
          }
        });
      }

      var renderHolds = function() {
        $('.holds').remove();
        $('.br').remove();
        $('<br class="br">').appendTo($holdsContainer);

        var holds = [];

        for (var i = 1; i <= 5; i++) {
          if (hand[i].held) {
            holds.push( $('<img name="' + hand[i].num + '" class="holds" id="h' + i + '" src="img/' + hand[i].num + '.png"></img>') );
          }
        }
        for (var i = 0; i < holds.length - 1; i++) {
          if (parseInt(holds[i][0].name) > parseInt(holds[i + 1][0].name)) {
            var item = holds[i];
            holds.splice(i, 1);
            holds.splice(i + 1, 0, item);
            i = -1;
          }
        }
        for (var i = 0; i < holds.length; i++) {
          holds[i].appendTo($holdsContainer);
        }

        $(".holds").click(function() {
          var id = $(this).attr('id');
          hand[id[1]].held = false;
          renderBoard();
          renderHolds();
        });
      }

      var renderRolls = function() {
        $('#reroll').remove();
        $('#rolls').remove();

        var $reroll = $('<div id="reroll">Roll</div>');
        $reroll.appendTo($rollsContainer);

        var $rolls = $('<div id="rolls">' + rolls + ' rolls left</div>');
        $rolls.appendTo($rollsContainer);

        $("#reroll").click(function() {
          if (rolls > 0) {
            rolls--;
            rolled = true;
            rollDice();
            plays = findPlays(combos, mitzee, hand);
            generatePositions();
            renderBoard();
            renderHolds();
            renderRolls();
            renderBoxes();
          }
        });
      }

      var renderBoxes = function() {
        $('#plays').remove();
        $('#boxes').remove();

        var $boxes = $('<div id="boxes"></div>');
        $boxes.appendTo($boxesContainer);

        if (jQuery.isEmptyObject(plays) && rolls === 0) {
          for (var key in boxes) {
            if (boxes[key] === '_') {
              plays[key] = 0;
            }
          }
        }
        for (var key in boxes) {
          if (Object.keys(plays).includes(key)) {
            var $play = $('<div class="play" id="' + key + '"></div>');
            $play.text(key + ' | ' + plays[key]);
            $play.appendTo($boxes);

          } else {
            var $box = $('<div class="box"></div>');
            $box.text(key + ' | ' + boxes[key]);
            $box.appendTo($boxes);
          }
        }

        $(".play").click(function() {
          var id = $(this).attr('id');

          if (id !== 'y') {
            boxes[id] = plays[id];
            combos.splice( combos.indexOf(id) , 1);
          } else if (!mitzee) {
            mitzee = true;
            boxes[id] = plays[id];
          } else {
            boxes['yb'] += 100;
          }

          turns--;
          rolled = false;
          rolls = 3;
          holds = [];
          hand = initData('hand');
          plays = findPlays(combos, mitzee);
          renderGame();
        });
      }

      var renderScore = function(boxes) {
        var uSubTotal, uTotal, lTotal, gTotal, $score;

        uSubTotal = boxes[1] + boxes[2] + boxes[3] +
                    boxes[4] + boxes[5] + boxes[6];

        uSubTotal >= 63 ? uTotal = uSubTotal + 35 : uTotal = uSubTotal;

        lTotal = boxes['3k'] + boxes['4k'] + boxes['fh'] + boxes['ss'] +
                 boxes['ls'] + boxes['y'] + boxes['c'] + boxes['yb'];

        gTotal = uTotal + lTotal;

        $score = $('<div>Upper Total: ' + uTotal + '<br>Lower Total: ' + lTotal +
                   '<br>Grand Total: ' + gTotal + '</div>');

        $('#reroll').remove();
        $('#rolls').remove();
        renderBoxes();
        $score.appendTo($scoreContainer);
      };

      generatePositions();
      renderBoard();
      renderHolds();
      renderRolls();
      renderBoxes();

      if (turns === 0) {
        rolls = 0;
        renderScore(boxes);
      }
    }

    var turns = 13;
    var rolls = 3;
    var rolled = false;
    var hand = initData('hand');
    var plays = findPlays(combos, mitzee);

    renderGame();
  };

  var $boardContainer = $('#board-container');
  var $holdsContainer = $('#holds-container');
  var $rollsContainer = $('#rolls-container');
  var $boxesContainer = $('#boxes-container');
  var $scoreContainer = $('#score-container');

  var combos = initData('combos');
  var boxes = initData('boxes');
  var mitzee = false;

  playGame(combos, boxes, mitzee);
});