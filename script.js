const populateGrid = (row, col) => {
  let gridDisplay = document.querySelector('.grid');
  gridDisplay.innerHTML = '';

  let HTMLstr = '';
  for (let y = 1; y <= row; y++) {
    for (let x = 1; x <= col; x++) {
    let HTMLsnippet = 
      `<div class="grid-item ${x + 'x' + y}" style="grid-area: ${y} / ${x} / ${y} / ${x}"></div>`
    HTMLstr += HTMLsnippet;
    }
  }
  gridDisplay.innerHTML = HTMLstr;
}

window.addEventListener('load', function onLoad() {
  populateGrid(60, 100);
})

// const controller = (numEl, width, height) => {
//   let fieldList = [];
//   fieldList.push({x1: 1,
//                   x2: width + 1,
//                   y1: 1,
//                   y2: height + 1});
//     let x = 0;
//   while (fieldList.length < numEl) {
//     let newEl = divide(fieldList[0]);
//     for (let i = 0; i < newEl.length; i++) {
//       fieldList.push(newEl[i]);
//     }
//     fieldList.shift();
//     console.log(JSON.stringify(fieldList));
//     x += 1;
//   }
//   console.log(x);
//   //console.log(fieldList);
//   let HTMLStr = render(fieldList);
//   populate(HTMLStr);
// }

// function divide(el) {
//   let longerSide;
//   let length;
//   let splitMin = 0.4, splitMax = 0.6;
//   let newEl = []
//   let splitPoint;
//   if (el.x2 - el.x1 >= el.y2 - el.y1) {
//     longerSide = 'x';
//     length = el.x2 - el.x1;
//     //splitPoint = Math.floor(el.x1 + splitMin * length + Math.random()*(splitMax - splitMin) * length);
//     splitPoint = Math.floor(el.x1 + 0.5 * length);
//   } else {
//     longerSide = 'y';
//     length = el.y2 - el.y1;
//     //splitPoint = Math.floor(el.y1 + splitMin * length + Math.random()*(splitMax - splitMin) * length);
//     splitPoint = Math.floor(el.y1 + 0.5 * length);

//   }
    
//     // let splitPoint = Math.floor(splitMin * length + Math.random()*(splitMax - splitMin) * length);
    
//     //console.log(splitPoint);
//   if (longerSide === 'x') {
//     newEl.push({x1: el.x1,
//                 x2: splitPoint,
//                 y1: el.y1,
//                 y2: el.y2});
//     newEl.push({x1: splitPoint,
//                 x2: el.x2,
//                 y1: el.y1,
//                 y2: el.y2});            
//   } else if (longerSide === 'y') {
//     newEl.push({x1: el.x1,
//                 x2: el.x2,
//                 y1: el.y1,
//                 y2: splitPoint});
//     newEl.push({x1: el.x1,
//                 x2: el.x2,
//                 y1: splitPoint,
//                 y2: el.y2});            
//   }


//   return newEl;
// } 

// function render(elList) {
//   let HTMLStr="";
//   for (let i = 0; i < elList.length; i++) {
//     let x1 = elList[i].x1;
//     let x2 = elList[i].x2;
//     let y1 = elList[i].y1;
//     let y2 = elList[i].y2;
//     let bg = Math.floor(Math.random()*16777215).toString(16);
//     let HTMLsnippet = `<div style="grid-area: ${y1} / ${x1} / ${y2} / ${x2}; background: #${bg}"></div>`;
//     HTMLStr += HTMLsnippet;
//   }
//   return HTMLStr;
// }

// function populate(str) {  
//   const gridCont = document.querySelector('.grid');
//   gridCont.innerHTML += str;
// }

