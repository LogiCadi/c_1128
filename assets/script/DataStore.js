cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tableData = [{
                x: -200,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0, // 桌上食物
            },
            {
                x: 0,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 200,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: -200,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 0,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 200,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
        ]

        // 障碍物
        this.barrier = []


    },


    start() {

    },

    /**找空桌子 */
    getBlankTable() {
        for (let i = 0; i < this.tableData.length - 1; i++) {
            if (this.tableData[i].itemId && this.tableData[i].hasPeople == false) {
                return i
            }
        }
        return false
    },

    /**判断一个点是否在障碍物上 */
    getBarrier(pos) {
        for (let i = 0; i < this.barrier.length; i++) {

            if (this.barrier[i].getBoundingBox().contains(pos)) {
                return true
            }
        }
    }

    // update (dt) {},
});