var dice, counts, plays;

var playGame = function() {
  var play, i, index;
  var p1Combos = newCombos();
  var p1Boxes = newBoxes();
  var p1Mitzee = false;
  // var p2Combos = newCombos();
  // var p2Boxes = newBoxes();
  // var p2Mitzee = false;

  for (i = 1; i <= 13; i++) {
    rollDice(5);
    countDice(dice);
    plays = findPlays(p1Combos, p1Mitzee);
    play = playerTurn(p1Combos, p1Boxes, p1Mitzee);

    if (play[0] === 'y' || play[0] === 'yb') {
      p1Boxes[play[0]] =  play[1];
      p1Mitzee = true;

    } else {
      p1Boxes[play[0]] = play[1];
      index = p1Combos.indexOf(play[0]);
      p1Combos.splice(index, 1);
    }
    // player 2 turn
    /*
    rollDice(5);
    countDice(dice);
    plays = findPlays(p2Combos, p2Mitzee, counts);
    play = playerTurn(p2Combos, p2Boxes, p2Mitzee);

    if (play[0] === 'y' || play[0] === 'yb') {
      p1Boxes[play[0]] =  play[1];
      p2Mitzee = true;

    } else {
      p2Boxes[play[0]] = play[1];
      index = p2Combos.indexOf(play[0]);
      p2Combos.splice(index, 1);
    }
    */
  }
  console.clear();
  scoreGame(p1Boxes);
  //scoreGame(p2Boxes);
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
}

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

var rollDice = function(num) {
  var i;
  dice = [];
  for (i = 0; i < num; i++) {
    dice.push(Math.floor(Math.random() * 6 + 1));
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
}

//playGame();