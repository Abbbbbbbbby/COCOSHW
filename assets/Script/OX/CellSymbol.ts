import { _decorator, Component, Sprite, SpriteFrame, Node, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellSymbol')
export class CellSymbol extends Component {
    @property(SpriteFrame)
    OSprite: SpriteFrame = null;

    @property(SpriteFrame)
    XSprite: SpriteFrame = null;

    private sprite: Sprite = null;
    private index: number = -1;
    private gameManager: any = null;

    onLoad() {
        this.sprite = this.getComponent(Sprite);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    public init(index: number, gameManager: any) {
        this.index = index;
        this.gameManager = gameManager;
    }

    private onClick(event: EventTouch) {
        if (this.gameManager) {
            this.gameManager.onCellClicked(this.index);
        }
    }

    public show(symbol: string) {
        if (symbol === 'O') {
            this.sprite.spriteFrame = this.OSprite;
        } else if (symbol === 'X') {
            this.sprite.spriteFrame = this.XSprite;
        } else {
            this.sprite.spriteFrame = null;
        }
        this.sprite.node.setScale(0.3, 0.3);
    }
}
