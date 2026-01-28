setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

igeo.genRectS(0,0,0,10,2,0,0.3,1);
igeo.genRectS(0,2,0,10,4,0,0.3,2);

imeshing.genMeshByGmsh(2);

dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 1e-2");

//dyna.Set("If_Contact_Use_FaceMat 1");

//刚性面施加性质
//x=new Array(-100,100.0);//坐标x的取值范围
//y=new Array(-100,100.0);//坐标y的取值范围
//z=new Array(-100,100.0); //坐标z的取值范围
//rdface.SetPropByCoord (1e10, 1e10,0,0,0, x,y,z);

//dyna.Set("If_Contact_Use_GlobMat 1 2 1e10 1e10 0 0 0");

dyna.Set("Block_Rdface_Contact_Scheme 3");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e8, 0.3, 1e6, 1e6, 35, 15);

blkdyn.SetIModel("linear");

blkdyn.SetIMat(5e9, 5e9, 10, 0,0);

blkdyn.SetLocalDamp(0.8);

var fCoord=new Array();

fCoord[0]=new Array(0,-3,0)
fCoord[1]=new Array(0,5,0)
rdface.Create (1, 1, 2, fCoord);

fCoord[0]=new Array(10,-3,0)
fCoord[1]=new Array(10,5,0)
rdface.Create (1, 1, 2, fCoord);

for(var i = 0; i < 5; i++)
{
fCoord[0]=new Array(i * 2,0,0)
fCoord[1]=new Array(i * 2 + 2,0,0)
rdface.Create (1, 2 + i, 2, fCoord);
}


fCoord[0]=new Array(0,-3,0)
fCoord[1]=new Array(10,-3,0)
rdface.Create (1, 1, 2, fCoord);


for(var i = 0; i < 4; i++)
{
fCoord[0]=new Array(i * 2 + 2,-3,0)
fCoord[1]=new Array(i * 2 + 2,0,0)
rdface.Create (1, 1, 2, fCoord);
}

dyna.TimeStepCorrect(0.5);

dyna.Solve();

blkdyn.SetIModel("brittleMC");

dyna.Solve();


blkdyn.SetLocalDamp(0.02);

for(var i = 0; i < 5; i++)
{

dyna.Set("Elem_Out_Kill 2 " +  (i * 2) + " " + (i * 2 + 2) + " -1 0 -100 100 1");

dyna.Set("Elem_Out_Stop_Cal 1 2 2 0.1");

rdface.SetModelByGroup (0, i + 2, i + 2);

dyna.Solve();

rdface.SetModelByGroup (1, i + 2, i + 2);
}



dyna.Set("Elem_Out_Stop_Cal 0 2 2 0.1");

dyna.Solve();








