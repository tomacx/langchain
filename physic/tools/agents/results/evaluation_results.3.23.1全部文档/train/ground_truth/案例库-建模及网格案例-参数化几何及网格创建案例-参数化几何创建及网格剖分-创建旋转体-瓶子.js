setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

var size = 0.005;

var height = 0.2;

var rad1 = 0.06;
var rad2 = 0.03;

var aCoord = new Array(6);
aCoord[0] = igeo.genPoint(rad1,0,0, size);
aCoord[1] = igeo.genPoint(rad1 - 0.7 * rad2,height * 0.2 ,0, size);
aCoord[2] = igeo.genPoint(rad1 - 1.0 * rad2,height * 0.4 ,0, size);
aCoord[3] = igeo.genPoint(rad1 - 1.5 * rad2,height * 0.6 ,0, size);
aCoord[4] = igeo.genPoint(rad1 - 1.2 * rad2,height * 0.8 ,0, size);
aCoord[5] = igeo.genPoint(rad2 ,height ,0, size);


var lineid = new Array();

for(var i = 0; i < 5; i++)
{
var id = igeo.genLine(aCoord[i], aCoord[i + 1]);
lineid.push(id);
}


var id1 = igeo.genLine(0,0,0,0,height,0,size,size);
var id2 = igeo.genLine(0,0,0,rad1,0,0,size,size);
var id3 = igeo.genLine(0,height,0,rad2, height,0,size,size);

lineid.push(id1);
lineid.push(id2);
lineid.push(id3);

var loopid = igeo.genLineLoop(lineid);

var surfid = igeo.genSurface(loopid, 1);


var Volume1 = igeo.rotate("surface",surfid, 0, 0, 0, 0,3, 0, 90, 4, size, 1);

imeshing.genMeshByGmsh(3);
