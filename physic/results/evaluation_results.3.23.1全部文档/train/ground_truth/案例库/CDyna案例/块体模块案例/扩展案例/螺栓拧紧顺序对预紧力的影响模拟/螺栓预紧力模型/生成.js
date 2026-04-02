setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

var id1 = igeo.genRect(0,0,0,0.4,0.2,0,0.005);
var id2 = igeo.genCircle(0.1,0.1,0,0.01,0.005);
var id3 = igeo.genCircle(0.2,0.1,0,0.01,0.005);
var id4 = igeo.genCircle(0.3,0.1,0,0.01,0.005);
var idsurf = igeo.genSurface([id1, id2, id3, id4], 1);
igeo.extrude("surface",[1],0,0,0.005,3, 0.005);

igeo.setGroup("volume",2,2,2);

igeo.setValue("Tol", 1e-5);

for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.0;
var x2 = 0.1 + 0.1 * i;
var y2 = 0.1;
var z2 = 0.015;
var hh = 0.005;
var vid1 = igeo.genCylinderV(x1, y1, z1 + 0.005, x2, y2, z2 - 0.005, 0.0, 0.008, 0.002, 0.002, 3 + 2 * i + 0);

var vid2 = igeo.genCylinderV(x1, y1, z1, x1, y1, z1 + 0.005, 0.0, 0.008, 0.002, 0.002, 3 + 2 * i + 1);
var vid3 = igeo.genCylinderV(x2, y2, z2 - 0.005, x2, y2, z2, 0.0, 0.008, 0.002, 0.002, 3 + 2 * i + 1);

var vid4 = igeo.genCylinderV(x1, y1, z1, x1, y1, z1 - hh, 0.0, 0.015, 0.002, 0.002, 3 + 2 * i + 1);
var vid5 = igeo.genCylinderV(x2, y2, z2, x2, y2, z2 + hh, 0.0, 0.015, 0.002, 0.002, 3 + 2 * i + 1);
igeo.glue ("volume", vid4, vid2);
igeo.glue ("volume", vid5, vid3);
}


imeshing.genMeshByGmsh(3);
