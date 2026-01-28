setCurDir(getSrcDir());

dyna.Set("Output_Interval 500");

dyna.Set("SaveFile_Out 1");

blkdyn.GenBrick3D(5,5,5,10,10,10,1);

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e10, 0.2, 3e5, 1e5, 35, 15);

blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

//dyna.Solve(10000);

for(var i = 1; i < 20; i++)
{
var str = "Result\\" + i * 500 + ".sav";
dyna.Restore(str);
dyna.PutStep();
}