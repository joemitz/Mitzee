export function newCombos() {
  return [
    '1', '2', '3', '4', '5', '6',
    'threeOfAKind', 'fourOfAKind',
    'fullHouse', 'smallStraight',
    'largeStraight', 'yahtzee', 'chance'
  ]
};

export function newBoxes() {
  return {
    1: 'empty', 2: 'empty', 3: 'empty', 4: 'empty', 5: 'empty', 6: 'empty',
    threeOfAKind: 'empty', fourOfAKind: 'empty',
    fullHouse: 'empty', smallStraight: 'empty',
    largeStraight: 'empty', yahtzee: 'empty', chance: 'empty',
    yahtzeeBonus: 'empty'
  };
};