document.querySelector('.run').addEventListener('click', function(numEl, width, height) {
  populateGrid(60, 100);
  numEl = document.querySelector('input').value;
  width = 100;
  height = 60;

  let cellWidth = 5;

  // let el = {x1: 70, x2: 95, y1: 30, y2: 55};
  // let growDirections = [[1], [2], [3], [4]];
  // let cellWidth = 4;

  // let filteredGrowDirections = filterGrowDirections(el, growDirections, cellWidth, width, height);
  // console.log(filteredGrowDirections)
 
  let placementGrid = createPlacementGrid(numEl, width, height, cellWidth);
  let elList = placeEl(numEl, placementGrid, cellWidth);
  //console.log(elList);
  // let elList = [{x1:1, x2:2, y1:1, y2:3}, {x1:20, x2:26, y1:2, y2:5}]
  // stores elements that cannot grow anymore and have been removed from elList
  let firstPassElList = [];
  let secondPassElList = [];
  let mapArr = mapArray(width, height);
  populateMap(elList, mapArr);
  // Main Loop FIRST pass - grow elements while keeping square shape
  do {
    let growType = 'double';
    let elIndex = Math.floor(Math.random() * elList.length);
    let el = elList[elIndex];

    let blockedStatus = checkSideStatus(el, mapArr);
    let growDirections = checkGrowDirection(blockedStatus, growType);
    let filteredGrowDirections = filterGrowDirections(el, growDirections, cellWidth, width, height);

    // If the element cannot grow anymore remove it from elList so it isn't considered
    // for growth in the next iteration, and save it in the firstPassElList
    if (filteredGrowDirections.length === 0) {
      elList.splice(elIndex, 1);
      firstPassElList.push(el);
      continue;
    }

    let chosenGrowDir = pickGrowDirection(filteredGrowDirections);
    growElement(el, chosenGrowDir);
    remapElement(el, mapArr);
  } while (elList.length > 0)

    // Main loop SECOND pass - grow elements on a single side at a time
    // To fill in some of the remaining whitespace
  do {
    let growType = 'single';
    let ratio = 1.0; // ratio of side lengths, to determine element proportion
    let elIndex = Math.floor(Math.random() * firstPassElList.length);
    let el = firstPassElList[elIndex];

    let blockedStatus = checkSideStatus(el, mapArr);
    let growDirections = checkGrowDirection(blockedStatus, growType);
    let filteredGrowDirections = filterGrowDirections(el, growDirections, cellWidth, width, height);

    // If the element cannot grow anymore remove it from elList so it isn't considered
    // for growth in the next iteration, and save it in the secondPassElList
    if (filteredGrowDirections.length === 0) {
      firstPassElList.splice(elIndex, 1);
      secondPassElList.push(el);
      continue;
    }

    let chosenGrowDir = pickGrowDirection(filteredGrowDirections);
    growElement(el, chosenGrowDir);
    remapElement(el, mapArr);

    if (checkElementProportion(el, ratio) === true) {
      firstPassElList.splice(elIndex, 1);
      secondPassElList.push(el);
      continue;
    }
  } while (firstPassElList.length > 0)

  let HTMLStr = render(secondPassElList);
  populate(HTMLStr);
})

function createPlacementGrid(numEl, width, height, cellWidth) {
  let sideLength = cellWidth;
  // let sideLength = Math.floor(width / numEl);
  let placementGrid = [];
  let hGridNum = width / sideLength;
  // let hGridNum = numEl;
  let vGridNum = Math.floor(height / sideLength);
  // let placementGridCellWidth = sideLength + Math.floor((width % sideLength) / hGridNum);
  // let placementGridCellHeight = sideLength + Math.floor((height % sideLength) / vGridNum);
  
  for (let x = 1; x <= hGridNum; x++){
    for (let y = 1; y <= vGridNum; y++) {
      let tempCell = {x1: (x * sideLength + 1) - sideLength,
                      x2: x * sideLength + 1,
                      y1: (y * sideLength + 1) - sideLength,
                      y2: y * sideLength + 1};
      placementGrid.push(tempCell);
    }
  }
  return placementGrid
}

function placeEl(numEl, grid, cellWidth) {
  let elList = [];
  let randCheck = [];
  for (let i = 0; i < numEl; i++) {
    let tempEl;
    let randNum;
    while (randCheck.includes(randNum) || randNum === undefined) {
      randNum = Math.floor(Math.random() * grid.length);
    }
    let xOffset = Math.floor(Math.random() * cellWidth);
    let yOffset = Math.floor(Math.random() * cellWidth); 
    tempEl = {x1: grid[randNum].x1 + xOffset,
                 x2: grid[randNum].x1 + xOffset + 1,
                 y1: grid[randNum].y1 + yOffset,
                 y2: grid[randNum].y1 + yOffset + 1};
    // tempEl = {x1: grid[randNum].x1,
    //              x2: grid[randNum].x2,
    //              y1: grid[randNum].y1,
    //              y2: grid[randNum].y2};

    // console.log('generated item:');
    // console.log(tempEl);
    elList.push(tempEl);
    randCheck.push(randNum);
    // console.log('list')
    // console.log(elList)
    // for (let x = 0; x < elList.length; x++) {
    //   console.log('element:');
    //   console.log(elList[x]);
    // }
  }
  //console.log(elList);
  return elList;
}

function render(elList) {
  let HTMLStr="";
  for (let i = 0; i < elList.length; i++) {
    let x1 = elList[i].x1;
    let x2 = elList[i].x2;
    let y1 = elList[i].y1;
    let y2 = elList[i].y2;
    let bg = Math.floor(Math.random()*16777215).toString(16);
    while (bg.length < 6) {
      bg = '0' + bg;
    }
    let HTMLsnippet = `<div style="grid-area: ${y1} / ${x1} / ${y2} / ${x2}; background: #${bg}"></div>`;
    HTMLStr += HTMLsnippet;
  }
  return HTMLStr;
}

