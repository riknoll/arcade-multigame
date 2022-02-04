//% color="#f57542"
namespace multigame {
    export enum AllButtons {
        A,
        B,
        Left,
        Up,
        Right,
        Down,
        A2,
        B2,
        Left2,
        Up2,
        Right2,
        Down2,
        A3,
        B3,
        Left3,
        Up3,
        Right3,
        Down3,
        A4,
        B4,
        Left4,
        Up4,
        Right4,
        Down4,
        Menu
    }

    class MultigameUpdateHandler {
        public timer: number;
        constructor(public period: number, public callback: () => void) {
            this.timer = 0;
        }
    }

    class MultigameForeverHandler {
        constructor(public callback: () => void, public lock: boolean) {}
    }

    class MultigameGame {
        buttonHandlers: {[index: number]: {[index: number]: () => void}};
        updateHandlers: MultigameUpdateHandler[];
        foreverHandlers: MultigameForeverHandler[];
        lifeZeroHandler: () => void;
        countdownZeroHandler: () => void;


        constructor(public name: string, public startCallback: () => void) {
            this.buttonHandlers = {};
            this.updateHandlers = [];
            this.foreverHandlers = [];
        }
    }

    class MultigameState {
        registeredGames: MultigameGame[];
        finishHandlers: ((game: string) => void)[];
        currentGame: MultigameGame;
        gameStartTime: number;

        constructor() {
            this.registeredGames = [];
            this.finishHandlers = [];

            game.onUpdate(() => {
                this.update();
            })
        }

        registerGame(name: string, startGame?: () => void) {
            const game = this.findGame(name);
            game.startCallback = startGame;
        }

        finishGame(name: string) {
            // Clear event handlers by starting a nonexistent game
            this.startGame("____");

            for (const handler of this.finishHandlers) {
                handler(name);
            }
        }

        startGame(name: string) {
            const toStart = this.findGame(name);
            this.currentGame = toStart;
            this.gameStartTime = control.millis();

            
            this.registerEvents(toStart);
            toStart.startCallback();

            control.runInParallel(() => {
                while (this.currentGame.name === toStart.name) {
                    const handlers = toStart.foreverHandlers;
                    handlers.forEach(h => {
                        if (!h.lock) {
                            h.lock = true;
                            control.runInParallel(() => {
                                h.callback();
                                h.lock = false;
                            });
                        }
                    });
                    pause(20);
                }
            })
        }

        registerEvents(toStart: MultigameGame) {
            const buttons = [
                AllButtons.A,
                AllButtons.B,
                AllButtons.Left,
                AllButtons.Up,
                AllButtons.Right,
                AllButtons.Down,
                AllButtons.A2,
                AllButtons.B2,
                AllButtons.Left2,
                AllButtons.Up2,
                AllButtons.Right2,
                AllButtons.Down2,
                AllButtons.A3,
                AllButtons.B3,
                AllButtons.Left3,
                AllButtons.Up3,
                AllButtons.Right3,
                AllButtons.Down3,
                AllButtons.A4,
                AllButtons.B4,
                AllButtons.Left4,
                AllButtons.Up4,
                AllButtons.Right4,
                AllButtons.Down4,
                AllButtons.Menu
            ];

            const events = [
                ControllerButtonEvent.Pressed,
                ControllerButtonEvent.Released,
                ControllerButtonEvent.Repeated
            ];

            for (const button of buttons) {
                if (!toStart.buttonHandlers[button]) {
                    toStart.buttonHandlers[button] = {};
                }

                for (const event of events) {
                    const handler = toStart.buttonHandlers[button][event] || doNothing;

                    switch (button) {
                        case AllButtons.A: controller.A.onEvent(event, handler); break;
                        case AllButtons.B: controller.B.onEvent(event, handler); break;
                        case AllButtons.Left: controller.left.onEvent(event, handler); break;
                        case AllButtons.Up: controller.up.onEvent(event, handler); break;
                        case AllButtons.Right: controller.right.onEvent(event, handler); break;
                        case AllButtons.Down: controller.down.onEvent(event, handler); break;
                        case AllButtons.A2: controller.player2.A.onEvent(event, handler); break;
                        case AllButtons.B2: controller.player2.B.onEvent(event, handler); break;
                        case AllButtons.Left2: controller.player2.left.onEvent(event, handler); break;
                        case AllButtons.Up2: controller.player2.up.onEvent(event, handler); break;
                        case AllButtons.Right2: controller.player2.right.onEvent(event, handler); break;
                        case AllButtons.Down2: controller.player2.down.onEvent(event, handler); break;
                        case AllButtons.A3: controller.player3.A.onEvent(event, handler); break;
                        case AllButtons.B3: controller.player3.B.onEvent(event, handler); break;
                        case AllButtons.Left3: controller.player3.left.onEvent(event, handler); break;
                        case AllButtons.Up3: controller.player3.up.onEvent(event, handler); break;
                        case AllButtons.Right3: controller.player3.right.onEvent(event, handler); break;
                        case AllButtons.Down3: controller.player3.down.onEvent(event, handler); break;
                        case AllButtons.A4: controller.player4.A.onEvent(event, handler); break;
                        case AllButtons.B4: controller.player4.B.onEvent(event, handler); break;
                        case AllButtons.Left4: controller.player4.left.onEvent(event, handler); break;
                        case AllButtons.Up4: controller.player4.up.onEvent(event, handler); break;
                        case AllButtons.Right4: controller.player4.right.onEvent(event, handler); break;
                        case AllButtons.Down4: controller.player4.down.onEvent(event, handler); break;
                        case AllButtons.Menu: controller.menu.onEvent(event, handler); break;
                    }
                }
            }

            info.onLifeZero(toStart.lifeZeroHandler || doNothing);
            info.onCountdownEnd(toStart.countdownZeroHandler || doNothing);
        }

