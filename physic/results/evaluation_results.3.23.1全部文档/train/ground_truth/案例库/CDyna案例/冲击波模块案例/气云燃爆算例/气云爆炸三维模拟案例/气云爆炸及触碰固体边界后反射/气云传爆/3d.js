setCurDir(getSrcDir());

dyna.Set("Time_Step 2e-4");
dyna.Set("Output_Interval 100");
dyna.Set("SK_GasModel  2");
dyna.Set("SK_ActT 502.0");
dyna.Set("SK_HeatQ 0.5196e6");
dyna.Set("SK_MolMass 36");
dyna.Set("SK_Gama 1.4");

skwave.DefMesh(3, [1000, 500, 500], [100, 50, 50]);

skwave.SetSolid(1, -1e5,  1e5, -100, 20, -1e5, 1e5);
skwave.SetSolid(1, 600, 650, -1e5, 350, 150, 350);

skwave.SetGasCloudBySphere(1, [400, 250, 250], 200);


skwave.InitBySphere(8.321e4, 1.201, [0,0,0], [0,0, 0], 10000.0);
skwave.SetFirePos(400, 250, 250, 20, 1.945, 4.162E2,  6.27E5);

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
