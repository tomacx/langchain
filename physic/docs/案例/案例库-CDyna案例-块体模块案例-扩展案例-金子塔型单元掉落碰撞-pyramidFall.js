setCurDir(getSrcDir());

dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");

dyna.Set("Renew_Interval 10");

var fCoord=new Array();
fCoord[0]=new Array(-5, -0.1, -5);
fCoord[1]=new Array(6, -0.1, -5);
fCoord[2]=new Array(6, -0.1, 6);
fCoord[3]=new Array(-5, -0.1, 6);
rdface.Create (2, 10, 4, fCoord);


blkdyn.ImportGrid("ansys","3col.dat");

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("linear");
blkdyn.SetMat(2500,3e9, 0.25, 3e3, 1e3, 10, 10);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStiffByElem(0.5);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01)

dyna.Solve(30000);