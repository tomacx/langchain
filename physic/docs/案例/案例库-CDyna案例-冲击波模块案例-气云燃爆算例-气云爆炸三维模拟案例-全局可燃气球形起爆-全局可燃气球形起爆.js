setCurDir(getSrcDir());

dyna.Set("Time_Step 3e-4");
dyna.Set("Output_Interval 100");
dyna.Set("SK_GasModel  2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

skwave.DefMesh(3, [1000, 500,100], [200, 200, 60]);

skwave.SetSolid(1, 140,  220, 190, 310, -50, 50);
skwave.SetSolidByCylinder(1, [800, 250, -30],  [800, 250, 30], 0, 30);

skwave.SetSolid(0, 200, 240, 230, 270, 20, 60);


skwave.SetGasCloud(1, 0, 200, 0, 500, -100,200);
skwave.SetGasCloudByCylinder(1, [600, 250, -100], [600, 250, 100], 0, 100);
skwave.SetGasCloud(1, 500, 700, 150, 350, -70, 70);

skwave.SetGasCloud(0, 0, 400, 0, 500, 50,100);
skwave.SetGasCloudByCylinder(0, [600, 150, -30],  [600, 150, 30], 0, 30);


skwave.InitBySphere(8.321e4, 1.201, [0,0,0], [0,0, 0], 10000.0);

skwave.SetFirePos(600, 250, 0, 20, 1.945, 4.162E2,  6.27E5);

skwave.SetBound(0,0,0, 0,1,0);

for(var i = 1; i < 10; i++)
{
dyna.Monitor("skwave","sw_dens", 100 * i, 250, 50);
}

for(var i = 1; i < 10; i++)
{
dyna.Monitor("skwave","sw_pp", 100 * i, 250, 50);
}

for(var i = 1; i < 10; i++)
{
dyna.Monitor("skwave","sw_temp", 100 * i, 250, 50);
}


dyna.DynaCycle(10);

print("求解完成");