setCurDir(getSrcDir());

// 1. Initialize connection and print simulation start log using Set_String_To_Host
print("=== BlockFall Simulation Started ===");

// 2. Set global simulation parameters using dyna.Set (SetGlobalValue)
dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-1");
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");

// 3. Define block model geometry via RunUDFCmd
var blockSize = new Array(2, 2, 1);
var startX = new Array(-10, 10);
var startY = new Array(-10, 10);
var startZ = new Array(5, 15);

dyna.RunUDFCmd("CreateBlock " + blockSize[0] + " " + blockSize[1] + " " + blockSize[2] + " " + startX[0] + " " + startX[1] + " " + startY[0] + " " + startY[1] + " " + startZ[0] + " " + startZ[1]);

// 4. Configure monitoring variables via RunUDFCmdAdv
var monitorCmd = "SetMonitor xdis ydis zdis vx vy vz";
dyna.RunUDFCmdAdv(monitorCmd, []);

// 5. Set coordinate range limits for block gradation curve analysis
xRange = new Array(-10, 10);
yRange = new Array(-10, 10);
zRange = new Array(0, 20);
blkdyn.ExportGradationCurveByCoord(xRange, yRange, zRange);

// 6. Execute pre-calculation setup tasks using Dyna_BeforeCal
dyna.BeforeCal();

// 7. Run the core calculation solver loop using Dyna_Solver
dyna.Solver(10000);

// 8. Export line monitoring data results to a text file using blkdyn ExportResultDataByLine
lineStart = new Array(-5, -5, 0);
lineEnd = new Array(5, 5, 0);
blkdyn.ExportResultDataByLine("xdis", lineStart, lineEnd, 10);

// 9. Push final step result data to the host platform using Set_ResultData_To_Host
dyna.PutStep();

// 10. Print simulation completion status and release dynamic link library resources
print("=== BlockFall Simulation Completed ===");
dyna.FreeUDF();
