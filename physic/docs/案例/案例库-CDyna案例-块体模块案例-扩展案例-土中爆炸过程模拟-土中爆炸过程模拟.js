setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var fx = 10;
var fy = 5;
var frad = 0.3;
var size = 0.1;


var id1 = igeo.genRect(0,0,0,fx,fy,0,size);
var id2 = igeo.genCircle(fx * 0.5, fy *0.6, 0, frad, size);

igeo.genSurface([id1, id2],1);
igeo.genSurface(id2,2);

imeshing.genMeshByGmsh(2);

dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 0 0");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace(1,2);
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("MC");
blkdyn.SetMat(2200,2.1e10,0.3,3e5,1e5,30,15);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(1e12,1e12,0,0,0);

blkdyn.SetModel("Landau",2);
var apos = [fx * 0.5, fy *0.6, 0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);
blkdyn.BindLandauSource(1, 2, 2);

blkdyn.SetLocalDamp(0.05);

blkdyn.FixV("x",0,"x",-0.01,0.001);
blkdyn.FixV("x",0,"x",fx- 0.001, fx + 0.001);
blkdyn.FixV("y",0,"y",-0.001,0.001);

dyna.TimeStepCorrect(0.01);

dyna.DynaCycle(2e-3);