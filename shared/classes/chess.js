import { PieceColor, PieceType } from '@shared/types';
import { Point } from './utils';
export const chessSquareToPoint = (square) => {
    const normalizedSquare = square.toLowerCase();
    const file = normalizedSquare.charCodeAt(0) - 97;
    const rank = parseInt(normalizedSquare[1]) - 1;
    return new Point(file, rank);
};
export const getGameFromFENString = (fenString) => {
    const pieces = [];
    let i = 0;
    mainForLoop: for (let y = 7; y >= 0; y--) {
        for (let x = 0; x < 8; x++, i++) {
            const letter = fenString[i];
            if (Object.values(PieceType).includes(letter.toLowerCase())) {
                const color = /[A-Z]/.test(letter) ? PieceColor.WHITE : PieceColor.BLACK;
                const type = letter.toLowerCase();
                pieces.push({ type, color, position: new Point(x, y), possibleMoves: [] });
            }
            else if (letter === '/') {
                x--;
                continue;
            }
            else if (letter === ' ') {
                break mainForLoop;
            }
            else if (!isNaN(parseInt(letter))) {
                const skip = parseInt(letter);
                x += skip - 1;
            }
        }
    }
    i++;
    const turn = fenString[i] === 'w' ? PieceColor.WHITE : PieceColor.BLACK;
    i += 2;
    const whiteCastle = {
        kingSide: false,
        queenSide: false
    };
    const blackCastle = {
        kingSide: false,
        queenSide: false
    };
    if (fenString[i] !== '-') {
        castleLoop: for (; i <= fenString.length; i++) {
            const letter = fenString[i];
            switch (letter) {
                case 'K':
                    whiteCastle.kingSide = true;
                    break;
                case 'Q':
                    whiteCastle.queenSide = true;
                    break;
                case 'k':
                    blackCastle.kingSide = true;
                    break;
                case 'q':
                    blackCastle.queenSide = true;
                    break;
                case ' ':
                    break castleLoop;
            }
        }
        i++;
    }
    else
        i += 2;
    let enPassant = undefined;
    if (fenString[i] !== '-') {
        enPassant = chessSquareToPoint(fenString.substring(i, i + 2));
    }
    return new ChessGame(pieces, whiteCastle, blackCastle, turn, enPassant, true);
};
export class ChessGame {
    pieces;
    whiteCastle;
    blackCastle;
    turn;
    enPassant;
    constructor(pieces, whiteCastle, blackCastle, turn, enPassant, calculateMoves) {
        this.blackCastle = { ...blackCastle };
        this.whiteCastle = { ...whiteCastle };
        this.turn = turn;
        this.pieces = [...pieces.map((piece) => ({ ...piece }))];
        this.enPassant = enPassant ? new Point(enPassant.x, enPassant.y) : undefined;
        this.sortPieces();
        if (calculateMoves)
            this.calculateAllPossibleMoves();
    }
    getPiece(position) {
        return this.pieces.find((piece) => position.eq(piece.position));
    }
    availableMoves(piece) {
        const isWhite = piece.color === PieceColor.WHITE;
        const oppositeColor = isWhite ? PieceColor.BLACK : PieceColor.WHITE;
        const sameColor = isWhite ? PieceColor.WHITE : PieceColor.BLACK;
        const moves = [];
        switch (piece.type) {
            case PieceType.PAWN: {
                const diagonalPoints = isWhite
                    ? [piece.position.add(-1, 1), piece.position.add(1, 1)]
                    : [piece.position.add(-1, -1), piece.position.add(1, -1)];
                for (const diagonalPoint of diagonalPoints) {
                    if (this.getPiece(diagonalPoint)?.color === oppositeColor ||
                        (this.enPassant && diagonalPoint.eq(this.enPassant)))
                        moves.push(diagonalPoint);
                }
                const pointDoubleAhead = isWhite ? piece.position.add(0, 2) : piece.position.add(0, -2);
                const pointAhead = isWhite ? piece.position.add(0, 1) : piece.position.add(0, -1);
                const pieceDoubleAhead = this.getPiece(pointDoubleAhead);
                const pieceAhead = this.getPiece(pointAhead);
                if (isWhite && piece.position.yEq(1) && !pieceAhead && !pieceDoubleAhead)
                    moves.push(piece.position.addY(2));
                if (!isWhite && piece.position.yEq(6) && !pieceAhead && !pieceDoubleAhead)
                    moves.push(piece.position.addY(-2));
                if (isWhite && !pieceAhead)
                    moves.push(piece.position.addY(1));
                if (!isWhite && !pieceAhead)
                    moves.push(piece.position.addY(-1));
                break;
            }
            case PieceType.KNIGHT: {
                const knightRelativeMoves = [
                    [-1, 2],
                    [1, 2],
                    [2, 1],
                    [2, -1],
                    [1, -2],
                    [-1, -2],
                    [-2, -1],
                    [-2, 1]
                ];
                for (const [x, y] of knightRelativeMoves) {
                    const blockingPiecePos = piece.position.add(x, y);
                    const blockingPiece = this.getPiece(blockingPiecePos);
                    if (!(blockingPiece?.color === sameColor))
                        moves.push(blockingPiecePos);
                }
                break;
            }
            case PieceType.ROOK: {
                const rookMoves = [
                    { incrementX: 0, incrementY: 1 },
                    { incrementX: 1, incrementY: 0 },
                    { incrementX: 0, incrementY: -1 },
                    { incrementX: -1, incrementY: 0 }
                ];
                for (const rookMove of rookMoves) {
                    let { x, y } = piece.position.add(rookMove.incrementX, rookMove.incrementY);
                    while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                        const point = new Point(x, y);
                        const piece = this.getPiece(point);
                        if (piece) {
                            if (piece.color === oppositeColor)
                                moves.push(point);
                            break;
                        }
                        moves.push(point);
                        x += rookMove.incrementX;
                        y += rookMove.incrementY;
                    }
                }
                break;
            }
            case PieceType.BISHOP: {
                const bishopMoves = [
                    { incrementX: 1, incrementY: 1 },
                    { incrementX: 1, incrementY: -1 },
                    { incrementX: -1, incrementY: -1 },
                    { incrementX: -1, incrementY: 1 }
                ];
                for (const bishopMove of bishopMoves) {
                    let { x, y } = piece.position.add(bishopMove.incrementX, bishopMove.incrementY);
                    while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                        const point = new Point(x, y);
                        const piece = this.getPiece(point);
                        if (piece) {
                            if (piece.color === oppositeColor)
                                moves.push(point);
                            break;
                        }
                        moves.push(point);
                        x += bishopMove.incrementX;
                        y += bishopMove.incrementY;
                    }
                }
                break;
            }
            case PieceType.QUEEN: {
                for (let incrementY = -1; incrementY < 2; incrementY++) {
                    for (let incrementX = -1; incrementX < 2; incrementX++) {
                        if (incrementX === 0 && incrementY === 0)
                            continue;
                        let { x, y } = piece.position.add(incrementX, incrementY);
                        while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
                            const point = new Point(x, y);
                            const piece = this.getPiece(point);
                            if (piece) {
                                if (piece.color === oppositeColor)
                                    moves.push(point);
                                break;
                            }
                            moves.push(point);
                            x += incrementX;
                            y += incrementY;
                        }
                    }
                }
                break;
            }
            case PieceType.KING: {
                for (let y = -1; y < 2; y++) {
                    for (let x = -1; x < 2; x++) {
                        if (x === 0 && y === 0)
                            continue;
                        const point = piece.position.add(x, y);
                        const nearbyPiece = this.getPiece(point);
                        if (nearbyPiece) {
                            if (nearbyPiece.color === oppositeColor)
                                moves.push(point);
                            continue;
                        }
                        moves.push(point);
                    }
                }
                break;
            }
        }
        const filteredMoves = moves.filter(({ x, y }) => x <= 7 && x >= 0 && y <= 7 && y >= 0);
        return filteredMoves;
    }
    possibleMoves(piece) {
        const oppositeColor = piece.color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        const availableMoves = this.availableMoves(piece);
        let myKingPosition = piece.type === PieceType.KING ? piece.position : this.findKingPosition(piece.color)?.position;
        if (!myKingPosition)
            return availableMoves;
        const finalMoves = [];
        for (const move of availableMoves) {
            const nextTurn = this.#copyGame();
            nextTurn.#forceMove(piece.position, move);
            if (piece.type === PieceType.KING) {
                myKingPosition = move;
            }
            const enemyPieces = nextTurn.pieces.filter((piece) => piece.color === oppositeColor);
            const enemyMoves = enemyPieces.flatMap((piece) => nextTurn.availableMoves(piece));
            const legalMove = !enemyMoves.find((move) => move.eq(myKingPosition));
            if (legalMove)
                finalMoves.push(move);
        }
        return finalMoves.sort(Point.comparator);
    }
    canMoveTo(piecePoint, newPoint) {
        const piece = this.getPiece(piecePoint);
        if (!piece)
            return false;
        const possibleMoves = this.possibleMoves(piece);
        return !!possibleMoves.find((point) => point.eq(newPoint));
    }
    #forceMove(initialPosition, newPosition) {
        const piece = this.getPiece(initialPosition);
        if (!piece)
            return;
        const pieceToRemove = this.getPiece(newPosition);
        if (pieceToRemove)
            this.pieces = this.pieces.filter((piece) => piece !== pieceToRemove);
        piece.position = newPosition;
        this.turn = this.turn === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
        if (piece.type === PieceType.PAWN) {
            if (this.enPassant && this.enPassant.eq(newPosition)) {
                let pawnToRemove;
                if (piece.color === PieceColor.WHITE)
                    pawnToRemove = this.getPiece(new Point(newPosition.x, 4));
                else
                    pawnToRemove = this.getPiece(new Point(newPosition.x, 4));
                if (pawnToRemove)
                    this.pieces = this.pieces.filter((piece) => piece !== pawnToRemove);
            }
            const multiplier = piece.color === PieceColor.WHITE ? 1 : -1;
            if (initialPosition.y + 2 * multiplier == newPosition.y)
                this.enPassant = initialPosition.add(0, 1 * multiplier);
            else
                this.enPassant = undefined;
        }
        else {
            this.enPassant = undefined;
        }
        if (piece.type === PieceType.KING) {
            if (initialPosition.x + 2 === newPosition.x) {
                if (piece.color === PieceColor.WHITE) {
                    const rook = this.getPiece(new Point(7, 0));
                    if (rook)
                        rook.position = new Point(5, 0);
                }
                else {
                    const rook = this.getPiece(new Point(7, 7));
                    if (rook)
                        rook.position = new Point(5, 7);
                }
            }
            else if (initialPosition.x - 2 === newPosition.x) {
                if (piece.color === PieceColor.WHITE) {
                    const rook = this.getPiece(new Point(0, 0));
                    if (rook)
                        rook.position = new Point(3, 0);
                }
                else {
                    const rook = this.getPiece(new Point(0, 7));
                    if (rook)
                        rook.position = new Point(3, 7);
                }
            }
            if (piece.color === PieceColor.WHITE) {
                this.whiteCastle = { kingSide: false, queenSide: false };
            }
            else {
                this.blackCastle = { kingSide: false, queenSide: false };
            }
        }
        if (piece.type === PieceType.ROOK) {
            if (initialPosition.eq(0, 0)) {
                this.whiteCastle.queenSide = false;
            }
            else if (initialPosition.eq(7, 0)) {
                this.whiteCastle.kingSide = false;
            }
            else if (initialPosition.eq(0, 7)) {
                this.blackCastle.queenSide = false;
            }
            else if (initialPosition.eq(7, 7)) {
                this.blackCastle.kingSide = false;
            }
        }
        this.sortPieces();
    }
    move(initialPosition, newPosition) {
        const piece = this.getPiece(initialPosition);
        if (!piece || piece.color !== this.turn || !this.canMoveTo(initialPosition, newPosition))
            return false;
        this.#forceMove(initialPosition, newPosition);
        this.calculateAllPossibleMoves();
        return true;
    }
    #copyGame() {
        return new ChessGame(this.pieces, this.whiteCastle, this.blackCastle, this.turn, this.enPassant, false);
    }
    findKingPosition(color) {
        return this.pieces.find((piece) => piece.color === color && piece.type === PieceType.KING);
    }
    sortPieces() {
        this.pieces = this.pieces.sort((a, b) => Point.comparator(a.position, b.position));
    }
    calculateAllPossibleMoves() {
        for (const piece of this.pieces) {
            if (piece.color !== this.turn)
                continue;
            piece.possibleMoves = this.possibleMoves(piece);
        }
    }
}
//# sourceMappingURL=chess.js.map