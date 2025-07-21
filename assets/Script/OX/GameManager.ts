import { _decorator, Component, Node, Label } from 'cc';
import { CellSymbol } from './CellSymbol';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property([Node])
    cells: Node[] = [];

    @property(Node)
    resultLabel: Node = null;

    @property(Node)
    resetButton: Node = null;

    private board: string[] = Array(9).fill('');
    private gameOver: boolean = false;

    onLoad() {
        // 綁定 reset 按鈕事件
        this.resetButton.on(Node.EventType.TOUCH_END, this.resetGame, this);

        // 初始化每一格，設置該格的 index 和 gameManager引用
        this.cells.forEach((cell, index) => {
        const cellSymbol = cell.getComponent(CellSymbol);
        if (cellSymbol) {
            cellSymbol.index = index;
            cellSymbol.gameManager = this;
        }
    });

        this.resetGame();
    }

    // 當玩家點擊格子時被呼叫，傳入點擊的格子索引
    public onCellClicked(index: number) {
        if (this.gameOver || this.board[index] !== '') {
            return;
        }

        this.playerMove(index);
    }

    // 玩家下棋行為
    private playerMove(index: number) {
        this.board[index] = 'O';
        this.cells[index].getComponent(CellSymbol).setSymbol('O');

        if (this.checkWinner('O')) {
            this.endGame('玩家勝利!');
            return;
        }

        if (this.isBoardFull()) {
            this.endGame('平手！');
            return;
        }

        // 遊戲沒結束，延遲 0.3 秒讓 AI 下棋
        this.scheduleOnce(() => this.aiMove(), 0.3);
    }
    
    // AI 下棋策略
    private aiMove() {
    // 1.  嘗試找能讓 AI 贏的下一步，直接下贏
        for (const i of this.getEmptyIndices()) {
            this.board[i] = 'X';
            if (this.checkWinner('X')) {
                this.cells[i].getComponent(CellSymbol).setSymbol('X');
                this.endGame('AI勝利！');
                return;
            }
            this.board[i] = ''; // 還原
        }

    // 2. 如果 AI 不能贏，檢查玩家是否快贏，要阻擋玩家
    for (const i of this.getEmptyIndices()) {
        this.board[i] = 'O';
        if (this.checkWinner('O')) {
            this.board[i] = 'X';
            this.cells[i].getComponent(CellSymbol).setSymbol('X');
            return;
        }
        this.board[i] = ''; // 還原
    }

    // 3. AI 沒辦法直接贏或阻擋玩家，隨機選一個空格下棋
    const emptyIndices = this.getEmptyIndices();
    if (emptyIndices.length === 0) {
        this.endGame('平手！');
        return;
    }
    const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    this.board[randIndex] = 'X';
    this.cells[randIndex].getComponent(CellSymbol).setSymbol('X');
    // 再次檢查 AI 是否贏了
    if (this.checkWinner('X')) {
        this.endGame('AI勝利！');
    } else if (this.isBoardFull()) {
        this.endGame('平手！');
    }
}

    //取得所有空白格子的索引，方便 AI 找位置下棋
    private getEmptyIndices(): number[] {
        return this.board
            .map((v, i) => (v === '' ? i : -1))
            .filter(i => i !== -1);
}

      // 判斷指定玩家是否獲勝
    private checkWinner(player: string): boolean {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫排
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直排
            [0, 4, 8], [2, 4, 6]             // 斜線
        ];
        return wins.some(pattern =>
            pattern.every(i => this.board[i] === player)
        );
    }

    private isBoardFull(): boolean {
        return this.board.every(cell => cell !== '');
    }

    private endGame(msg: string) {
        this.gameOver = true;
        this.resultLabel.getComponent(Label).string = msg;
    }

    private resetGame() {
        this.board.fill('');
        this.gameOver = false;
        this.resultLabel.getComponent(Label).string = '';

        this.cells.forEach(cell => {
            const cellSymbol = cell.getComponent(CellSymbol);
            if (cellSymbol) {
                cellSymbol.setSymbol('');
            }
        });
    }
}
