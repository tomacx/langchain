setCurDir(getSrcDir());

dyna.Clear();
//doc.ClearResult();

dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 50");
dyna.Set("Monitor_Iter 2");


/////球形tnt，密度1.62，半径100mm，测点100mm至1000mm，网格尺寸5mm。

skwave.DefMesh(3, [1,1,1], [100,100,100], [0, 0, 0]);

//设定变gama模型
skwave.SetGama(2,1620.0, 6930.0, 4.5e6, 3.0, 4.0 / 3.0);

skwave.InitBySphere(1.01e5, 1.02, [0,0,0], [0,0,0], 1000.0);

skwave.InitBySphere(9.725e9, 1620, [0,0,0], [0,0,0], 0.1);

//设置边界透射、反射条件，1/8模型
skwave.SetBound(1, 0, 1, 0, 1, 0);


dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(0.3);


//爆轰压力,6m
for(var i = 0; i < 10; i++)
{
dyna.Monitor("skwave","sw_pp", (i + 1) * 0.1, 0, 0);
}

for(var i = 0; i < 10; i++)
{
dyna.Monitor("skwave","sw_pp",  0, (i + 1) * 0.1, 0);
}

for(var i = 0; i < 10; i++)
{
dyna.Monitor("skwave","sw_pp",  0, 0, (i + 1) * 0.1);
}

dyna.DynaCycle(4e-4);
