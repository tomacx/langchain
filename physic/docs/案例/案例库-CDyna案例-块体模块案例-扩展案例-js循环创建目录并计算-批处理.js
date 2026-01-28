setCurDir(getSrcDir());

var CurDir = getSrcDir();


var fso = new ActiveXObject("Scripting.FileSystemObject");

////创建10个文件，每个文件执行一个计算
for(var i = 0; i < 10; i++)
{
var NewDir = CurDir + "\\Case" + (i + 1);
var a = fso.CreateFolder(NewDir);

setCurDir(NewDir);

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");

blkdyn.GenBrick2D(5, (i + 1), 20, (i+1) * 4, 1);

blkdyn.SetModel("linear");
blkdyn.SetMat(2500,3e10,0.25, 3e6,1e6, 35, 15);

blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

dyna.Solve();

}