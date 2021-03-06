import { IMoveAction, ITeamAndAction, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo } from "../../../Battles";
import { Move } from "./moves/Move";
import { IMovesBag } from "./moves/MovesBag";

/**
 * Announces and launches battle move animations.
 */
export class Moves<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Battle move runners, keyed by move name.
     */
    private readonly movesBag: IMovesBag;

    /**
     * Initializes a new instance of the Moves class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param movesBag   Battle move runners, keyed by move name.
     */
    public constructor(eightBitter: TEightBittr, movesBag: IMovesBag) {
        super(eightBitter);

        this.movesBag = movesBag;
    }

    /**
     * Plays a battle move.
     *
     * @param teamAndAction   Team and action for the move.
     * @param source   Team whose Pokemon is using the move.
     * @param target   Team whose Pokemon is being targeted.
     * @param callback   Callback for when the move is done.
     */
    public playMove(teamAndAction: ITeamAndAction<IMoveAction>, callback: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        const animatorType: typeof Move = this.movesBag[teamAndAction.action.move.toUpperCase()] || this.movesBag.default;
        const animator: Move<TEightBittr> = new animatorType(this.eightBitter, teamAndAction);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.teams[Team[teamAndAction.source.team]].move(
                battleInfo.teams[Team[teamAndAction.source.team]],
                battleInfo.teams[Team[teamAndAction.source.team]].selectedActor.title.join(""),
                teamAndAction.action.move),
            (): void => animator.runAnimation(callback));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
