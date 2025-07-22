import { _decorator, Component, Node, Prefab, instantiate, Label } from 'cc';
import { CellSymbol } from './CellSymbol';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    cellPrefab: Prefab = null;

    @property(Node)
    boardNode: Node = null;

    @property(Node)
    resultLabel: Node = null;

    @property(Node)
    resetButton: Node = null;

    private board: string[] = Array(9).fill('');
    private gameOver: boolean = false;
    private cells: Node[] = [];
    private cellSize = 230; // 每個 Cell 的大小（可以依圖片調整）

    onLoad() {
        this.resetButton.on('click', this.resetGame, this);
        this.createCells(); // 初次產生格子
        this.resetGame();   // 開始時先清空
    }

    // 動態建立格子，並手動設定位置
    private createCells() {
        const spacing = 5;
        const offsetX = -this.cellSize + spacing;
        const offsetY = this.cellSize - spacing;

        for (let i = 0; i < 9; i++) {
            const cell = instantiate(this.cellPrefab);
            this.boardNode.addChild(cell);

            const row = Math.floor(i / 3);
            const col = i % 3;

            const x = offsetX + col * (this.cellSize + spacing);
            const y = offsetY - row * (this.cellSize + spacing);

            cell.setPosition(x, y);

            const cellSymbol = cell.getComponent(CellSymbol);
            if (cellSymbol) {
                cellSymbol.init(i, this);
            }

            this.cells[i] = cell;
             console.log(`Cell ${i} created`);
        }
    }

    public onCellClicked(index: number) {
        if (this.gameOver || this.board[index] !== '') return;

        this.board[index] = 'O';
        this.cells[index].getComponent(CellSymbol).show('O');

        if (this.checkWinner('O')) {
            this.endGame('玩家勝利！');
            return;
        }

        if (this.isBoardFull()) {
            this.endGame('平手！');
            return;
        }

        this.scheduleOnce(() => this.aiMove(), 0.3);
    }

    private aiMove() {
    // 先找AI自己可以贏的位置
    const emptyIndices = this.board
        .map((v, i) => (v === '' ? i : -1))
        .filter(i => i !== -1);

    // 1. 嘗試讓AI贏
    for (const i of emptyIndices) {
        this.board[i] = 'X';
        if (this.checkWinner('X')) {
            this.cells[i].getComponent(CellSymbol).show('X');
            this.endGame('AI勝利！');
            this.gameOver = true;
            return;
        }
        this.board[i] = '';
    }

    // 2. 阻擋玩家贏
    for (const i of emptyIndices) {
        this.board[i] = 'O';
        if (this.checkWinner('O')) {
            this.board[i] = 'X';
            this.cells[i].getComponent(CellSymbol).show('X');
            this.board[i] = 'X'; // 確保board狀態是AI的符號
            if (this.isBoardFull()) {
                this.endGame('平手！');
                this.gameOver = true;
            }
            return;
        }
        this.board[i] = '';
    }

    // 3. 隨機下
    const randIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    this.board[randIndex] = 'X';
    this.cells[randIndex].getComponent(CellSymbol).show('X');

    if (this.checkWinner('X')) {
        this.endGame('AI勝利！');
    } else if (this.isBoardFull()) {
        this.endGame('平手！');
    }
}

    private checkWinner(player: string): boolean {
        const wins = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        return wins.some(pattern => pattern.every(i => this.board[i] === player));
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
            const symbol = cell.getComponent(CellSymbol);
            if (symbol) symbol.show('');
        });
    }
}
