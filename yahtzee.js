var playGame = function() {
  var p1Combos = newCombos();
  //var p2Combos = newCombos();
  var p1Boxes = newBoxes();
  //var p2Boxes = newBoxes();

  for (var i = 1; i <= 13; i++) {

    // player 1 turn
    var dice = rollDice(5);
    var counts = countDice(dice);
    var plays = findPlays(counts, p1Combos);

    var play = playerTurn(dice, plays, p1Combos, p1Boxes);
    p1Boxes[play[0]] = play[1];
    var index = p1Combos.indexOf(play[0]);
    p1Combos.splice(index, 1);

    // player 2 turn

  }
};

var playerTurn = function(dice, plays, combos, boxes) {
  const prompt = require('prompt-sync')();
  var holds = [];
  var rolls = 3;

  while (true) {
    console.clear();
    console.log('dice:');  console.log(dice);
    console.log('holds:'); console.log(holds);
    console.log('rolls:'); console.log(rolls);
    console.log('plays:'); console.log(plays);
    console.log('boxes:'); console.log(boxes);

    var input = prompt('type h to hold, r to roll, n for none, or type play: ');

    if (input === 'h') {
      var hold = prompt('which die to hold? ');
      holds.push(dice[hold - 1]);
      dice.splice(hold - 1, 1);

    } else if (input === 'r') {
      if (rolls > 0) {
        dice = rollDice(dice.length);
        var counts = countDice(dice.concat(holds));
        var plays = findPlays(counts, combos);
      } else {
        console.log('no more rolls');
      }
      rolls--;

    } else if (input === 'n') {
      // ask: which box?
      // return selected box and 0

    } else if (combos.includes(input)) {
      var play = input;
      return [play, plays[play]];

    } else {
      console.log('invalid');
    }
  }
};

var newCombos = function() {
  return [
    '1', '2', '3', '4', '5', '6',
    'threeOfAKind', 'fourOfAKind',
    'fullHouse', 'smallStraight',
    'largeStraight', 'yahtzee', 'chance'
  ]
};

var newBoxes = function() {
  return {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    threeOfAKind: 0, fourOfAKind: 0,
    fullHouse: 0, smallStraight: 0,
    largeStraight: 0, yahtzee: 0, chance: 0
  };
};

var rollDice = function(num) {
  var dice = [];
  for (var i = 0; i < num; i++) {
    dice.push(Math.floor(Math.random() * 6 + 1));
  }
  return dice;
};

var countDice = function(dice) {
  var counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
  for (var i = 1; i < 7; i++) {
    var count = 0;
    for (var j = 0; j < dice.length; j++) {
      if (dice[j] === i) { count++; }
    }
    counts[i] = count;
    count = 0;
  }
  return counts;
}

var findPlays = function(counts, combos) {
  var plays = {};
  for (var key in counts) {
    if (counts[key] > 0) {
      plays[key] = counts[key] * key;
    }
  }
  if (isOfKind(counts)[0] === 3) {
    plays['threeOfAKind'] = isOfKind(counts)[1];
  } else if (isOfKind(counts)[0] === 4) {
    plays['fourOfAKind'] = isOfKind(counts)[1];
  }
  if (isFullHouse(counts)) {
    plays['fullHouse'] = 25;
  }
  if (isStraight(counts) === 'small') {
    plays['smallStraight'] = 30;
  } else if (isStraight(counts) === 'large') {
    plays['largeStraight'] = 40;
  }
  if (isYahtzee(counts)) {
    plays['yahtzee'] = 50;
  }
  plays['chance'] = countChance(counts);

  for (var key in plays) {
    if (!combos.includes(key)) {
      delete plays[key];
    }
  }
  return plays;
};

var isOfKind = function(counts) {
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
  return [highCount, highDice * highCount];
};

var isFullHouse = function(counts) {
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

var isStraight = function(counts) {
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

var isYahtzee = function(counts) {
  for (var key in counts) {
    if (counts[key] === 5) {
      return true;
    }
  }
  return false;
};

var countChance = function(counts) {
  var chance = 0;
  for (var key in counts) {
    chance += counts[key] * key;
  }
  return chance;
};

playGame();