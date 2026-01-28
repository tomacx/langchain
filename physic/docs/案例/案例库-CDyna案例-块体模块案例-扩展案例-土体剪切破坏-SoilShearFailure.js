setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");

dyna.Set("Large_Displace 0");

dyna.Set("Output_Interval 200");

dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.4");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 0.00");

dyna.Set("If_Renew_Contact 1");

dyna.Set("SaveFile_Out 0");

dyna.Set("Interface_Soften_Value 1e-2 3e-2");

//接触面特征长度
dyna.Set("Indep_CharL 0.0005");

blkdyn.ImportGrid("gmsh", "soil.msh");

blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MC");
blkdyn.SetIModel("SSMC");

blkdyn.SetMatByGroup(1800, 5e7, 0.14, 130e3, 1e6, 36, 10.0, 1);

blkdyn.SetIStiffByElem(20.0);
blkdyn.SetIStrengthByElem();


//模型底部Y方向约束
blkdyn.FixVByCoord("xy", 0.0,-1e10, 1e10, -1e-4,1e-4, -1e10, 1e10);

//模型右侧X方向约束
blkdyn.FixVByCoord("x", 0.0, 0.061799, 0.061801, -1e10, 1e10, -1e10, 1e10);

//求解至稳定
dyna.Solve();

//模型左侧上部施加X方向水平准静态速度载荷，施加两侧，为了精确选择面的点，排除同一位置的两个点
blkdyn. FixBoundVByCoord("x", 5e-7,-0.001,0.001, 0.012501,0.025, -1e10, 1e10); 
blkdyn.FixVByCoord("x", 5e-7,-0.001,0.001, 0.01255,0.025, -1e10, 1e10);


//设置局部阻尼
blkdyn.SetLocalDamp(0.1);


dyna.Solve(5000);

print("Solution Finished");


