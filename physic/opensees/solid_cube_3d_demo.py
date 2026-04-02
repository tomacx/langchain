from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, Optional, Tuple

try:
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D  # noqa: F401
    from matplotlib.axes import Axes
    from matplotlib.figure import Figure
except ModuleNotFoundError:
    plt = None
    Axes = Any
    Figure = Any

try:
    import openseespy.opensees as ops
except ModuleNotFoundError:
    ops = None


NodeXYZ = Tuple[float, float, float]
Brick8Conn = Tuple[int, int, int, int, int, int, int, int]


@dataclass(frozen=True)
class SolidModel3D:
    nodes: Dict[int, NodeXYZ]
    elements: Dict[int, Brick8Conn]
    fixities: Dict[int, Tuple[int, int, int]]
    nodal_loads: Dict[int, Tuple[float, float, float]]


def _set_axes_equal_3d(ax: Axes) -> None:
    x0, x1 = ax.get_xlim3d()
    y0, y1 = ax.get_ylim3d()
    z0, z1 = ax.get_zlim3d()

    cx = 0.5 * (x0 + x1)
    cy = 0.5 * (y0 + y1)
    cz = 0.5 * (z0 + z1)
    r = 0.5 * max(x1 - x0, y1 - y0, z1 - z0, 1e-9)

    ax.set_xlim3d(cx - r, cx + r)
    ax.set_ylim3d(cy - r, cy + r)
    ax.set_zlim3d(cz - r, cz + r)


def _grid_node_tag(i: int, j: int, k: int, nx: int, ny: int) -> int:
    return 1 + i + (nx + 1) * (j + (ny + 1) * k)


def build_unit_cube_solid_model(
    *,
    nx: int = 1,
    ny: int = 1,
    nz: int = 1,
    Lx: float = 1.0,
    Ly: float = 1.0,
    Lz: float = 1.0,
    E: float = 2.1e11,
    nu: float = 0.3,
    rho: float = 0.0,
    total_top_load_fz: float = -1.0e6,
) -> SolidModel3D:
    nodes: Dict[int, NodeXYZ] = {}
    elements: Dict[int, Brick8Conn] = {}
    fixities: Dict[int, Tuple[int, int, int]] = {}
    nodal_loads: Dict[int, Tuple[float, float, float]] = {}

    dx = Lx / nx
    dy = Ly / ny
    dz = Lz / nz

    for k in range(nz + 1):
        for j in range(ny + 1):
            for i in range(nx + 1):
                tag = _grid_node_tag(i, j, k, nx, ny)
                nodes[tag] = (i * dx, j * dy, k * dz)
                if k == 0:
                    fixities[tag] = (1, 1, 1)

    ele_tag = 1
    for k in range(nz):
        for j in range(ny):
            for i in range(nx):
                n000 = _grid_node_tag(i, j, k, nx, ny)
                n100 = _grid_node_tag(i + 1, j, k, nx, ny)
                n110 = _grid_node_tag(i + 1, j + 1, k, nx, ny)
                n010 = _grid_node_tag(i, j + 1, k, nx, ny)
                n001 = _grid_node_tag(i, j, k + 1, nx, ny)
                n101 = _grid_node_tag(i + 1, j, k + 1, nx, ny)
                n111 = _grid_node_tag(i + 1, j + 1, k + 1, nx, ny)
                n011 = _grid_node_tag(i, j + 1, k + 1, nx, ny)
                elements[ele_tag] = (n000, n100, n110, n010, n001, n101, n111, n011)
                ele_tag += 1

    top_nodes = [
        _grid_node_tag(i, j, nz, nx, ny) for j in range(ny + 1) for i in range(nx + 1)
    ]
    per_node_fz = total_top_load_fz / max(len(top_nodes), 1)
    for node_tag in top_nodes:
        nodal_loads[node_tag] = (0.0, 0.0, per_node_fz)

    if ops is not None:
        ops.wipe()
        ops.model("basic", "-ndm", 3, "-ndf", 3)

        for node_tag, (x, y, z) in nodes.items():
            ops.node(node_tag, x, y, z)

        for node_tag, (fx, fy, fz) in fixities.items():
            ops.fix(node_tag, fx, fy, fz)

        ops.nDMaterial("ElasticIsotropic", 1, E, nu, rho)

        for tag, conn in elements.items():
            ops.element("stdBrick", tag, *conn, 1)

        ops.timeSeries("Linear", 1)
        ops.pattern("Plain", 1, 1)
        for node_tag, (fx, fy, fz) in nodal_loads.items():
            ops.load(node_tag, fx, fy, fz)

    return SolidModel3D(nodes=nodes, elements=elements, fixities=fixities, nodal_loads=nodal_loads)


