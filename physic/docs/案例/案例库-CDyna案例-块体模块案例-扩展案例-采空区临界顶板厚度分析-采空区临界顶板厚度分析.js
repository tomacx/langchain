setCurDir(getSrcDir());

dyna.Set("Gravity 0 -9.8 0");
dyna.Set("UnBalance_Ratio 1e-4");

dyna.Set("Output_Interval 1000000");

dyna.Set("Exit_Iter 30000");

blkdyn.GenBrick2D(60, 50, 60, 100,1);

blkdyn.SetModel("MC");
blkdyn.SetMat(2615, 53e9, 0.26, 1.0e6, 0.5e6, 28.7, 15);

blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 59.99, 61 );
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

blkdyn.SetModelByCoord("none", 10, 50, 10, 20, -1,1);

dyna.Solve();

for(i = 1; i < 30; i++)
{
dyna.Set("Iter_Now 0");
blkdyn.SetModelByCoord("none", -1000,1000, 50 - i, 50 - (i -1) ,-1,1);
dyna.Solve();

var exititer = dyna.GetValue("Iter_Now");

if(exititer >= 30000)
{
var linjieH =  30 - (i - 1);
print("该采空区的临界厚度为    " +  linjieH + " m");
break;
}
}

