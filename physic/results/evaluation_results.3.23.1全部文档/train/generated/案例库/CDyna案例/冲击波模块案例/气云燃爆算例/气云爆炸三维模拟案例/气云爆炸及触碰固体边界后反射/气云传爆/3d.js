setCurDir(getSrcDir());

dyna.Set("Time_Step", 1e-5);
dyna.Set("Output_Interval", 100);
dyna.Set("SK_GasModel", 2);

skwave.DefMesh(2, [20, 10], [200, 100]);

// Define solids
skwave.SetSolid(1, -1, 21, -1, 2, -1, 1);
skwave.SetSolid(1, 7, 9, -1, 5, -1, 1);

// Define gas cloud
skwave.SetGasCloud(1, -1, 7, -1, 11, -1, 1);

// Initialize by sphere
skwave.InitBySphere(8.321e4, 1.21, [0, 0, 0], [0, 0, 0], 100.0);

// Set fire position
skwave.SetFirePos(3, 5, 0, 0.5, 1.945, 4.162E2, 6.27E5);

// Monitor points for density
dyna.Monitor("skwave", "sw_dens", 5, 5, 0);
dyna.Monitor("skwave", "sw_dens", 10, 5, 0);
dyna.Monitor("skwave", "sw_dens", 15, 5, 0);

// Monitor points for pressure
dyna.Monitor("skwave", "sw_pp", 5, 5, 0);
dyna.Monitor("skwave", "sw_pp", 10, 5, 0);
dyna.Monitor("skwave", "sw_pp", 15, 5, 0);

// Monitor points for temperature
dyna.Monitor("skwave", "sw_temp", 5, 5, 0);
dyna.Monitor("skwave", "sw_temp", 10, 5, 0);
dyna.Monitor("skwave", "sw_temp", 15, 5, 0);

// Monitor points for gas type
dyna.Monitor("skwave", "sw_gastype", 5, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 10, 5, 0);
dyna.Monitor("skwave", "sw_gastype", 15, 5, 0);

// Run simulation
dyna.DynaCycle(1e-1);

print("求解完成");
