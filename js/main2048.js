/*初始化*/
var board = new Array(); //初始化棋盘格数组
var added = new Array(); //初始化判断数组，用于解决单次操作造成多次合并
var score = 0; //初始化分数
var top = 240;
//在页面准备完成是调用初始化函数
$(document).ready(function (e) {
  newgame();
});
//初始化游戏界面
function newgame() {
  //初始化整个棋盘格
  init();
  //随机生成两个数字
  generateOneNumber();
  generateOneNumber();
}
//初始化棋盘格
function init() {
  //初始化分数为0
  score = 0;
  document.getElementById("score").innerHTML = score;
  //隐藏游戏结束面板
  $("#gameover").css('display', 'none');
  //初始化游戏界面棋盘格
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var gridCell = $("#grid-cell-" + i + "-" + j);
      gridCell.css("top", getPosTop(i, j));
      gridCell.css("left", getPosLeft(i, j));
    }
  }
  //初始化棋盘格数组
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
    }
  }
  //初始化判断的数组
  for (var i = 0; i < 4; i++) {
    added[i] = new Array();
    for (var j = 0; j < 4; j++) {
      added[i][j] = 0;
    }
  }
  //更新棋盘格数组
  updateBoardView();
}
//更新棋盘格数组的样式
function updateBoardView() {
  $(".number-cell").remove();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
      var theNumberCell = $('#number-cell-' + i + '-' + j);
      if (board[i][j] == 0) {
        theNumberCell.css({
          "width": "0px",
          "height": "0px",
          "top": getPosTop(i, j),
          "left": getPosLeft(i, j)
        });
      }
      //覆盖默认格式的棋盘格并更新棋盘格数字
      else {
        theNumberCell.css({
          "width": "100px",
          "height": "100px",
          "top": getPosTop(i, j),
          "left": getPosLeft(i, j),
          "background-color": getNumberBackgroundColor(board[i][j]),
          "color": getNumberColor(board[i][j])
        });
        theNumberCell.text(board[i][j]);
      }
    }
  }
}


//生成随机的格子
function generateOneNumber() {
  //判断是否还有空间生成新格子
  if (nospace(board)) 
    return false;
  
  //随机选择一个位置坐标
  var randx = parseInt(Math.floor(Math.random() * 4));
  var randy = parseInt(Math.floor(Math.random() * 4));
  while (true) {
    //判断该位置是否已被占用
    if (board[randx][randy] == 0)
      break;
    randx = parseInt(Math.floor(Math.random() * 4));
    randy = parseInt(Math.floor(Math.random() * 4));
  }
  //随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;
  //在随机位置显示数字
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);
  return true;
}
//接受键盘输入并完成相应功能
//事件响应循环
$(document).keydown(function (event) {
  switch (event.keyCode) { //键码 上38下40左37右39
    case 37:
      if (moveLeft()) {
        getScore(); //更新分数
        generateOneNumber(); //获取新的随机数字
        setTimeout("isgameover()", 400);
      }
      break;
    case 38:
      if (moveUp()) {
        getScore();
        generateOneNumber();
        setTimeout("isgameover()", 400);
      }
      break;
    case 39:
      if (moveRight()) {
        getScore();
        generateOneNumber();
        setTimeout("isgameover()", 400);
      }
      break;
    case 40:
      if (moveDown()) {
        getScore();
        generateOneNumber();
        setTimeout("isgameover()", 400);
      }
      break;
  }
});
//判断游戏是否结束
function isgameover() {
  if (nospace(board) && nomove(board))
    gameover();
}


function gameover() {
  $("#gameover").css('display', 'block');
}
//将判断数组值赋值为0
function isaddedArray() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      added[i][j] = 0;
    }
  }
}
//向左移动
function moveLeft() {
  //判断是否可以移动
  if (!canMoveLeft(board))
    return false;
  isaddedArray(); //判断数组置为0,每次循环圈调用
  for (var i = 0; i < 4; i++)
    for (var j = 1; j < 4; j++) { //第一列数字不会发生左移
      if (board[i][j] != 0) {
        for (var k = 0; k < j; k++) { //遍历当前元素左侧的元素
          if (board[i][k] == 0 && noBlockX(i, k, j, board)) { //判断落脚位置是否为空&中间无障碍物
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[i][k] == board[i][j] && noBlockX(i, k, j, board)) { //落脚位置的数字与该位置数字相等&中间无障碍物
            showMoveAnimation(i, j, i, k);
            if (added[i][k] != 0) { //落脚点是否完成过合并
              board[i][k + 1] = board[i][j];
              board[i][j] = 0;
            } else {
              board[i][k] += board[i][j];
              board[i][j] = 0;
              added[i][k] = 1;
              score += board[i][k]; //分数变更
            }
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
//向右移动
function moveRight() {
  //判断格子是否能够向右移动
  if (!canMoveRight(board))
    return false;

  isaddedArray();
  for (var i = 0; i < 4; i++)
    for (var j = 2; j >= 0; j--) { //最后一列的数字不可能向右移动
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          //落脚位置的是否为空 && 中间没有障碍物
          if (board[i][k] == 0 && noBlockX(i, j, k, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          //落脚位置的数字和本来的数字相等 && 中间没有障碍物
          else if (board[i][k] == board[i][j] && noBlockX(i, j, k, board)) {
            //move
            showMoveAnimation(i, j, i, k);
            //add
            if (added[i][k] != 0) {
              board[i][k - 1] = board[i][j];
              board[i][j] = 0;
            } else {
              board[i][k] += board[i][j];
              board[i][j] = 0;
              added[i][k] = 1;
              score += board[i][k];
            }
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
//向上移动
function moveUp() {
  //判断格子是否能够向上移动
  if (!canMoveUp(board))
    return false;

  isaddedArray();
  for (var j = 0; j < 4; j++)
    for (var i = 1; i < 4; i++) { //第一行的数字不可能向上移动
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          //落脚位置的是否为空 && 中间没有障碍物
          if (board[k][j] == 0 && noBlockY(j, k, i, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          //落脚位置的数字和本来的数字相等 && 中间没有障碍物
          else if (board[k][j] == board[i][j] && noBlockY(j, k, i, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            if (added[k][j] != 0) {
              board[k + 1][j] = board[i][j];
              board[i][j] = 0;
            } else {
              board[k][j] += board[i][j];
              board[i][j] = 0;
              added[k][j] = 1;
              score += board[k][j];
            }
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}
//向下移动
function moveDown() {
  //判断格子是否能够向下移动
  if (!canMoveDown(board))
    return false;

  isaddedArray();
  for (var j = 0; j < 4; j++)
    for (var i = 2; i >= 0; i--) { //最后一行的数字不可能向下移动
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          //落脚位置的是否为空 && 中间没有障碍物
          if (board[k][j] == 0 && noBlockY(j, i, k, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          //落脚位置的数字和本来的数字相等 && 中间没有障碍物
          else if (board[k][j] == board[i][j] && noBlockY(j, i, k, board)) {
            //move
            showMoveAnimation(i, j, k, j);
            //add
            if (added[k][j] != 0) {
              board[k - 1][j] = board[i][j];
              board[i][j] = 0;
            } else {
              board[k][j] += board[i][j];
              board[i][j] = 0;
              added[k][j] = 1;
              score += board[k][j];
            }
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}