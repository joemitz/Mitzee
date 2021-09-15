$(document).ready(function() {

  var playGame = function() {

    var initData = function() {
      return [
        [
          '1', '2', '3', '4', '5', '6',
          '3k', '4k', 'fh', 'ss',
          'ls', 'y', 'c'
        ],
        {
          1: '_', 2: '_', 3: '_', 4: '_', 5: '_', 6: '_',
          '3k': '_', '4k': '_', 'fh': '_', 'ss': '_',
          'ls': '_', 'y': '_', 'c': '_', 'yb': 0
        }
      ];
    };

    var playerTurn = function(combos, boxes, mitzee) {

      var rollDice = function(num) {
        var dice = [];
        for (var i = 0; i < num; i++) {
          dice.push(Math.floor(Math.random() * 6 + 1));
        }
        return dice;
      };

      var findPlays = function(combos, mitzee, hand) {
        var plays = {};
        var key, counts;

        var countDice = function() {
          var i, j, count, counts;
          counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
          for (i = 1; i < 7; i++) {
            count = 0;
            for (j = 0; j < hand.length; j++) {
              if (hand[j] === i) { count++; }
            }
            counts[i] = count;
            count = 0;
          }
          return counts;
        };

        var isOfKind = function() {
          var highCount = 0;
          var highDice = 0;
          var key;
          for (key in counts) {
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
          var key;
          for (key in counts) {
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
          var i;
          for (i = 1; i < 7; i++) {
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
          var key;
          for (key in counts) {
            if (counts[key] === 5) {
              return true;
            }
          }
          return false;
        };

        var countChance = function() {
          var key;
          var chance = 0;
          for (key in counts) {
            chance += counts[key] * key;
          }
          return chance;
        };

        counts = countDice();

        for (key in counts) {
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
        plays['c'] = countChance(counts);

        for (key in plays) {
          if (!combos.includes(key)) {
            delete plays[key];
          }
        }
        return plays;
      };

      var renderGame = function() {

        var removeElements = function() {
          $('.canvas-container').remove();
          $('.br').remove();
          $('.dice').remove();
          $('.holds').remove();
          $('#reroll').remove();
          $('#rolls').remove();
          $('#plays').remove();
          $('#boxes').remove();
        }

        var renderBoard = function() {

          var $board = $('<canvas id="board" width="300" height="300"></canvas>');
          $board.appendTo($app);

          var canvas = new fabric.Canvas('board');

          canvas.on('mouse:down', function(event){
            if (event.target) {
              var i = event.target.name;
              holds.push(dice[i]);
              dice.splice(i, 1);
              renderGame();
            }
          });

          var minX = 3;
          var maxX = 255;
          var minY = 0;
          var maxY = 255;

          var margin = 10;

          var minX = minX + margin;
          var maxX = maxX - margin;
          var minY = minY + margin;
          var maxY = maxY - margin;

          var positions = [];

          for (var i = minX; i <= maxX; i += (maxX - minX) / 4) {
            for (var j = minY; j <= maxY; j += (maxY - minY) / 4) {
              positions.push( [i, j] );
            }
          }
          setTimeout(function () {
            for (var i = 0; i < dice.length; i++) {

              var rand = positions[ Math.floor(Math.random() * (positions.length - 1)) ];
              var index = positions.indexOf(rand);
              positions.splice(index, 2);
              var randX = Math.floor(Math.random() * ((rand[0] + margin) - (rand[0] - margin)) + (rand[0] - margin));
              var randY = Math.floor(Math.random() * ((rand[1] + margin) - (rand[1] - margin)) + (rand[1] - margin));

              var imgElement = document.getElementById(dice[i]);
              var imgInstance = new fabric.Image(imgElement, {
                left: randX,
                top: randY,
                selectable: true,
                lockMovementY: true,
                lockMovementX: true,
                hasBorders: false,
                hasControls: false,
                hoverCursor: 'pointer'
              });
              imgInstance.scale(0.1);
              canvas.add(imgInstance);
              imgInstance.name = i;
            }
          }, 25);
        }

        var renderHolds = function() {
          $('<br class="br">').appendTo('#app');

          for (var i = 0; i < holds.length; i++) {
            var $hold = $('<img class="holds" id="h' + i + '" src="img/' + holds[i] + '.png"></img>');
            $hold.appendTo($app);
          }
        }

        var renderDice = function() {
          $('<br class="br">').appendTo('#app');

          for (var i = 0; i < dice.length; i++) {
            var $die = $('<span class="dice" id="d' + i + '"></span>');
            $die.text(dice[i]);
            $die.appendTo($app);
          }

          $('<br class="br">').appendTo('#app');

          for (var i = 0; i < holds.length; i++) {
            var $hold = $('<span class="holds" id="h' + i + '"></span>');
            $hold.text(holds[i]);
            $hold.appendTo($app);
          }
        }

        var renderRolls = function() {
          var $reroll = $('<div id="reroll">Roll</div>');
          $reroll.appendTo($app);

          var $rolls = $('<div id="rolls">' + rolls + ' rolls left</div>');
          $rolls.appendTo($app);

          $('<br class="br">').appendTo('#app');
        }

        var renderBoxes = function() {
          if (jQuery.isEmptyObject(plays) && rolls === 0) {
            for (var key in boxes) {
              if (boxes[key] === '_') {
                plays[key] = 0;
              }
            }
          }

          var $boxes = $('<div id="boxes"></div>');
          $boxes.appendTo($app);

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
        }

        var renderScore = function(boxes) {
          var uSubTotal, uTotal, lTotal, gTotal;

          uSubTotal = boxes[1] + boxes[2] + boxes[3] +
                      boxes[4] + boxes[5] + boxes[6];

          uSubTotal >= 63 ? uTotal = uSubTotal + 35 : uTotal = uSubTotal;

          lTotal = boxes['3k'] + boxes['4k'] + boxes['fh'] + boxes['ss'] +
                   boxes['ls'] + boxes['y'] + boxes['c'] + boxes['yb'];

          gTotal = uTotal + lTotal;

          var $score = $('<br><div>Upper Total: ' + uTotal + '<br>Lower Total: ' + lTotal +
                        '<br>Grand Total: ' + gTotal + '</div>');
          $score.appendTo($app);
        };

        removeElements();
        renderBoard();
        renderHolds();
        //renderDice();
        renderRolls();
        renderBoxes();

        if (turns === 0) { renderScore(boxes); }

        $(".play").click(function() {

            var id = $(this).attr('id');

            if (id !== 'y') {
              boxes[id] = plays[id];
              var index = combos.indexOf(id);
              combos.splice(index, 1);
            } else if (!mitzee) {
              mitzee = true;
              boxes[id] = plays[id];
            } else {
              boxes['yb'] += 100;
            }

            holds = [];
            rolls = 2;
            dice = rollDice(5);
            plays = findPlays(combos, mitzee, dice);

            turns--;
            renderGame();
        });

        $("#reroll").click(function() {
          if (rolls > 0) {
            rolls--;
            dice = rollDice(dice.length);
            hand = dice.concat(holds);
            plays = findPlays(combos, mitzee, hand);
            renderGame();
          }
        });

        $(".dice").click(function() {
          var id = $(this).attr('id');
          holds.push(dice[id[1]]);
          var index = id[1];
          dice.splice(index, 1);
          renderGame();
        });

        $(".holds").click(function() {
          var id = $(this).attr('id');
          dice.push(holds[id[1]]);
          var index = id[1];
          holds.splice(index, 1);
          renderGame();
        });
      }

      var turns = 13;
      var holds = [];
      var rolls = 2;
      var hand, dice, plays;

      dice = rollDice(5);
      plays = findPlays(combos, mitzee, dice);

      renderGame();
    };

    var p1Combos = initData()[0];
    var p1Boxes = initData()[1];
    var p1Mitzee = false;

    playerTurn(p1Combos, p1Boxes, p1Mitzee);

  };
  var $app = $('#app');
  playGame();
});