function populate(str) {  
  const gridCont = document.querySelector('.grid');
  gridCont.innerHTML += str;
}

// *Create map - mapArray(), populatemap()
//  - arg: elList, dimension of grid display
//  - 2d array, x coordinate outer array, y inner
//  - loop over elList, update map cells according to coordinates of each elList element
//  - return: map array

// *1. checkSideStatus() - Check sides and create an object, the keys that it contains denotes blocked sides
//  - arg: object from elList
//  - return: object indicating blocked sides

// 2. Check combination of two sides at a time as possible candidates to grow
//  - arg: object from elList, blockedSides object
//  - return: array of possible directions to grow

// *  Check in controller function if array is empty, if so remove element from list
//    and restart loop.

// 3. Pick direction to grow
//  - arg: array of possible directions to grow
//  - if length of array == 4, grow all sides
//  - else choose random direction to grow
//  - return: picked direction, alternatively return 'all'

// 4. Grow object
//  - arg: object from elList, picked direction
//  - update object variables
//  - update map array

function mapArray(width, height) {
  let arr = [];
  for (let x = 0; x < width; x++) {
    let xArr = [];
    for (let y = 0; y < height; y++) {
      xArr[y] = 0;
    }
    arr.push(xArr);
  }
  return arr;
}

function populateMap(elList, map) {
  elList.forEach(el => {
    // -1 is because el coordinates start at 1 and array indexes start at 0
    let x1 = el.x1 - 1;
    let x2 = el.x2 - 1;
    let y1 = el.y1 - 1;
    let y2 = el.y2 - 1;
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        map[x][y] = 1;
      }
    }
  })
}

function checkMap(map) {
  let newMap = [];
  for (let a = 0; a < map[0].length; a++) {
    let newArr = [];
    for (let b = 0; b < map.length; b++) {
      newArr[b] = map[b][a];
    }
    newMap.push(newArr);
  }
  console.log(newMap);
}

function checkSideStatus(el, map) {
  let blockedSides = {
    1: false,
    2: false,
    3: false,
    4: false}

  let blockedCorners = {
    12: false,
    23: false,
    34: false,
    14: false
  }

  Object.keys(blockedSides).forEach(key => {
    blockedSides[key] = checkSide(key, el, map);
  });

  Object.keys(blockedCorners).forEach(key => {
    blockedCorners[key] = checkCorner(key, el, map);
  });
  
  return Object.assign(blockedSides, blockedCorners)
}

// Check if given side is blocked (collides with another element or display border)
function checkSide(side, el, map) {
  let start, end, pointsToTest = [];
  // Settings for top side
  // first -1 is to adjust because el coordinates start at 1 and array indexes start at 0,
  // second -1 is in the cases we want to check the point before the border point.
  if (side === '1') {
    start = el.x1 - 1;
    end = el.x2 - 1;
    for (let i = start; i < end; i++) {
      if (map[i][el.y1 - 1 - 1] !== undefined) {
        pointsToTest.push(map[i][el.y1 - 1 - 1]);
      } else {
        pointsToTest.push(undefined);
      }
    }
  // Settings for right side
  } else if (side === '2') {
    start = el.y1 - 1;
    end = el.y2 - 1;
    for (let i = start; i < end; i++) {
      if (map[el.x2 - 1] !== undefined) {
        pointsToTest.push(map[el.x2 - 1][i]);
      } else {
        pointsToTest.push(undefined);
      }
    }
  // Settings for bottom side
  } else if (side === '3') {
    start = el.x1 - 1;
    end = el.x2 - 1;
    for (let i = start; i < end; i++) {
      if (map[i][el.y2 - 1] !== undefined) {
        pointsToTest.push(map[i][el.y2 - 1]);
      } else {
        pointsToTest.push(undefined);
      }
    }
  // Settings for left side
  } else if (side === '4') {
    start = el.y1 - 1;
    end = el.y2 - 1;
    for (let i = start; i < end; i++) {
      if (map[el.x1 - 1 - 1] !== undefined) {
        pointsToTest.push(map[el.x1 - 1 - 1][i]);
      } else {
        pointsToTest.push(undefined);
      }
    }
  } 

  let blocked = false;
  // Check if side is blocked
  pointsToTest.forEach(point => {
    // blockage occurs if another element is present (1) in any checked point
    // or border is present (undefined)
    if (point === 1 || point === undefined) blocked = true;
  });
  return blocked;
}

