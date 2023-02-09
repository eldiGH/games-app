export interface BoardItem {
	imgUrl?: string;
	draggable?: boolean;
	marked?: boolean;
}

export type BoardData = BoardItem[][];

export interface Boundary {
	x: number;
	y: number;
	xMax: number;
	yMax: number;
}

export interface DraggedItem {
	ref: HTMLImageElement;
	x: number;
	y: number;
	offsetLeft: number;
	offsetTop: number;
	boundary: Boundary;
}
