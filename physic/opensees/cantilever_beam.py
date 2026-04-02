from dataclasses import dataclass
from typing import Any, Dict, Iterable, Optional, Tuple

try:
    import matplotlib.pyplot as plt
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


NodeXY = Tuple[float, float]
ElementConn = Tuple[int, int]


@dataclass(frozen=True)
class BeamModel2D:
    nodes: Dict[int, NodeXY]
    elements: Dict[int, ElementConn]
    fixities: Dict[int, Tuple[int, int, int]]
    nodal_loads: Dict[int, Tuple[float, float, float]]


def build_cantilever_beam_model(L: float = 10.0, num_elements: int = 10) -> BeamModel2D:
    nodes: Dict[int, NodeXY] = {}
    elements: Dict[int, ElementConn] = {}
    fixities: Dict[int, Tuple[int, int, int]] = {}
    nodal_loads: Dict[int, Tuple[float, float, float]] = {}

    for i in range(num_elements + 1):
        nodes[i + 1] = (i * (L / num_elements), 0.0)

    fixities[1] = (1, 1, 1)
    nodal_loads[num_elements + 1] = (0.0, -10000.0, 0.0)

    for i in range(num_elements):
        elements[i + 1] = (i + 1, i + 2)

    if ops is not None:
        ops.wipe()
        ops.model("basic", "-ndm", 2, "-ndf", 3)

        for node_tag, (x, y) in nodes.items():
            ops.node(node_tag, x, y)

        ops.fix(1, 1, 1, 1)
        ops.section("Elastic", 1, 2.0e11, 0.01, 0.0001)
        ops.geomTransf("Linear", 1)
        for ele_tag, (i_node, j_node) in elements.items():
            ops.element("elasticBeamColumn", ele_tag, i_node, j_node, 1, 1)

        ops.timeSeries("Linear", 1)
        ops.pattern("Plain", 1, 1)
        ops.load(num_elements + 1, 0.0, -10000.0, 0.0)

    return BeamModel2D(nodes=nodes, elements=elements, fixities=fixities, nodal_loads=nodal_loads)


def _set_axes_equal_2d(ax: Axes) -> None:
    x0, x1 = ax.get_xlim()
    y0, y1 = ax.get_ylim()
    cx = 0.5 * (x0 + x1)
    cy = 0.5 * (y0 + y1)
    r = 0.5 * max(x1 - x0, y1 - y0, 1e-9)
    ax.set_xlim(cx - r, cx + r)
    ax.set_ylim(cy - r, cy + r)


def plot_beam_model(
    model: BeamModel2D,
    *,
    node_labels: bool = True,
    element_labels: bool = True,
    show_supports: bool = True,
    show_loads: bool = True,
    ax: Optional[Axes] = None,
) -> Tuple[Figure, Axes]:
    if plt is None:
        raise RuntimeError("matplotlib 未安装，无法绘图。请先安装 matplotlib。")
    if ax is None:
        fig, ax = plt.subplots(figsize=(8, 3))
    else:
        fig = ax.figure

    for ele_tag, (i_node, j_node) in model.elements.items():
        xi, yi = model.nodes[i_node]
        xj, yj = model.nodes[j_node]
        ax.plot([xi, xj], [yi, yj], color="C0", linewidth=2.0, zorder=2)
        if element_labels:
            ax.text(
                0.5 * (xi + xj),
                0.5 * (yi + yj),
                str(ele_tag),
                color="C0",
                fontsize=9,
                ha="center",
                va="bottom",
                zorder=4,
            )

    xs = [xy[0] for xy in model.nodes.values()]
    ys = [xy[1] for xy in model.nodes.values()]
    ax.scatter(xs, ys, s=30, color="k", zorder=3)

    if node_labels:
        for node_tag, (x, y) in model.nodes.items():
            ax.text(x, y, f" {node_tag}", fontsize=9, ha="left", va="bottom", zorder=4)

    if show_supports:
        for node_tag, (fix_x, fix_y, fix_r) in model.fixities.items():
            if fix_x == 1 and fix_y == 1 and fix_r == 1:
                x, y = model.nodes[node_tag]
                size = 0.05 * max(max(xs) - min(xs), 1.0)
                ax.fill(
                    [x, x - size, x - size],
                    [y, y - 0.5 * size, y + 0.5 * size],
                    color="0.2",
                    alpha=0.9,
                    zorder=1,
                )

    if show_loads and model.nodal_loads:
        mags: Iterable[float] = (
            (fx * fx + fy * fy) ** 0.5 for (fx, fy, _mz) in model.nodal_loads.values()
        )
        max_mag = max(mags, default=0.0)
        scale = 0.12 * max(max(xs) - min(xs), 1.0) / (max_mag if max_mag > 0 else 1.0)
        for node_tag, (fx, fy, _mz) in model.nodal_loads.items():
            if fx == 0.0 and fy == 0.0:
                continue
            x, y = model.nodes[node_tag]
            ax.arrow(
                x,
                y,
                fx * scale,
                fy * scale,
                head_width=0.04 * max(max(xs) - min(xs), 1.0),
                head_length=0.06 * max(max(xs) - min(xs), 1.0),
                length_includes_head=True,
                color="C3",
                zorder=5,
            )

    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.grid(True, alpha=0.2)
    ax.margins(x=0.05, y=0.25)
    _set_axes_equal_2d(ax)
    return fig, ax


