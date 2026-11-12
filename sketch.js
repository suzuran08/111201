let stopSheet, walkSheet, attackSheet;
let currentFrame = 0;
let frameSpeed = 0.2; // 動畫播放速度
let moveSpeed = 6;    // 角色移動速度

// 角色狀態與位置
let charX;
let facingRight = true; // 預設角色面向右邊

// 攻擊動畫專用狀態
let isAttacking = false;
let attackFrame = 0;

function preload() {
  // 讀取靜止、走路與攻擊的精靈圖
  stopSheet = loadImage('1/stop/stop.png');
  walkSheet = loadImage('1/walk/walk.png');
  attackSheet = loadImage('1/attack/attack.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始定位：計算靜止狀態時的顯示寬度，將角色放在畫面 2/3 處
  let stopFrameWidth = 885 / 10;
  let displayHeight = windowHeight / 3;
  let displayWidth = stopFrameWidth * (displayHeight / 191);
  charX = (windowWidth * (2 / 3)) - (displayWidth / 2);
}

function draw() {
  background('#fefae0');

  // 預設狀態為「沒有在走路」
  let isWalking = false;

  // 偵測鍵盤左右鍵 (控制位移與轉向)
  if (keyIsDown(RIGHT_ARROW)) {
    isWalking = true;
    facingRight = true;
    charX += moveSpeed;
  } else if (keyIsDown(LEFT_ARROW)) {
    isWalking = true;
    facingRight = false;
    charX -= moveSpeed;
  }

  // 根據狀態設定當前使用的精靈圖參數
  let currentSheet, totalFrames, sheetTotalWidth, sheetTotalHeight;
  
  if (isAttacking) {
    currentSheet = attackSheet;
    totalFrames = 23;
    sheetTotalWidth = 5101;
    sheetTotalHeight = 191;
  } else if (isWalking) {
    // 走路狀態 (修改為 8 張圖片，寬 1019，高 195)
    currentSheet = walkSheet;
    totalFrames = 8;
    sheetTotalWidth = 1019;
    sheetTotalHeight = 195;
  } else {
    // 靜止狀態
    currentSheet = stopSheet;
    totalFrames = 10;
    sheetTotalWidth = 885;
    sheetTotalHeight = 191;
  }

  // 計算單一影格的原始寬高
  let frameWidth = sheetTotalWidth / totalFrames;
  let frameHeight = sheetTotalHeight;

  // 計算顯示在畫布上的寬高 (高度固定為畫布 1/3，寬度等比縮放)
  let displayHeight = windowHeight / 3;
  let displayWidth = frameWidth * (displayHeight / frameHeight);

  // 邊界限制：防止角色走出畫布外 (碰到邊緣即停止位移)
  if (charX < 0) {
    charX = 0; 
  } else if (charX > windowWidth - displayWidth) {
    charX = windowWidth - displayWidth; 
  }

  let charY = windowHeight - displayHeight;

  // 繪製角色
  if (currentSheet) {
    let frameIndex;
    
    if (isAttacking) {
      frameIndex = floor(attackFrame);
      attackFrame += frameSpeed;
      
      if (attackFrame >= totalFrames) {
        isAttacking = false; 
        attackFrame = 0;     
        frameIndex = totalFrames - 1; 
      }
    } else {
      // 正常循環播放 (走路與靜止)
      frameIndex = floor(currentFrame) % totalFrames;
    }

    let sx = frameIndex * frameWidth;
    let sy = 0;

    push(); // 儲存當前畫布狀態
    if (!facingRight) {
      // 若面向左邊，將畫布原點平移至角色中心，進行水平翻轉 (scale(-1, 1))
      translate(charX + displayWidth / 2, charY + displayHeight / 2);
      scale(-1, 1);
      image(currentSheet, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight, sx, sy, frameWidth, frameHeight);
    } else {
      // 面向右邊則正常繪製
      image(currentSheet, charX, charY, displayWidth, displayHeight, sx, sy, frameWidth, frameHeight);
    }
    pop(); // 恢復畫布狀態
  }

  // 推進一般動畫影格 (不受邊界限制，碰到邊緣動畫仍會繼續顯示)
  currentFrame += frameSpeed;
}

// 獨立偵測空白鍵 (單次觸發攻擊)
function keyPressed() {
  if (keyCode === 32 && !isAttacking) {
    isAttacking = true;
    attackFrame = 0; 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let stopFrameWidth = 885 / 10;
  let displayHeight = windowHeight / 3;
  let displayWidth = stopFrameWidth * (displayHeight / 191);
  if (charX > windowWidth - displayWidth) {
    charX = windowWidth - displayWidth;
  }
}