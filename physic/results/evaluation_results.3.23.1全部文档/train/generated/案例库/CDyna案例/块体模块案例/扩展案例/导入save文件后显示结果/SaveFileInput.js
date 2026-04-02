setCurDir(getSrcDir());

dyna.Set("Output_Interval 500");
dyna.Set("SaveFile_Out 1");

blkdyn.GenBrick3D(5,5,5,10,10,10,1);
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.2, 3e5, 1e5, 35, 15);
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 导入并显示保存的文件
dyna.Restore("SaveFileInput.sav");
dyna.PutStep();

var str = "Result\\SaveFileInput.sav";
dyna.Restore(str);
dyna.PutStep();
