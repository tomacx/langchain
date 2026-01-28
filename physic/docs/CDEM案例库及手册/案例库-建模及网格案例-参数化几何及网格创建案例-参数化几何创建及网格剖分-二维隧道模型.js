setCurDir(getSrcDir());


igeo.clear();
imeshing.clear();


var Size1 = 1;
var Size2 = 0.2;


var BPoint1 = igeo.genPoint(0, 0, 0, Size1);
var BPoint2 = igeo.genPoint(50, 0, 0, Size1);
var BPoint3 = igeo.genPoint(50, 50, 0, Size1);
var BPoint4 = igeo.genPoint(0, 50, 0, Size1);


var IPoint5 = igeo.genPoint(18.87, 25, 0, Size2);
var IPoint6 = igeo.genPoint(21.29, 22.58, 0, Size2);
var IPoint7 = igeo.genPoint(28.71, 22.58, 0, Size2);
var IPoint8 = igeo.genPoint(31.13, 25, 0, Size2);
var IPoint9 = igeo.genPoint(25, 31.13, 0, Size2);
var IPoint10 = igeo.genPoint(25, 25, 0, Size2);
var IPoint11 = igeo.genPoint(21.29, 25, 0, Size2);
var IPoint12 = igeo.genPoint(28.71, 25, 0, Size2);


var Line1 = igeo.genLine(BPoint1, BPoint2);
var Line2 = igeo.genLine(BPoint2, BPoint3);
var Line3 = igeo.genLine(BPoint3, BPoint4);
var Line4 = igeo.genLine(BPoint4, BPoint1);


var Line5 = igeo.genLine(IPoint6, IPoint7);
var Line6 = igeo.genArc(IPoint5, IPoint10, IPoint9);
var Line7 = igeo.genArc(IPoint8, IPoint10, IPoint9);
var Line8 = igeo.genArc(IPoint5, IPoint11, IPoint6);
var Line9 = igeo.genArc(IPoint7, IPoint12, IPoint8);

var aLine1 = [Line1, Line2, Line3, Line4];
var aLine2 = [Line5, Line6, Line7, Line8, Line9];
var LineLoop1 = igeo.genLineLoop(aLine1);
var LineLoop2 = igeo.genLineLoop(aLine2);


var aLineLoop1 = [LineLoop1, LineLoop2];


var Surface1 = igeo.genSurface(aLineLoop1, 1);


var Surface2 = igeo.genSurface( [LineLoop2], 2);

imeshing.genMeshByGmsh(2);