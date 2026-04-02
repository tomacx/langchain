setCurDir(getSrcDir());


dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 1e-4");


pdyna.Import("gid","par.msh");

pdyna.SetModel("brittleMC");

pdyna. SetMat(2500, 5e7, 0.25, 0, 0, 10, 0.8,0.1);

var fCoord=new Array();

fCoord[0]=new Array(0,-3,0)
fCoord[1]=new Array(0,5,0)
rdface.Create (1, 1, 2, fCoord);

fCoord[0]=new Array(10,-3,0)
fCoord[1]=new Array(10,5,0)
rdface.Create (1, 1, 2, fCoord);

for(var i = 0; i < 5; i++)
{
fCoord[0]=new Array(i * 2,0,0)
fCoord[1]=new Array(i * 2 + 2,0,0)
rdface.Create (1, 2 + i, 2, fCoord);
}


fCoord[0]=new Array(0,-3,0)
fCoord[1]=new Array(10,-3,0)
rdface.Create (1, 1, 2, fCoord);


for(var i = 0; i < 4; i++)
{
fCoord[0]=new Array(i * 2 + 2,-3,0)
fCoord[1]=new Array(i * 2 + 2,0,0)
rdface.Create (1, 1, 2, fCoord);
}

dyna.TimeStepCorrect(0.5);

dyna.Solve();


pdyna. SetMat(2500, 5e7, 0.25, 0, 0, 10, 0.0,0.1);


for(var i = 0; i < 5; i++)
{

dyna.Set("Particle_Out_Kill 2 " +  (i * 2) + " " + (i * 2 + 2) + " -1 0 -100 100 1");

dyna.Set("Particle_Out_Stop_Cal 1 2 2 0.1");

rdface.SetModelByGroup (0, i + 2, i + 2);

dyna.Solve();

rdface.SetModelByGroup (1, i + 2, i + 2);
}



dyna.Set("Particle_Out_Stop_Cal 0 2 2 0.1");

dyna.Solve();
