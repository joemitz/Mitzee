import { findPlays } from './findPlays.js';
import { newCombos, newBoxes } from './initData.js';
import promptSync from 'prompt-sync';
var prompt = promptSync();

var p1Combos, p1Boxes, p1Yahtzee, dice, counts, plays;

var playGame = function() {
  p1Combos = newCombos();
  p1Boxes = newBoxes();
  p1Yahtzee = false;
  var play, i, index;

  for (i = 1; i <= 13; i++) {

    rollDice(5);
    countDice(dice);
    plays = findPlays(p1Combos, p1Yahtzee, counts);
    play = playerTurn(p1Combos, p1Boxes, p1Yahtzee);

    if (play[0] === 'y') {
      if (!p1Yahtzee) {
        p1Boxes['y'] = 50;
        p1Yahtzee = true;
      } else {
        if (p1Boxes['yb'] === '_') {
          p1Boxes['yb'] = 100;
        } else {
          p1Boxes['yb'] += 100;
        }
      }

    } else {
      p1Boxes[play[0]] = play[1];
      index = p1Combos.indexOf(play[0]);
      p1Combos.splice(index, 1);
    }
  }
};

var playerTurn = function(combos, boxes, yahtzee) {
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

    input = prompt('type h to hold, u to unhold, r to roll, n for none, or choose play: ');

    if (input === 'h') {
      input = prompt('which die to hold? ');
      holds.push(dice[input - 1]);
      dice.splice(input - 1, 1);

    } else if (input === 'u') {
      input = prompt('which die to unhold? ');
      dice.push(holds[input - 1]);
      holds.splice(input - 1, 1);

    } else if (input === 'r') {
      if (rolls > 0) {
        rollDice(dice.length);
        countDice(dice.concat(holds));
        plays = findPlays(combos, yahtzee, counts);
        rolls--;
      } else {
        console.log('no more rolls');
      }

    } else if (input === 'n') {
      input = prompt('which box? ');
      if (combos.includes(input)) {
        return [input, 0];
      }

    } else if (combos.includes(input)) {
      play = input;
      return [play, plays[play]];

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

playGame();