setCurDir(getSrcDir());

// Clear previous data
igeo.Clear();
imeshing.Clear();
dyna.Clear();
doc.ClearResult();

// Define coordinates for the polygon shape
var acoord = new Array(6);
var size = 1.0;
acoord[0] = [0,0,0,  size];
acoord[1] = [40,0,0,  size];
acoord[2] = [40,25,0,  size];
acoord[3] = [20,25,0,  size];
acoord[4] = [10,10,0,  size];
acoord[5] = [0,10,0,  size];

// Generate the polygon shape
igeo.genPloygenS(acoord, 1);

// Mesh generation using Gmsh
imeshing.genMeshByGmsh(2);

// Set output interval and gravity
dyna.Set("Output_Interval", 1000);
dyna.Set("Gravity", [0, -9.8, 0]);

// Enable pore seepage calculation
dyna.Set("Config_PoreSeepage", 1);
dyna.Set("PoreSeepage_Cal", 0);

// Get mesh for block dynamics
blkdyn.GetMesh(imeshing);

// Set model and material properties
blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

// Define permeability coefficients in X, Y, Z directions
var arrayK = new Array(1e-10, 1e-10, 1e-10);

// Set pore seepage properties within a coordinate range
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// Fix boundary conditions
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// Monitor displacement at specific points
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// Solve the initial problem
dyna.Solve();

// Soften material properties for further analysis
dyna.Set("Block_Soften_Value", [3e-3, 9e-3]);
blkdyn.SetModel("SoftenMC");

// Solve again with softened material properties
dyna.Solve();

// Initialize conditions by group
blkdyn.InitConditionByGroup("displace", [0,0,0], [0,0,0,0,0,0,0,0,0], 1, 1);

// Enable pore seepage calculation and Biot's coefficient calculation
dyna.Set("PoreSeepage_Cal", 1);
dyna.Set("If_Biot_Cal", 1);

// Set current time to zero and correct time step
dyna.Set("Time_Now", 0);
dyna.TimeStepCorrect(1.0);

print("Solution Finished");
