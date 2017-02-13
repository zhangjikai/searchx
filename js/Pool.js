/**
 * Created by zhangjk on 2014/12/17.
 */

/**
 * 对象池
 * @type {{}|*}
 */
SearchX.Pool = SearchX.Pool || {}

SearchX.Pool.meshs = new Hashtable();

SearchX.Pool.geomertries = new Hashtable();

SearchX.Pool.materials = new Hashtable();

SearchX.Pool.texts = [
    ["贝", "见"],
    ["干", "千"],
    ["目", "月"],
    ["人", "入"],
    ["今", "令"],
    ["爪", "瓜"],
    ["免", "兔"],
    ["午", "牛"],
    ["重", "童"],
    ["己", "已"],
    ["冈", "风"],
    ["白", "自"],
    ["住", "往"],
    ["土", "士"],
    ["活", "话"],
    ["没", "设"],
    ["侯", "候"],
    ["拔", "拨"],
    ["泪", "汨"],
    ["失", "矢"],
    ["竟", "竞"],
    ["岗", "岚"],
    ["未", "末"],
    ["冶", "治"]
];

/**
 * 获得Geometey对象
 * 如果width相同，则返回同一个Geometry对象
 * @param width 立方体的边长
 * @returns {THREE.BoxGeometry}
 */
SearchX.Pool.getGeometry = function (width) {
    var geomerey = this.geomertries.get(width);
    if (geomerey) {
        return geomerey;
    }
    geomerey = new THREE.BoxGeometry(width, width, width);
    this.geomertries.put(width, geomerey);
    console.log("geomertries.length:" + this.geomertries.size())
    return geomerey;
}

/**
 * 获得Material对象
 * 如果传入的参数相同，则返回同一个Material对象
 * @param text 显示的文字
 * @param background 背景色
 * @param borderColor 边框颜色
 * @param borderWidth 边框宽度
 * @param width 立方体的边长
 * @returns {THREE.MeshBasicMaterial}
 */
SearchX.Pool.getMaterial = function (text, background, borderColor, borderWidth, width) {
    var str = text + "<>" + background + "<>" + borderColor + "<>" + borderWidth + "<>" + width;
    var material = this.materials.get(str);
    if (material) {
        return material;
    }
    var dynamicTexture = new THREEx.DynamicTexture(width, width);
    dynamicTexture.context.font = "bold " + (0.8 * width) + "px '楷体'";
    dynamicTexture.clearWithBorder(background, borderColor, borderWidth);
    dynamicTexture.drawTextCooked(text, {
        lineHeight: 0.7,
        align: "center",
        fillStyle: "black"

    });

    material = new THREE.MeshBasicMaterial({
        map: dynamicTexture.texture
    });
    this.materials.put(str, material);
    return material;

}

