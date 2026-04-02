setCurDir(getSrcDir());

dyna.Set("Time_Step 3e-4");
dyna.Set("Output_Interval 100");
dyna.Set("SK_GasModel  2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

skwave.DefMesh(2, [1000, 500], [500, 250]);

skwave.SetSolid(1, 150,  250, -100, 100, -1, 1);
skwave.SetSolidBySphere(1, [400, 0, 0],  75);
skwave.SetSolid(1, 540, 660, -120, 120, -1, 1);

skwave.SetSolid(0, 130, 170, -20, 20, -1, 1);
skwave.SetSolid(0, 285, 365, 35, 115, -1, 1);


skwave.SetGasCloud(1, 0, 400, -500, 500, -1,1);
skwave.SetGasCloudBySphere(1, [600, 300, 0], 75);
skwave.SetGasCloud(1, 740, 860, -120, 120, -1,1);

skwave.SetGasCloud(0, 0, 400, 200, 500, -1,1);
skwave.SetGasCloudBySphere(0, [800, 0, 0], 40);


skwave.InitBySphere(8.321e4, 1.201, [0,0,0], [0,0, 0], 10000.0);
skwave.SetFirePos(300, 0, 0, 20, 1.945, 4.162E2,  6.27E5);

skwave.SetBound(0,0,1,0);

for(var i = 1; i < 10; i++)
{
dyna.Monitor("skwave","sw_dens", 100 * i, 250, 0);
}

for(var i = 1; i < 10; i++)
{
dyna.Monitor("skwave","sw_pp", 100 * i, 250, 0);
}


dyna.DynaCycle(10);

print("求解完成");