        registerButtonHandler(gameName: string, button: AllButtons, event: ControllerButtonEvent, handler: () => void) {
            const game = this.findGame(gameName);

            if (!game.buttonHandlers[button]) {
                game.buttonHandlers[button] = {};
            }

            game.buttonHandlers[button][event] = handler;
            if (this.currentGame && gameName === this.currentGame.name) this.registerEvents(game);
        }

        registerUpdateHandler(gameName: string, period: number, callback: () => void) {
            const game = this.findGame(gameName);
            game.updateHandlers.push(new MultigameUpdateHandler(period, callback));
        }

        registerForeverHandler(gameName: string, callback: () => void) {
            const game = this.findGame(gameName);
            game.foreverHandlers.push(new MultigameForeverHandler(callback, false));
        }

        registerLifeZeroHandler(gameName: string, callback: () => void) {
            const game = this.findGame(gameName);
            game.lifeZeroHandler = callback;
            if (this.currentGame && gameName === this.currentGame.name) this.registerEvents(game);
        }

        registerCountdownEndHandler(gameName: string, callback: () => void) {
            const game = this.findGame(gameName);
            game.countdownZeroHandler = callback;
            if (this.currentGame && gameName === this.currentGame.name) this.registerEvents(game);
        }

        registerGameFinishHandler(handler: (name: string) => void) {
            this.finishHandlers.push(handler);
        }


        findGame(name: string) {
            let existing = this.registeredGames.find(g => g.name === name);

            if (!existing) {
                existing = new MultigameGame(name, doNothing);
                this.registeredGames.push(existing);
            }
            return existing;
        }

        update() {
            if (!this.currentGame) return;

            const time = control.millis();
            for (const handler of this.currentGame.updateHandlers) {
                if (handler.timer < time) {
                    handler.callback();
                    handler.timer = time + handler.period;
                }
            }
        }
    }

    function doNothing() { };

    export let _state: MultigameState = new MultigameState();

    //% group="Multigame"
    //% weight=100
    //% blockId=multi_startgame block="start game $gameName"
    export function startGame(gameName: string) {
        _state.startGame(gameName);
    }

    //% group="Multigame"
    //% weight=90
    //% blockId=multi_finishgame block="finish game $gameName"
    export function finishGame(gameName: string) {
        _state.finishGame(gameName);
    }

    //% group="Multigame"
    //% weight=90
    //% blockId=multi_ongamefinished block="on game $gameName finished"
    //% draggableParameters="reporter"
    export function onGameFinished(handler: (gameName: string) => void) {
        _state.registerGameFinishHandler(handler);
    }
    

    /**
     * Update the position and velocities of sprites
     * @param body code to execute
     */
    //% group="Game"
    //% weight=100
    //% blockId=multi_gameupdate block="on game update in game $gameName"
    //% blockAllowMultiple=1
    //% color="#8854d0"
    export function onUpdate(gameName: string, a: () => void): void {
        _state.registerUpdateHandler(gameName, 0, a);
    }

    /**
     * Run code on an interval of time. This executes before game.onUpdate()
     * @param body code to execute
     */
    //% group="Game"
    //% weight=99
    //% blockId=multi_gameinterval block="on game update every $period ms in game $gameName"
    //% period.shadow=timePicker
    //% blockAllowMultiple=1
    //% color="#8854d0"
    export function onUpdateInterval(gameName: string, period: number, a: () => void): void {
        _state.registerUpdateHandler(gameName, period, a);
    }

    /**
     * Returns the time since the game started in milliseconds
     */
    //% blockId=multi_arcade_game_runtime block="time since current game start (ms)"
    //% group="Game" weight=11
    //% color="#8854d0"
    export function runtime(): number {
        return game.runtime() - _state.gameStartTime;
    }

    /**
     * Repeats the code forever in the background for this scene.
     * On each iteration, allows other codes to run.
     * @param callback code to execute
     */
    //% group="Loops"
    //% weight=98
    //% blockId=multi_forever block="forever in game $gameName"
    //% blockAllowMultiple=1
    //% color="#20BF6B"
    export function forever(gameName: string, handler: () => void) {
        _state.registerForeverHandler(gameName, handler);
    }


    //% group="Loops"
    //% weight=100
    //% blockId=multi_onstart block="on start in game $gameName"
    //% color="#20BF6B"
    export function onStart(gameName: string, handler: () => void) {
        _state.registerGame(gameName, handler);
    }

    /**
     * Run code when the player's life reaches 0. If this function
     * is not called then game.over() is called instead
     */
    //% weight=82
    //% blockId=multi_gamelifeevent block="on life zero in game $gameName"
    //% group="Info"
    //% color="#cf6a87"
    export function onLifeZero(gameName: string, handler: () => void) {
        _state.registerLifeZeroHandler(gameName, handler);
    }

    /**
     * Run code when the countdown reaches 0. If this function
     * is not called then game.over() is called instead
     */
    //% blockId=multi_gamecountdownevent block="on countdown end in game $gameName" weight=77
    //% group="Info"
    //% color="#cf6a87"
    export function onCountdownEnd(gameName: string, handler: () => void) {
        _state.registerCountdownEndHandler(gameName, handler);
    }
}