def plot_deformed_shape(
    model: BeamModel2D,
    *,
    sfactor: float = 100.0,
    ax: Optional[Axes] = None,
) -> Tuple[Figure, Axes]:
    if plt is None:
        raise RuntimeError("matplotlib 未安装，无法绘图。请先安装 matplotlib。")
    if ops is None:
        raise RuntimeError("openseespy 未安装，无法读取节点位移来绘制变形图。")

    disps: Dict[int, Tuple[float, float]] = {}
    for node_tag in model.nodes.keys():
        disps[node_tag] = (float(ops.nodeDisp(node_tag, 1)), float(ops.nodeDisp(node_tag, 2)))

    if ax is None:
        fig, ax = plt.subplots(figsize=(8, 3))
    else:
        fig = ax.figure

    for _ele_tag, (i_node, j_node) in model.elements.items():
        xi, yi = model.nodes[i_node]
        xj, yj = model.nodes[j_node]
        ax.plot([xi, xj], [yi, yj], color="0.7", linewidth=1.5, zorder=1)

    def_nodes: Dict[int, NodeXY] = {
        node_tag: (x + sfactor * disps[node_tag][0], y + sfactor * disps[node_tag][1])
        for node_tag, (x, y) in model.nodes.items()
    }

    for _ele_tag, (i_node, j_node) in model.elements.items():
        xi, yi = def_nodes[i_node]
        xj, yj = def_nodes[j_node]
        ax.plot([xi, xj], [yi, yj], color="C1", linewidth=2.0, zorder=2)

    xs = [xy[0] for xy in model.nodes.values()]
    ys = [xy[1] for xy in model.nodes.values()]
    ax.scatter(xs, ys, s=20, color="0.4", zorder=3)

    dxs = [xy[0] for xy in def_nodes.values()]
    dys = [xy[1] for xy in def_nodes.values()]
    ax.scatter(dxs, dys, s=30, color="C1", zorder=4)

    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.grid(True, alpha=0.2)
    ax.margins(x=0.05, y=0.25)
    _set_axes_equal_2d(ax)
    return fig, ax

def run_corrected_vis():
    model = build_cantilever_beam_model(L=10.0, num_elements=10)
    fig, _ax = plot_beam_model(model, node_labels=True, element_labels=True, show_supports=True, show_loads=True)
    fig.suptitle("Model Check")
    fig.savefig("/Users/cxh/Codes/langchain/physic/opensees/cantilever_beam/model_check.png", dpi=200, bbox_inches="tight")
    
    if ops is None:
        print("模型图片已导出：model_check.png（未安装 openseespy，跳过分析与变形图）")
        return

    ops.system("BandGeneral")
    ops.numberer("RCM")
    ops.constraints("Plain")
    ops.integrator("LoadControl", 1.0)
    ops.algorithm("Linear")
    ops.analysis("Static")
    ops.analyze(1)

    fig, _ax = plot_deformed_shape(model, sfactor=100.0)
    fig.suptitle("Deformed Shape")
    fig.savefig("/Users/cxh/Codes/langchain/physic/opensees/cantilever_beam/deformation_check.png", dpi=200, bbox_inches="tight")
    
    print("分析完成，图片已导出。")

if __name__ == "__main__":
    run_corrected_vis()
