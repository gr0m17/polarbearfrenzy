export default function drawEndbox(
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
  gameScene.add.text(100, 60, `Level ${level} Complete`).setScrollFactor(0);
  gameScene.add.text(100, 100, "You made it home").setScrollFactor(0);
  gameScene.add
    .text(100, 115, `with ${fish} fish!      +${fish * 1000}`)
    .setScrollFactor(0);
  if (totalDeadPenguins == 0) {
    gameScene.add.text(100, 130, "You didn't kill", {}).setScrollFactor(0);
    gameScene.add.text(100, 145, "ANY penguins!", {}).setScrollFactor(0);
  } else {
    gameScene.add
      .text(100, 130, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0);
    // gameScene.add.text(130, 195, totalDeadPenguins + " penguins!");
    gameScene.add
      .text(275, 130, `-${totalDeadPenguins * 250}`)
      .setScrollFactor(0);
  }
  gameScene.add
    .text(100, 165, "Total Score: " + totalScore, {})
    .setScrollFactor(0);
  gameScene.add
    .text(100, 195, "Get ready for level " + (+level + 1) + "!", {})
    .setScrollFactor(0);
}
