export default function drawGameOver(
  deadPenguins,
  fish,
  level,
  gameScene,
  score,
  callback
) {
  let totalDeadPenguins = deadPenguins;
  let totalFish = fish;
  let totalScore = score;

  console.log(gameScene);
  gameScene.add.rectangle(200, 150, 300, 200, 0x6666ff).setScrollFactor(0);
  gameScene.add
    .text(90, 70, "GAME OVER     Level " + level)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(90, 110, "You lost all your fish!")
    .setScrollFactor(0)
    .setFont("16px squaredance10");

  if (totalDeadPenguins == 0) {
    gameScene.add
      .text(90, 140, "You didn't kill", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    gameScene.add
      .text(90, 155, "ANY penguins!", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  } else {
    gameScene.add
      .text(90, 140, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    // gameScene.add.text(130, 195, totalDeadPenguins + " penguins!");
    gameScene.add
      .text(275, 155, `-${totalDeadPenguins * 250}`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  }
  gameScene.add
    .text(90, 175, "Total Score: " + totalScore, {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(90, 200, "Press spacebar to ", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(90, 215, "play again", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
}
