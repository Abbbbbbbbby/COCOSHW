import { _decorator, Button, Component, Label, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Boy')
export class Boy extends Component {


    @property(sp.Skeleton)
    skeleton:sp.Skeleton = null;

    @property(Label)
    label:Label = null;

    @property(Button)
    btn:Button = null

    private animIndex = 0;
    onClick(){
        const anims = ['death','hit','idle','jump','run','shoot','test','walk']
        const animName = anims[this.animIndex];
        this.skeleton.setAnimation(0,animName , true)
        this.animIndex = this.animIndex === anims.length -1 ? 0 : this.animIndex + 1;
        this.label.string = animName;
    }
}