def plot_solid_mesh_3d(
    model: SolidModel3D,
    *,
    node_labels: bool = False,
    element_labels: bool = False,
    show_supports: bool = True,
    show_loads: bool = True,
    ax: Optional[Axes] = None,
) -> Tuple[Figure, Axes]:
    if plt is None:
        raise RuntimeError("matplotlib 未安装，无法绘图。请先安装 matplotlib。")

    if ax is None:
        fig = plt.figure(figsize=(7, 5))
        ax = fig.add_subplot(111, projection="3d")
    else:
        fig = ax.figure

    edges = (
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 0),
        (4, 5),
        (5, 6),
        (6, 7),
        (7, 4),
        (0, 4),
        (1, 5),
        (2, 6),
        (3, 7),
    )

    for ele_tag, conn in model.elements.items():
        pts = [model.nodes[n] for n in conn]
        for a, b in edges:
            xa, ya, za = pts[a]
            xb, yb, zb = pts[b]
            ax.plot([xa, xb], [ya, yb], [za, zb], color="C0", linewidth=1.5, zorder=2)

        if element_labels:
            cx = sum(p[0] for p in pts) / 8.0
            cy = sum(p[1] for p in pts) / 8.0
            cz = sum(p[2] for p in pts) / 8.0
            ax.text(cx, cy, cz, str(ele_tag), color="C0", fontsize=9, zorder=4)

    xs = [p[0] for p in model.nodes.values()]
    ys = [p[1] for p in model.nodes.values()]
    zs = [p[2] for p in model.nodes.values()]
    ax.scatter(xs, ys, zs, s=18, color="k", zorder=3)

    if node_labels:
        for tag, (x, y, z) in model.nodes.items():
            ax.text(x, y, z, f" {tag}", fontsize=8, zorder=4)

    if show_supports:
        sup = [tag for tag, (fx, fy, fz) in model.fixities.items() if (fx, fy, fz) == (1, 1, 1)]
        if sup:
            sx = [model.nodes[t][0] for t in sup]
            sy = [model.nodes[t][1] for t in sup]
            sz = [model.nodes[t][2] for t in sup]
            ax.scatter(sx, sy, sz, s=45, marker="s", color="0.25", zorder=5)

    if show_loads and model.nodal_loads:
        mags: Iterable[float] = (
            (fx * fx + fy * fy + fz * fz) ** 0.5 for (fx, fy, fz) in model.nodal_loads.values()
        )
        max_mag = max(mags, default=0.0)
        size = max(max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs), 1.0)
        scale = 0.25 * size / (max_mag if max_mag > 0 else 1.0)
        for node_tag, (fx, fy, fz) in model.nodal_loads.items():
            if fx == 0.0 and fy == 0.0 and fz == 0.0:
                continue
            x, y, z = model.nodes[node_tag]
            ax.quiver(
                x,
                y,
                z,
                fx * scale,
                fy * scale,
                fz * scale,
                color="C3",
                linewidth=1.5,
                arrow_length_ratio=0.2,
                normalize=False,
                zorder=6,
            )

    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")
    _set_axes_equal_3d(ax)
    return fig, ax


