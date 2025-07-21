import { _decorator, Component, Sprite, SpriteFrame, Node, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellSymbol')
export class CellSymbol extends Component {
    @property(SpriteFrame)
    OSprite: SpriteFrame = null; // 在編輯器中設定 O 的圖片

    @property(SpriteFrame)
    XSprite: SpriteFrame = null; // 在編輯器中設定 X 的圖片

    public index: number = 0; 
    public gameManager: any = null;  // 從 GameManager 傳進來，用來回報點擊

    private sprite: Sprite;

    onLoad() {
        this.sprite = this.getComponent(Sprite);

        // 註冊點擊事件
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private onClick(event: EventTouch) {
         // 當這格被點擊，通知 GameManager，傳遞這格的 index
        if (this.gameManager) {
            this.gameManager.onCellClicked(this.index);
        }
    }

    public setSymbol(symbol: string) {
  
        if (symbol === "O") {
            this.sprite.spriteFrame = this.OSprite;
        } 
        else if (symbol === "X") {
            this.sprite.spriteFrame = this.XSprite;
        }
        else {
        // 清除圖片
        this.sprite.spriteFrame = null;
        }
        // 設定縮放（根據需要調整比例）
        this.sprite.node.setScale(0.3, 0.3, 1);
    }

    public clear() {
        this.sprite.spriteFrame = null;
    }
}
