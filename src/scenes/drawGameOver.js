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

  const centerOffset = {
    width: gameScene.game.config.width,
    height: gameScene.game.config.height,
  };

  (centerOffset.x = centerOffset.width - 300),
    (centerOffset.y = centerOffset.height);

  console.log(centerOffset);
  console.log("game scene:", gameScene);
  gameScene.add
    .rectangle(centerOffset.x - 20, 150, 320, 200, 0x6666ff)
    .setScrollFactor(0);
  gameScene.add
    .text(centerOffset.x - 120, 70, "GAME OVER     Level " + level)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x - 140, 110, "You lost all your fish!")
    .setScrollFactor(0)
    .setFont("16px squaredance10");

  if (totalDeadPenguins == 0) {
    gameScene.add
      .text(centerOffset.x - 140, 140, "You didn't kill", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    gameScene.add
      .text(centerOffset.x - 140, 155, "ANY penguins!", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  } else {
    gameScene.add
      .text(centerOffset.x - 140, 140, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    // gameScene.add.text(130, 195, totalDeadPenguins + " penguins!");
    gameScene.add
      .text(centerOffset.x + 60, 140, `-${totalDeadPenguins * 250}`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  }
  gameScene.add
    .text(centerOffset.x - 140, 175, "Total Score: " + totalScore, {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x - 120, 200, "Press down arrow", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x - 120, 215, " to play again", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
}
