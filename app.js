$(document).ready(function() {

  var playGame = function() {

    var newCombos = function() {
      return [
        '1', '2', '3', '4', '5', '6',
        '3k', '4k', 'fh', 'ss',
        'ls', 'y', 'c'
      ]
    };

    var newBoxes = function() {
      return {
        1: '_', 2: '_', 3: '_', 4: '_', 5: '_', 6: '_',
        '3k': '_', '4k': '_', 'fh': '_', 'ss': '_',
        'ls': '_', 'y': '_', 'c': '_', 'yb': 0
      };
    };

    var rollDice = function(num) {
      var i;
      dice = [];
      for (i = 0; i < num; i++) {
        dice.push(Math.floor(Math.random() * 6 + 1));
      }
      for (i = 0; i < dice.length; i++) {
        var $die = $('<span></span>');
        $die.text(dice[i]);
        $die.appendTo($app);
      }
    };

    var countDice = function(hand) {
      var i, j, count;
      counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
      for (i = 1; i < 7; i++) {
        count = 0;
        for (j = 0; j < hand.length; j++) {
          if (hand[j] === i) { count++; }
        }
        counts[i] = count;
        count = 0;
      }
    };

    var findPlays = function(combos, mitzee) {
      var plays = {};
      var key;

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
        return [highCount, highDice * highCount];
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

      for (key in counts) {
        if (counts[key] > 0) {
          plays[key] = counts[key] * key;
        }
      }
      if (isOfKind(counts)[0] === 3) {
        plays['3k'] = isOfKind(counts)[1];
      } else if (isOfKind(counts)[0] === 4) {
        plays['4k'] = isOfKind(counts)[1];
      }
      if (isFullHouse(counts)) {
        plays['fh'] = 25;
      }
      if (isStraight(counts) === 'small') {
        plays['ss'] = 30;
      } else if (isStraight(counts) === 'large') {
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

    var playerTurn = function(combos, boxes, mitzee) {
      var holds = [];
      var rolls = 3;
      var input, play;

      while (true) {

        console.clear();
        console.log('dice:');  console.log(dice);
        console.log('holds:'); console.log(holds);
        console.log('rolls:'); console.log(rolls);
        console.log('plays:'); console.log(plays);
        console.log('boxes:'); console.log(boxes);

        //input = prompt('type h to hold, u to unhold, r to roll, n for none, or choose play: ');

        if (input === 'h') {
          //input = prompt('which die to hold? ');
          holds.push(dice[input - 1]);
          dice.splice(input - 1, 1);

        } else if (input === 'u') {
          //input = prompt('which die to unhold? ');
          dice.push(holds[input - 1]);
          holds.splice(input - 1, 1);

        } else if (input === 'r') {
          if (rolls > 0) {
            rollDice(dice.length);
            countDice(dice.concat(holds));
            plays = findPlays(combos, mitzee);
            rolls--;
          } else {
            console.log('no more rolls');
          }

        } else if (input === 'n') {
          //input = prompt('which box? ');
          if (combos.includes(input)) {
            return [input, 0];
          }

        } else if (combos.includes(input)) {
          play = input;

          if (play === 'y') {
            if (mitzee) {
              return ['yb', boxes['yb'] + 100];
            } else {
              return ['y', 50];
            }
          } else {
            return [play, plays[play]];
          }

        } else {
          console.log('invalid input');
        }
      }
    };

    var scoreGame = function(boxes) {
      var key, uSubTotal, uTotal, lTotal, gTotal;

      for (key in boxes) {
        if (boxes[key] === '_') {
          boxes[key] = 0;
        }
      }

      uSubTotal = boxes[1] + boxes[2] + boxes[3] +
                  boxes[4] + boxes[5] + boxes[6];

      uSubTotal >= 63 ? uTotal = uSubTotal + 35 : uTotal = uSubTotal;

      lTotal = boxes['3k'] + boxes['4k'] + boxes['fh'] + boxes['ss'] +
               boxes['ls'] + boxes['y'] + boxes['c'] + boxes['yb'];

      gTotal = uTotal + lTotal;

      console.log(boxes);
      console.log('Upper Total: ' + uTotal + ' Lower Total: ' + lTotal +
                 ' Grand Total: ' + gTotal);
    };

    var dice, counts, plays, play, i, index;
    var p1Combos = newCombos();
    var p1Boxes = newBoxes();
    var p1Mitzee = false;

    for (i = 1; i <= 13; i++) {
      rollDice(5);
      countDice(dice);
      plays = findPlays(p1Combos, p1Mitzee);
      //play = playerTurn(p1Combos, p1Boxes, p1Mitzee);

      var $counts = $('<div></div>');
      $counts.text(JSON.stringify(counts));
      $counts.appendTo($app);

      var $plays = $('<div></div>');
      $plays.text(JSON.stringify(plays));
      $plays.appendTo($app);

      if (play[0] === 'y' || play[0] === 'yb') {
        p1Boxes[play[0]] =  play[1];
        p1Mitzee = true;

      } else {
        p1Boxes[play[0]] = play[1];
        index = p1Combos.indexOf(play[0]);
        p1Combos.splice(index, 1);
      }
    }
    //scoreGame(p1Boxes);
  };

  var $app = $('#app');

  playGame();

});