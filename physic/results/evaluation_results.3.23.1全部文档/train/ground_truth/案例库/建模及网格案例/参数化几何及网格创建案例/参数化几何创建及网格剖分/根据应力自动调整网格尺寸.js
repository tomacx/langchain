setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();
igeo.clear();
doc.clearResult();

var id1= igeo.genCircle(0.5,0.5,0,0.2,0.1);
var id2= igeo.genRect(0,0,0,1,1,0,0.1);

var loop = [id1, id2];

igeo.genSurface(loop, 1);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

blkdyn.SetMat(2500, 3e10,0.25, 1e6,3e6,35,15);

blkdyn.FixV("xyz",0,"y",-1,0.001);

dyna.Solve();


var PointValue = new Array();

var minv = 1e20;
var maxv = -1e20;

var totalelem = Math.round( dyna.GetValue("Total_Block_Num") );

for(var i = 1; i <= totalelem; i++)
{

PointValue[i - 1] = new Array(4);

PointValue[i - 1][0] = blkdyn.GetElemValue(i, "Centroid",1);
PointValue[i - 1][1] = blkdyn.GetElemValue(i, "Centroid",2);
PointValue[i - 1][2] = blkdyn.GetElemValue(i, "Centroid",3);

PointValue[i - 1][3] = blkdyn.GetElemValue(i, "PrincipalStress",1);

if(PointValue[i - 1][3] > maxv)
{
maxv = PointValue[i - 1][3];
}

if(PointValue[i - 1][3] < minv)
{
minv = PointValue[i - 1][3];
}
}

var DeltaV = maxv - minv;

for(var i = 0; i < totalelem; i++)
{

PointValue[i][3] = (PointValue[i][3] - minv) / DeltaV;

}

var SizeBound = new Array(8);

SizeBound[0] =  blkdyn.GetElemValue( blkdyn.GetElemID(0,0,0), "PrincipalStress",1);
SizeBound[1] =  blkdyn.GetElemValue( blkdyn.GetElemID(1,0,0), "PrincipalStress",1);
SizeBound[2] =  blkdyn.GetElemValue( blkdyn.GetElemID(1,1,0), "PrincipalStress",1);
SizeBound[3] =  blkdyn.GetElemValue( blkdyn.GetElemID(0,1,0), "PrincipalStress",1);
SizeBound[4] =  blkdyn.GetElemValue( blkdyn.GetElemID(0.7,0.5,0), "PrincipalStress",1);
SizeBound[5] =  blkdyn.GetElemValue( blkdyn.GetElemID(0.5,0.7,0), "PrincipalStress",1);
SizeBound[6] =  blkdyn.GetElemValue( blkdyn.GetElemID(0.3,0.5,0), "PrincipalStress",1);
SizeBound[7] =  blkdyn.GetElemValue( blkdyn.GetElemID(0.5,0.3,0), "PrincipalStress",1);


for(var i = 0; i < 8; i++)
{

SizeBound[i] = (SizeBound[i] - minv) / DeltaV;

}




dyna.Clear();
imeshing.clear();
igeo.clear();
doc.clearResult();


var MaxSize = 0.05;
var MinSize = 0.002;

var id1= igeo.genCircle(0.5,0.5,0,0.2,MaxSize);
var id2= igeo.genRect(0,0,0,1,1,0,MaxSize);

var loop = [id1, id2];

var id = igeo.genSurface(loop, 1);



for(var i = 0; i < totalelem; i++)
{
var size = PointValue[i][3] * (MaxSize - MinSize) + MinSize;

var idno = igeo.genPoint(PointValue[i][0], PointValue[i][1], PointValue[i][2], size);

igeo.setHardPointToFace(idno, id);

}


for(var i = 0; i < 8; i++)
{
SizeBound[i] = SizeBound[i] * (MaxSize - MinSize) + MinSize;
}

igeo.setSize("point", SizeBound[0], igeo.getID("point",0,0,0), igeo.getID("point",0,0,0));
igeo.setSize("point", SizeBound[1], igeo.getID("point",1,0,0), igeo.getID("point",1,0,0));
igeo.setSize("point", SizeBound[2], igeo.getID("point",1,1,0), igeo.getID("point",1,1,0));
igeo.setSize("point", SizeBound[3], igeo.getID("point",0,1,0), igeo.getID("point",0,1,0));
igeo.setSize("point", SizeBound[4], igeo.getID("point",0.7,0.5,0), igeo.getID("point",0.7,0.5,0));
igeo.setSize("point", SizeBound[5], igeo.getID("point",0.5,0.7,0), igeo.getID("point",0.5,0.7,0));
igeo.setSize("point", SizeBound[6], igeo.getID("point",0.3,0.5,0), igeo.getID("point",0.3,0.5,0));
igeo.setSize("point", SizeBound[7], igeo.getID("point",0.5,0.3,0), igeo.getID("point",0.5,0.3,0));

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

blkdyn.SetMat(2500, 3e10,0.25, 1e6,3e6,35,15);

blkdyn.FixV("xyz",0,"y",-1,0.001);

dyna.Solve();
