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
  const centerOffset = {
    width: gameScene.game.config.width,
    height: gameScene.game.config.height,
  };

  (centerOffset.x = centerOffset.width - 300),
    (centerOffset.y = centerOffset.height);

  console.log(centerOffset);
  console.log("game scene:", gameScene);
  gameScene.add
    .rectangle(centerOffset.x - 20, 140, 320, 180, 0x6666ff)
    .setScrollFactor(0);
  gameScene.add
    .text(centerOffset.x - 120, 60, `Level ${level} Complete`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x - 120, 80, "You made it home!")
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x - 110, 115, `with ${fish} fish!`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(centerOffset.x + 60, 115, `+${fish * 1000}`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");

  if (totalDeadPenguins == 0) {
    gameScene.add
      .text(centerOffset.x - 100, 130, "You didn't kill", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    gameScene.add
      .text(centerOffset.x - 100, 145, "ANY penguins!", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  } else {
    gameScene.add
      .text(centerOffset.x - 150, 130, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");

    // gameScene.add.text(130, 195, totalDeadPenguins + " penguins!");
    gameScene.add
      .text(centerOffset.x + 60, 130, `-${totalDeadPenguins * 250}`)
      .setScrollFactor(0)
      .setFont("16px squaredance10")
      .setFill("red");
  }
  gameScene.add
    .text(centerOffset.x - 100, 165, "Total Score: ", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10")
    .setFill("white");
  gameScene.add
    .text(centerOffset.x + 60, 165, " " + totalScore, {})
    .setScrollFactor(0)
    .setFont("16px squaredance10")
    .setFill("white");
  gameScene.add
    .text(
      centerOffset.x - 150,
      195,
      "Get ready for level " + (+level + 1) + "!",
      {}
    )
    .setScrollFactor(0)
    .setFont("16px squaredance10");
}
