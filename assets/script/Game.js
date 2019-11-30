cc.Class({
    extends: cc.Component,

    properties: {
        people: {
            default: null,
            type: cc.Prefab
        },
        menu_item: {
            default: null,
            type: cc.Prefab
        },
        map: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 
        cc.director.getCollisionManager().enabled = true
        this.dataStore = cc.find('Game').getComponent('DataStore')
    },

    start() {

    },

    /**新增一个客人 */
    newPeople() {
        let people = cc.instantiate(this.people)
        let scene_1 = this.map.getChildByName('scene_1')

        scene_1.addChild(people)
        people.getComponent('People').init()
    },

    newMenuItem(e) {
        let tableData,idx
        // 找空地
        for (let i = 0; i < this.dataStore.tableData.length; i++) {
            if (!this.dataStore.tableData[i].itemId) {
                idx = i
                tableData = this.dataStore.tableData[i]
                break
            }
        }


        if (tableData) {
            let menu_item = cc.instantiate(this.menu_item)
            let scene_1 = this.map.getChildByName('scene_1')
            scene_1.addChild(menu_item)

            menu_item.setPosition(cc.v2(tableData.x, tableData.y))

            this.dataStore.tableData[idx].itemId = 1
            this.dataStore.barrier.push(menu_item)
            console.log(this.dataStore.tableData)
        } else {
            console.log('已满')
        }

    }

    // update (dt) {},
});