setCurDir(getSrcDir());


dyna.Clear();
doc.clearResult();


dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Config_Crack_Show 1");

dyna.Set("If_Contact_Use_GlobMat 1 1 1e12 1e12 1e6 1e6 0");

blkdyn.ImportGrid("gid","bar-fine.msh");

blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.CrtIFaceByCoord(0.02, 0.18,-1,1,-1,1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MC");
blkdyn.SetMat(7800,2.1e11,0.25,235e6,235e6,0,0);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIStiffByElem(1.0);

blkdyn.SetIStrengthByElem();


rdface.Import("gid","rotaAppBound.msh");
var forigin = [0,0,0];
var fnormal = [1,0,0];

var fGlobV = [0,0,0];

rdface.ApplyRotateCondition(1,forigin, fnormal, 5e-6, 0.0, fGlobV, 2,2);

rdface.ApplyRotateCondition(2,forigin, fnormal, -5e-6, 0.0, fGlobV, 3,3);

dyna.Solve(100000);

