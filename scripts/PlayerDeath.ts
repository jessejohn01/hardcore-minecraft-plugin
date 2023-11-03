import { EntityDieAfterEvent, world } from "@minecraft/server";
import { SendMessage } from "./discord";

export const PlayerDeath = (entityDeathEvent: EntityDieAfterEvent) => {
  const deadPlayer = entityDeathEvent.deadEntity;
  world.scoreboard.getObjective("ServerDeaths")?.addScore(deadPlayer.nameTag, 1);
  if (
    (world.scoreboard
      .getObjective("ServerDeaths")
      ?.getScores()
      ?.map((entry) => entry.score)
      ?.reduce((a, b) => a + b, 0) ?? 0) >=
    (world.scoreboard
      .getObjective("MaxLives")
      ?.getScores()
      ?.map((entry) => entry.score)
      ?.reduce((a, b) => a + b, 0) ?? 100)
  ) {
    world.getAllPlayers().forEach((player) => {
      player.runCommandAsync(`kick "${player.name}" Game over. The server is out of lives.`);
    });
  }

  SendMessage(`${deadPlayer.nameTag} has died and a life has been removed.`);
};