// Check which corners are blocked
function checkCorner(corner, el, map) {
  let x, y;

  // first -1 is to adjust because el coordinates start at 1 and array indexes start at 0,
  // second -1 is in the cases we want to check the point before the border point.
  if (corner === '12') {
    x = el.x2 - 1;
    y = el.y1 - 1 - 1;
  } else if (corner === '23') {
    x = el.x2 - 1;
    y = el.y2 - 1;
  } else if (corner === '34') {
    x = el.x1 - 1 - 1;
    y = el.y2 - 1;
  } else if (corner === '14') {
    x = el.x1 - 1 - 1;
    y = el.y1 - 1 - 1;
  }
  // If x < 0, an error will be thrown if trying to access its y property 
  if (x >= 0 && x < map.length) {
    if (map[x][y] === 1 || map[x][y] === undefined) {
      return true;
    } else {
      return false;
    }
  } else {
      return true;
  }
}

// Iterates over all possible grow directions (combinations of 2 adjacent sides)
// and determines which combinations are clear for growth
function checkGrowDirection(blockedStatus, growType) {
  let possGrowDirections;
  let growDirections = [];

  if (growType === 'double') {
    possGrowDirections = [[1, 2], [2, 3], [3, 4], [1, 4]];
  } else if (growType === 'single') {
    possGrowDirections = [[1], [2], [3], [4]];
  }

  possGrowDirections.forEach(dir => {
    if (dir.length === 1) {
      let side = dir[0];
      if (blockedStatus[side] === false) {
        growDirections.push(dir);
      }
    } else if (dir.length === 2) {
      let side1 = dir[0];
      let side2 = dir[1];
      let corner = `${side1}${side2}`;
      // The direction is clear to grow if it's not blocked on any side or at the corner
      if (blockedStatus[side1] === false && blockedStatus[side2] === false && blockedStatus[corner] === false) {
        growDirections.push(dir);
      }
    }
  });
  return growDirections;
}

// Apply a filter to grow directions based on the placement of the item.
// If the item is placed close to the border, its grow directions should be further
// restricted, i.e. it's not allowed to grow towards the border.
function filterGrowDirections(el, growDirections, cellWidth, width, height) {
  // The final list to return, restricted directions will be popped from it
  let filteredGrowDirections = [...growDirections];
  let restrictedDirs = [];

  // Distance from the border on 4 sides in which items will have restricted grow directions
  let threshold = cellWidth * 2;

  // Check element's coordinates to determine if growth for this particular side should be restricted
  if (el.x1 <= threshold) {
    restrictedDirs.push(4);
  }
  if (el.y1 <= threshold) {
    restrictedDirs.push(1);
  }
  if (el.x2 >= width - threshold) {
    restrictedDirs.push(2);
  }
  if (el.y2 >= height - threshold) {
    restrictedDirs.push(3);
  }
  console.log('restricted dirs:')
  console.log(restrictedDirs)

  // Test each grow directions item (an array e.g. [1,2], or [1]), and if the item contains
  // a side listed in restrictedDirs then remove that item from the filtered list.
  for (let i = filteredGrowDirections.length - 1; i >= 0; i--) {
    let dir = filteredGrowDirections[i];
    for (let j = 0; j < dir.length; j++){
      if (restrictedDirs.includes(dir[j])) {
        filteredGrowDirections.splice(i, 1);
        break;
      }
    }
  }
  return filteredGrowDirections;
}

// Pick randomly a direction to grow, or if all directions are open then pick all 4
function pickGrowDirection(filteredGrowDirections) {
  let chosenDir;
  if (filteredGrowDirections.length === 4) {
    chosenDir = [1, 2, 3, 4];
  } else {
    let index = Math.floor(Math.random() * filteredGrowDirections.length);
    chosenDir = filteredGrowDirections[index];
  }
  return chosenDir;
}

// Adjust the boundaries of the element to reflect growth in a given direction
function growElement(el, chosenDir) {
  chosenDir.forEach(dir => {
    if (dir === 1) {
      el.y1 -= 1;      
    } else if (dir === 2) {
      el.x2 += 1;
    } else if (dir === 3) {
      el.y2 += 1;
    } else if (dir === 4) {
      el.x1 -= 1;
    }
  });
}

// Temporary solution, simply calls populateMap while giving an array of one element.
function remapElement(el, map) {
 populateMap([el], map);
}

// Returns true if element proportion exceeds desired ratio
function checkElementProportion(el, ratio) {
  let width = el.x2 - el.x1;
  let height = el.y2 - el.y1;

  if (width/height > ratio || height/width > ratio) {
    return true;
  }
}