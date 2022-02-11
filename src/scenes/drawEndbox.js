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
  gameScene.add.rectangle(200, 140, 300, 180, 0x6666ff).setScrollFactor(0);
  gameScene.add
    .text(110, 60, `Level ${level} Complete`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(110, 80, "You made it home!")
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(75, 115, `with ${fish} fish!`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");
  gameScene.add
    .text(280, 115, `+${fish * 1000}`)
    .setScrollFactor(0)
    .setFont("16px squaredance10");

  if (totalDeadPenguins == 0) {
    gameScene.add
      .text(75, 130, "You didn't kill", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    gameScene.add
      .text(75, 145, "ANY penguins!", {})
      .setScrollFactor(0)
      .setFont("16px squaredance10");
  } else {
    gameScene.add
      .text(75, 130, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");
    gameScene.add
      .text(75, 130, `killed ${totalDeadPenguins} penguins!`)
      .setScrollFactor(0)
      .setFont("16px squaredance10");

    // gameScene.add.text(130, 195, totalDeadPenguins + " penguins!");
    gameScene.add
      .text(280, 130, `-${totalDeadPenguins * 250}`)
      .setScrollFactor(0)
      .setFont("16px squaredance10")
      .setFill("red");
  }
  gameScene.add
    .text(75, 165, "Total Score: ", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10")
    .setFill("white");
  gameScene.add
    .text(280, 165, " " + totalScore, {})
    .setScrollFactor(0)
    .setFont("16px squaredance10")
    .setFill("white");
  gameScene.add
    .text(75, 195, "Get ready for level " + (+level + 1) + "!", {})
    .setScrollFactor(0)
    .setFont("16px squaredance10");
}
