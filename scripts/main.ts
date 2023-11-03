import { world, EntityDieAfterEvent, PlayerJoinAfterEvent } from "@minecraft/server";
import { PlayerDeath } from "./PlayerDeath";

if (world.scoreboard.getObjective("ServerDeaths") == undefined) {
  world.scoreboard.addObjective("ServerDeaths", "Server Deaths");
}
if (world.scoreboard.getObjective("MaxLives") == undefined) {
  world.scoreboard.addObjective("MaxLives", "Max Lives");
}

world.afterEvents.entityDie.subscribe(
  (entityDeathEvent: EntityDieAfterEvent) => {
    PlayerDeath(entityDeathEvent);
  },
  { entityTypes: ["minecraft:player"] }
);

world.afterEvents.playerSpawn.subscribe(() => {
  for (const player of world.getPlayers()) {
    if (!player.hasTag("returningPlayer")) {
      world.scoreboard.getObjective("MaxLives")?.addScore(player.name, 1);
      player.addTag("returningPlayer");
    }

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
      player.runCommandAsync(`kick "${player.name}" Game over. The server is out of lives.`);
    }
  }
});
