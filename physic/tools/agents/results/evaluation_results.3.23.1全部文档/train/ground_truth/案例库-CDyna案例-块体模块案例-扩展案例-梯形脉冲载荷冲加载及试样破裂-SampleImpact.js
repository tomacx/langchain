setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 500");


dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 1e-3");

dyna.Set("If_Renew_Contact 1");

dyna.Set("If_Cal_EE_Contact 1");

dyna.Set("Config_Crack_Show 1");

blkdyn.ImportGrid("gmsh","GDEMNew.msh");

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(3300, 6e10, 0.25, 36e6, 12e6, 40.0, 10.0);

blkdyn.SetIModel("FracE");

blkdyn.SetIStiffByElem(50.0);
blkdyn.SetIStrengthByElem();
blkdyn.SetIFracEnergyByCoord(200, 2000, -10, 10, -10, 10, -10, 10);

dyna.Monitor("block","syy", 0.000, 0.025, 0);
dyna.Monitor("block","syy", 0.005, 0.025, 0);
dyna.Monitor("block","syy", 0.010, 0.025, 0);
dyna.Monitor("block","syy", 0.015, 0.025, 0);
dyna.Monitor("block","syy", 0.020, 0.025, 0);
dyna.Monitor("block","syy", 0.025, 0.025, 0);

dyna.Monitor("gvalue", "gv_spring_broken_ratio");
dyna.Monitor("gvalue", "gv_spring_crack_ratio");
dyna.Monitor("gvalue", "gv_block_strain_energy");
dyna.Monitor("gvalue", "gv_block_kinetic_energy");
dyna.Monitor("gvalue", "gv_contact_strain_energy");


//设置三个方向载荷系数
var coeff=new Array(0.0, 1.0, 0.0);
//x方向下限及上限
var x= new Array(-10,10);
//y方向下限及上限
var y= new Array(0.02499, 0.251);
//z方向下限及上限
var z= new Array(-10,10.0);

blkdyn.ApplyDynaLineVarByCoord ("velocity",false,coeff, 0.0, 0.0, 30e-6, -5.0 ,x,y,z);
blkdyn.ApplyDynaLineVarByCoord ("velocity",false,coeff, 30e-6, -5.0 , 220e-6, -5.0, x,y,z);
blkdyn.ApplyDynaLineVarByCoord ("velocity",false,coeff, 220e-6, -5.0, 250e-6, 0.0, x,y,z);
blkdyn.ApplyDynaLineVarByCoord ("velocity",false,coeff, 250e-6, 0.0, 300e-6, 0.0, x,y,z);


blkdyn.FixV("y", 0.0, "y", -1e-5, 1e-5);

blkdyn.SetLocalDamp(0.02);

dyna.Monitor("block", "xdis", 0, 10, 0);
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);
dyna.Monitor("gvalue", "gv_spring_crack_ratio");


dyna.TimeStepCorrect(0.5);

dyna.DynaCycle(300e-6);


print("Solution Finished");
