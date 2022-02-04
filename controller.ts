namespace multigame {
    //% fixedInstances
    export class Controller {
        constructor(public player: number) {

        }

        /**
         * Run some code when a button is pressed, released, or held
         */
        //% weight=50 blockGap=8
        //% blockId=multi_ctrlonbuttonevent block="on $this $btn **button** $event in game $gameName"
        //% group="Controller"
        //% color="#D54322"
        onButtonEvent(gameName: string, btn: ControllerButton, event: ControllerButtonEvent, handler: () => void) {
            switch (this.player) {
                case 1:
                    switch (btn) {
                        case ControllerButton.A: return _state.registerButtonHandler(gameName, AllButtons.A, event, handler)
                        case ControllerButton.B: return _state.registerButtonHandler(gameName, AllButtons.B, event, handler)
                        case ControllerButton.Left: return _state.registerButtonHandler(gameName, AllButtons.Left, event, handler)
                        case ControllerButton.Up: return _state.registerButtonHandler(gameName, AllButtons.Right, event, handler)
                        case ControllerButton.Right: return _state.registerButtonHandler(gameName, AllButtons.Up, event, handler)
                        case ControllerButton.Down: return _state.registerButtonHandler(gameName, AllButtons.Down, event, handler)
                    }
                    break;
                case 2:
                    switch (btn) {
                        case ControllerButton.A: return _state.registerButtonHandler(gameName, AllButtons.A2, event, handler)
                        case ControllerButton.B: return _state.registerButtonHandler(gameName, AllButtons.B2, event, handler)
                        case ControllerButton.Left: return _state.registerButtonHandler(gameName, AllButtons.Left2, event, handler)
                        case ControllerButton.Up: return _state.registerButtonHandler(gameName, AllButtons.Right2, event, handler)
                        case ControllerButton.Right: return _state.registerButtonHandler(gameName, AllButtons.Up2, event, handler)
                        case ControllerButton.Down: return _state.registerButtonHandler(gameName, AllButtons.Down2, event, handler)
                    }
                    break;
                case 3:
                    switch (btn) {
                        case ControllerButton.A: return _state.registerButtonHandler(gameName, AllButtons.A3, event, handler)
                        case ControllerButton.B: return _state.registerButtonHandler(gameName, AllButtons.B3, event, handler)
                        case ControllerButton.Left: return _state.registerButtonHandler(gameName, AllButtons.Left3, event, handler)
                        case ControllerButton.Up: return _state.registerButtonHandler(gameName, AllButtons.Right3, event, handler)
                        case ControllerButton.Right: return _state.registerButtonHandler(gameName, AllButtons.Up3, event, handler)
                        case ControllerButton.Down: return _state.registerButtonHandler(gameName, AllButtons.Down3, event, handler)
                    }
                    break;
                case 4:
                    switch (btn) {
                        case ControllerButton.A: return _state.registerButtonHandler(gameName, AllButtons.A4, event, handler)
                        case ControllerButton.B: return _state.registerButtonHandler(gameName, AllButtons.B4, event, handler)
                        case ControllerButton.Left: return _state.registerButtonHandler(gameName, AllButtons.Left4, event, handler)
                        case ControllerButton.Up: return _state.registerButtonHandler(gameName, AllButtons.Right4, event, handler)
                        case ControllerButton.Right: return _state.registerButtonHandler(gameName, AllButtons.Up4, event, handler)
                        case ControllerButton.Down: return _state.registerButtonHandler(gameName, AllButtons.Down4, event, handler)
                    }
                    break;
            }
        }

        /**
         * Register code run when a controller event occurs
         * @param event
         * @param handler
         */
        //% weight=10 blockGap=8
        //% blockId=multi_ctrlonevent block="on $this $event in game $gameName"
        //% group="Controller"
        //% color="#D54322"
        onEvent(gameName: string, event: ControllerEvent, handler: () => void) {
        }
    }

    //% fixedInstances
    export class Button {
        constructor(public button: AllButtons) {

        }
        /**
         * Run some code when a button is pressed, released, or held
         */
        //% weight=99 blockGap=8
        //% blockId=multi_keyonevent block="on $this **button** $event in game $gameName"
        //% group="Controller"
        //% color="#D54322"
        onEvent(gameName: string, event: ControllerButtonEvent, handler: () => void) {
            _state.registerButtonHandler(gameName, this.button, event, handler)
        }
    }

    //% fixedInstance whenUsed block="{id:controller}A"
    export const A = new Button(AllButtons.A);
    //% fixedInstance whenUsed block="{id:controller}B"
    export const B = new Button(AllButtons.B);
    //% fixedInstance whenUsed block="left"
    export const left = new Button(AllButtons.Left);
    //% fixedInstance whenUsed block="up"
    export const up = new Button(AllButtons.Up);
    //% fixedInstance whenUsed block="right"
    export const right = new Button(AllButtons.Right);
    //% fixedInstance whenUsed block="down"
    export const down = new Button(AllButtons.Down);
    //% fixedInstance whenUsed block="menu"
    export const menu = new Button(AllButtons.Menu);

    //% fixedInstance whenUsed block="player 2"
    export const player2 = new Controller(2);
    //% fixedInstance whenUsed block="player 3"
    export const player3 = new Controller(3);
    //% fixedInstance whenUsed block="player 4"
    export const player4 = new Controller(4);
    //% fixedInstance whenUsed block="player 1"
    export const player1 = new Controller(1);
}