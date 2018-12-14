//根据不同的值获取不同的样式
function getPosTop(i, j) {
    return 20 + i * 120;
}

function getPosLeft(i, j) {
    return 20 + j * 120;
}

function getNumberBackgroundColor(number) { //格子颜色
    switch (number) {
        case 2:
            return "#eee4da";
        case 4:
            return "#ede0c8";
        case 8:
            return "#f2b179";
        case 16:
            return "#d5a563";
        case 32:
            return "#f67c5f";
        case 64:
            return "#f65e3b";
        case 128:
            return "#fe4c40";
        case 256:
            return "#ff4040";
        case 512:
            return "#b22222";
        case 1024:
            return "#8b2323";
        case 2048:
            return "#cd3700";
        case 4096:
            return "#ee7600";
        case 8192:
            return "#ffa500";
        case 16384:
            return "#1c1c1c";
    }
    return "black";
}

function getNumberColor(number) { //数字颜色
    if (number <= 4) {
        return "#776e65";
    }
    return "#ffffff";
}
//变更分数
function getScore() {
    document.getElementById("score").innerHTML = score;
}
//在随机生成数字的时候判断16宫格中是否还有空间
function nospace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] == 0)
                return false;
    return true;
}

//实现功能判断
function canMoveLeft(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0 && j != 0)
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                    return true;

    return false;
}

function canMoveRight(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0 && j != 3)
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                    return true;

    return false;
}

function canMoveUp(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0 && i != 0)
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                    return true;
    return false;
}

function canMoveDown(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] != 0 && i != 3)
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                    return true;
    return false;
}

//判断水平方向是否有障碍物
function noBlockX(x, y1, y2, board) {
    for (var i = y1 + 1; i < y2; i++)
        if (board[x][i] != 0)
            return false;
    return true;
}

//判断竖直方向是否有障碍物
function noBlockY(y, x1, x2, board) {
    for (var i = x1 + 1; i < x2; i++)
        if (board[i][y] != 0)
            return false;
    return true;
}
//判断是否可以移动
function nomove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board))
        return false;
    return true;
}