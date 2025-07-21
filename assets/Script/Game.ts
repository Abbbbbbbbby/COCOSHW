import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')

export class Game extends Component {

    @property(Label)
    label:Label = null;

    onClick(){
        this.label.string = 'Hello World !!!'
    }
}