setCurDir(getSrcDir());

dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");
dyna.Set("Contact_Detect_Tol 0.0");

var xx = [0,0.5];
var yy = [0,0.5];
var zz = [0,0];

pdyna.CreateByCoord(10000, 1, 1, 0.002, 0.02, 0,xx,yy,zz);


pdyna.SetModel("brittleMC");

pdyna. SetMat(2500, 1e7, 0.25, 0,0,0,0,0.1);

var aCoord = new Array(2);

aCoord[0] = [0,0,0];
aCoord[1] = [0.5,0,0];
rdface.Create(1,1,2,aCoord);

aCoord[0] = [0.5,0,0];
aCoord[1] = [0.5,0.5,0];
rdface.Create(1,2,2,aCoord);

aCoord[0] = [0.5,0.5,0];
aCoord[1] = [0,0.5,0];
rdface.Create(1,3,2,aCoord);

aCoord[0] = [0,0,0];
aCoord[1] = [0,0.5,0];
rdface.Create(1,4,2,aCoord);

var vel = 1e-5;

rdface.ApplyVelocityByGroup ([0,vel,0], 1, 1);

rdface.ApplyVelocityByGroup ([-vel,0,0],2,2);

rdface.ApplyVelocityByGroup ([0,-vel,0], 3, 3);

rdface.ApplyVelocityByGroup ([vel,0,0],4,4);

dyna.TimeStepCorrect(0.5);


dyna.Solve(8000);