def plot_deformed_mesh_3d(
    model: SolidModel3D,
    *,
    sfactor: float = 50.0,
    ax: Optional[Axes] = None,
) -> Tuple[Figure, Axes]:
    if plt is None:
        raise RuntimeError("matplotlib 未安装，无法绘图。请先安装 matplotlib。")
    if ops is None:
        raise RuntimeError("openseespy 未安装，无法读取节点位移来绘制变形图。")

    disps: Dict[int, NodeXYZ] = {}
    for node_tag in model.nodes.keys():
        disps[node_tag] = (
            float(ops.nodeDisp(node_tag, 1)),
            float(ops.nodeDisp(node_tag, 2)),
            float(ops.nodeDisp(node_tag, 3)),
        )

    if ax is None:
        fig = plt.figure(figsize=(7, 5))
        ax = fig.add_subplot(111, projection="3d")
    else:
        fig = ax.figure

    edges = (
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 0),
        (4, 5),
        (5, 6),
        (6, 7),
        (7, 4),
        (0, 4),
        (1, 5),
        (2, 6),
        (3, 7),
    )

    for conn in model.elements.values():
        pts = [model.nodes[n] for n in conn]
        for a, b in edges:
            xa, ya, za = pts[a]
            xb, yb, zb = pts[b]
            ax.plot([xa, xb], [ya, yb], [za, zb], color="0.75", linewidth=1.0, zorder=1)

    def_nodes: Dict[int, NodeXYZ] = {
        tag: (
            x + sfactor * disps[tag][0],
            y + sfactor * disps[tag][1],
            z + sfactor * disps[tag][2],
        )
        for tag, (x, y, z) in model.nodes.items()
    }

    for conn in model.elements.values():
        pts = [def_nodes[n] for n in conn]
        for a, b in edges:
            xa, ya, za = pts[a]
            xb, yb, zb = pts[b]
            ax.plot([xa, xb], [ya, yb], [za, zb], color="C1", linewidth=1.8, zorder=2)

    ox = [p[0] for p in model.nodes.values()]
    oy = [p[1] for p in model.nodes.values()]
    oz = [p[2] for p in model.nodes.values()]
    ax.scatter(ox, oy, oz, s=14, color="0.45", zorder=3)

    dx = [p[0] for p in def_nodes.values()]
    dy = [p[1] for p in def_nodes.values()]
    dz = [p[2] for p in def_nodes.values()]
    ax.scatter(dx, dy, dz, s=20, color="C1", zorder=4)

    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")
    _set_axes_equal_3d(ax)
    return fig, ax


def run_demo() -> None:
    model = build_unit_cube_solid_model(nx=1, ny=1, nz=1, Lx=1.0, Ly=1.0, Lz=1.0)

    fig, _ax = plot_solid_mesh_3d(model, node_labels=False, element_labels=True, show_supports=True, show_loads=True)
    fig.suptitle("3D Solid Mesh (stdBrick)")
    fig.savefig("solid3d_model.png", dpi=200, bbox_inches="tight")

    if ops is None:
        print("已导出 solid3d_model.png（未安装 openseespy，跳过分析与变形图）")
        return

    ops.system("BandGeneral")
    ops.numberer("RCM")
    ops.constraints("Plain")
    ops.test("NormUnbalance", 1.0e-10, 30)
    ops.algorithm("Linear")
    ops.integrator("LoadControl", 1.0)
    ops.analysis("Static")
    ok = ops.analyze(1)
    if ok != 0:
        raise RuntimeError(f"OpenSees 分析失败，返回码: {ok}")

    fig, _ax = plot_deformed_mesh_3d(model, sfactor=100.0)
    fig.suptitle("Deformed Shape (scaled)")
    fig.savefig("solid3d_deformed.png", dpi=200, bbox_inches="tight")

    print("完成：solid3d_model.png, solid3d_deformed.png")


if __name__ == "__main__":
    run_demo()
