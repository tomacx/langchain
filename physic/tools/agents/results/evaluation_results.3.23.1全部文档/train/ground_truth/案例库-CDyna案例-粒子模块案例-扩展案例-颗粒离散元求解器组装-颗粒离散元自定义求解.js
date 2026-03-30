setCurDir(getSrcDir());


dyna.Set("If_Virtural_Mass 0.0");
dyna.Set("Output_Interval 500");

dyna.Set("Contact_Detect_Tol 0.0");

//<TotalNo, GroupNo, type, radmin, radmax, embed, x[2],y[2],z[2]>
pdyna.CreateByCoord(2000,1,1,0.05,0.2,0.0, [0,5],[0,5],[0,5]);

pdyna.SetModel("brittleMC");

//<density, young, poisson, tension, cohesion, friction, localdamp, viscdamp >
pdyna. SetMat(2000,1e8, 0.3, 0.0, 0.0, 25, 0.0, 0.1);


var fCoord=new Array();
fCoord[0]=new Array(-10, 0.0, 0.0)
fCoord[1]=new Array(15.0, 0.0, 0.0)
rdface.Create(1, 1, 2, fCoord);


dyna.TimeStepCorrect();

//调用系统集成求解器
//dyna.Solve();





////自己组装求解器
dyna.BeforeCal();

for(var i = 1; i <= 10000; i++)
{

if(i % 10 == 0)
{
pdyna.CellMapping();
pdyna.DetectContactAll();
}

pdyna.CalPPContact();
pdyna.CalPFContact();

var fratio = pdyna.CalMovement();

pdyna.PostProcess();


if(i % 100 == 0)
{

print("已经迭代  "  +  i  + "  步, 系统不平衡率为:  "  + fratio);
}

if(i % 500 == 0)
{
var ftime = dyna.GetValue("Time_Now");
dyna.PutStep(i, i, ftime );
}

}

print("！！！！！！本次求解结束！！！！！")
