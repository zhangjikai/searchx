/**
 * Created by zhangjk on 2014/12/14.
 */
SearchX.Cube = function (mesh, name, width, height, depth) {
    this.mesh = mesh;
    this.name = name;
    this.mesh.name = name;
    this.width = parseInt(width / 2);
    this.height = parseInt(height / 2);
    this.depth = parseInt(depth / 2);
    this.t = 0.01 * Math.random() + 0.01;
    this.moveX = Math.random() - 0.5;
    this.moveY = Math.random() - 0.5;
    this.moveZ = Math.random() - 0.5;
}

SearchX.Cube.prototype = {


    rotate: function () {
        this.mesh.rotation.x += this.t;
        this.mesh.rotation.y += this.t;
        this.mesh.rotation.z += this.t;
        this.mesh.position.x += this.moveX;
        this.mesh.position.y += this.moveY;
        this.mesh.position.z += this.moveZ;

        if (this.mesh.position.x > this.width || this.mesh.position.x < -this.width) {
            this.moveX = -this.moveX;
        }

        if (this.mesh.position.y > this.height || this.mesh.position.y < -this.height) {
            this.moveY = -this.moveY;
        }

        if (this.mesh.position.z > this.depth || this.mesh.position.z < -this.depth) {
            this.moveZ = -this.moveZ;
        }
    }

}