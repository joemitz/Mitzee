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