import { _decorator, Component, Node, Animation, EventKeyboard,input,Input,KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sheep')
export class Sheep extends Component {

    @property(Node)
    particleNode:Node = null;

    private anim:Animation = null; // 節點身上的 animation component
    private direction:number = 0; // 移動方向
    private speed:number = 600; // 移動速度



    onLoad(): void {
        this.anim = this.node.getComponent (Animation); // EXi Node ELR Animation Component
        input.on(Input.EventType. KEY_DOWN,this.onKeyDown,this);// 鍵盤事件註冊
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this); 
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event: EventKeyboard){
        const isPlaying = this.anim.getState('Run').isPlaying;
        const isPaused = this.anim.getState('Run').isPaused;
        switch (event. keyCode) {
        case KeyCode. KEY_A:
            this.direction = -1; // 往左
        break;
        case KeyCode. KEY_D: 
            this.direction= 1; 1// 往右
        break;
        }

        if(this.direction !== 0){
            if(!isPlaying || isPaused){
                this.anim.play('Run'); // 繼續幫放動畫
            }
        }
    }

    onKeyUp(){
        this.direction = 0;
        this.anim.pause();
    }

    update(deltaTime: number) {

        if(this.direction === 0){ // 沒有方向時，停止以下動作
            return;
        }

        this.node.setScale(-this.direction , 1,1)
        const x = this.node.position.x + deltaTime * this.speed * this.direction; // 更新 x 位置
        this.node.setPosition(x , 0 ,0)

        this.particleNode.setPosition(x,0,0) //粒子效果位置跟隨小羊
    }
}


