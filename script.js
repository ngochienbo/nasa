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
  populateGrid(50, 100);
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
  populateGrid(50, 100);
  numEl = document.querySelector('input').value;
  width = 100;
  height = 50;
  let sideLength = Math.floor(width / numEl);
  let placementGrid = [];
  let hGridNum = Math.floor(numEl / 2);
  let vGridNum = Math.floor(height / sideLength / 2);
  let placementGridCellWidth = (sideLength + Math.floor((width % sideLength) / hGridNum)) * 2;
  let placementGridCellHeight = (sideLength + Math.floor((height % sideLength) / vGridNum)) * 2;
  
  for (let x = 1; x <= hGridNum; x++){
    for (let y = 1; y <= vGridNum; y++) {
      let tempCell = {x1: (x * placementGridCellWidth + 1) - placementGridCellWidth,
                      x2: x * placementGridCellWidth + 1,
                      y1: (y * placementGridCellHeight + 1) - placementGridCellHeight,
                      y2: y * placementGridCellHeight + 1};
      placementGrid.push(tempCell);
    }
  }
  let elList = placeEl(numEl, placementGrid);
  //console.log(elList);
  // let elList = [{x1:1, x2:2, y1:1, y2:3}, {x1:20, x2:26, y1:2, y2:5}]
  // stores elements that cannot grow anymore and have been removed from elList
  let finishedElList = [];
  let mapArr = mapArray(width, height);
  populateMap(elList, mapArr);
  
  // Main Loop
  do {
    let elIndex = Math.floor(Math.random() * elList.length);
    let el = elList[elIndex];

    let blockedStatus = checkSideStatus(el, mapArr);
    let growDirections = checkGrowDirection(blockedStatus);

    // If the element cannot grow anymore remove it from elList so it isn't considered
    // for growth in the next iteration, and save it in the finishedElList
    if (growDirections.length === 0) {
      console.log(JSON.stringify(elList, undefined, 2));
      elList.splice(elIndex, 1);
      console.log(JSON.stringify(elList, undefined, 2));
      finishedElList.push(el);
      continue;
    }

    let chosenGrowDir = pickGrowDirection(growDirections);
    growElement(el, chosenGrowDir);
    remapElement(el, mapArr);
  } while (elList.length > 0)

  let HTMLStr = render(finishedElList);
  populate(HTMLStr);
})

function placeEl(numEl, grid) {
  let elList = [];
  let randCheck = [];
  for (let i = 0; i < numEl; i++) {
    let tempEl;
    let randNum;
    while (randCheck.includes(randNum) || randNum === undefined) {
      randNum = Math.floor(Math.random() * grid.length);
    }
    tempEl = {x1: grid[randNum].x1,
                 x2: grid[randNum].x2,
                 y1: grid[randNum].y1,
                 y2: grid[randNum].y2};
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

  // Check if given side is blocked (collides with another element or display border)
  function checkSide(side) {
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
  function checkCorner(corner) {
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
    if (x >= 0 && x < 100) {
      if (map[x][y] === 1 || map[x][y] === undefined) {
        return true;
      } else {
        return false;
      }
    } else {
        return true;
    }
  }

  Object.keys(blockedSides).forEach(key => {
    blockedSides[key] = checkSide(key);
  });

  Object.keys(blockedCorners).forEach(key => {
    blockedCorners[key] = checkCorner(key);
  });
  
  return Object.assign(blockedSides, blockedCorners)
}

function checkGrowDirection(blockedStatus) {
  let possGrowDirections = [[1, 2], [2, 3], [3, 4], [1, 4]];
  let growDirections = [];

  possGrowDirections.forEach(dir => {
    let side1 = dir[0];
    let side2 = dir[1];
    let corner = `${side1}${side2}`;
    // The direction is clear to grow if it's not blocked on any side or at the corner
    if (blockedStatus[side1] === false && blockedStatus[side2] === false && blockedStatus[corner] === false) {
      growDirections.push(dir);
    }
  });
  return growDirections;
}

function pickGrowDirection(growDirections) {
  let chosenDir;
  if (growDirections.length === 4) {
    chosenDir = [1, 2, 3, 4];
  } else {
    let index = Math.floor(Math.random() * growDirections.length);
    console.log('index: ' + index);
    chosenDir = growDirections[index];
  }
  return chosenDir;
}

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

function remapElement(el, map) {
 populateMap([el], map);
}