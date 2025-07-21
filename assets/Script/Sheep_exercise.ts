import { _decorator, Component, Node, Animation, EventKeyboard,input,Input,KeyCode, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sheep')
export class Sheep extends Component {
    

    @property(Node)
    particleNode:Node = null;
    @property(SpriteFrame)
    normalSprite: SpriteFrame = null;
    @property(SpriteFrame)
    scaredSprite: SpriteFrame = null;


    private anim:Animation = null; // 節點身上的 animation component
    private directionX:number = 0; // x移動方向
    private directionY:number = 0; // y移動方向
    private speed:number = 600; // 移動速度
    private sprite: Sprite = null;
    



    onLoad(): void {
        this.anim = this.node.getComponent (Animation); // EXi Node ELR Animation Component
        this.sprite = this.node.getComponent(Sprite);
        input.on(Input.EventType. KEY_DOWN,this.onKeyDown,this);// 鍵盤事件註冊
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this); 
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }

    onMouseEnter() {
    if (this.sprite && this.scaredSprite) {
        this.sprite.spriteFrame = this.scaredSprite;
    }
}

onMouseLeave() {
    if (this.sprite && this.normalSprite) {
        this.sprite.spriteFrame = this.normalSprite;
    }
}

    onKeyDown (event: EventKeyboard){
        const isPlaying = this.anim.getState('Run').isPlaying;
        const isPaused = this.anim.getState('Run').isPaused;
        switch (event. keyCode) {
        case KeyCode. KEY_A:
            this.directionX = -1; // 往左
        break;
        case KeyCode. KEY_D: 
            this.directionX= 1; // 往右
        break;
        case KeyCode. KEY_W:
            this.directionY = 1 // 往上
        break;
        case KeyCode. KEY_S:
            this.directionY = -1 // 往下
        break;
        }

        if(this.directionX !== 0||this.directionY !== 0){
            if(!isPlaying || isPaused){
                this.anim.play('Run'); // 繼續播放動畫
            }
        }
    }

    onKeyUp(event: EventKeyboard){
    switch (event.keyCode) {
        case KeyCode.KEY_A:
        case KeyCode.KEY_D:
            this.directionX = 0;
            break;
        case KeyCode.KEY_W:
        case KeyCode.KEY_S:
            this.directionY = 0;
            break;
    }

    if (this.directionX === 0 && this.directionY === 0) {
        this.anim.pause();
    }
}

    update(deltaTime: number) {

        if(this.directionX === 0 && this.directionY === 0){ // 沒有方向時，停止以下動作
            return;
        }

        if (this.directionX !== 0) {
    this.node.setScale(-this.directionX > 0 ? 1 : -1, 1, 1);
}
        const x = this.node.position.x + deltaTime * this.speed * this.directionX; // 更新 x 位置
        const y = this.node.position.y + deltaTime * this.speed * this.directionY; // 更新 y 位置
        this.node.setPosition(x , y ,0)

        this.particleNode.setPosition(x,y,0) //粒子效果位置跟隨小羊
    }
}



