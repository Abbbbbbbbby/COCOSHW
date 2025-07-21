import { _decorator, Component, Node,instantiate,Animation,randomRangeInt,Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CopySheep')
export class CopySheep extends Component {

    @property(Node)
    sheepTemplate:Node = null;

    onClick(){
        const sheepNode = instantiate(this.sheepTemplate); // 複製並實體化小羊
        sheepNode.active = true;
        sheepNode.setParent(this.node);
        sheepNode.setPosition(randomPosition())

        const anim = sheepNode.getComponentInChildren(Animation);
        anim.play('Run');
    }
}

function randomPosition():Vec3{
    const x = randomRangeInt(-200,200)
    const y = randomRangeInt(-100,100)
    return new Vec3(x,y,0)
}

