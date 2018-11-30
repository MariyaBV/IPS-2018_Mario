export {isFloatEqual};

function isFloatEqual(f1, f2, FLOAT_EQUAL_PRESCISION) {
    return Math.abs(f1 - f2) <= FLOAT_EQUAL_PRESCISION;
}

// пересечение отрезков
function intersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    let v1 = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
    let v2 = (bx2 - bx1) * (ay2 - by1) - (by2 - by1) * (ax2 - bx1);
    let v3 =(ax2 - ax1) * (by1 - ay1) - (ay2 - ay1) * (bx1 - ax1);
    let v4 = (ax2 - ax1) * (by2 - ay1) - (ay2 - ay1) * (bx2 - ax1);
    return ((v1 * v2 <= 0) && (v3 * v4 <= 0));
}

function getPointOfIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    let pointOfIntersection = false;
	let d = (ax1 - ax2) * (by2 - by1) - (ay1 - ay2) * (bx2 - bx1);
	let da = (ax1 - bx1) * (by2 - by1) - (ay1 - by1) * (bx2 - bx1);
	let db = (ax1 - ax2) * (ay1 - by1) - (ay1 - ay2) * (ax1 - bx1);
 
	let ta = da / d;
	let tb = db / d;
 
	if (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1)
	{
		let dx = ax1 + ta * (ax2 - ax1);
		let dy = ay1 + ta * (ay2 - ay1);
 
		pointOfIntersection = true;
	}
 
	return pointOfIntersection;
}