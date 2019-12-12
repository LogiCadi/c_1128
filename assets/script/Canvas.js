cc.Class({
    extends: cc.Component,

    properties: {
        map: {
            default: null,
            type: cc.Node,
        },
        modal_menu: cc.Prefab,
        modal_item_info: cc.Prefab,
        modal_msg: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
    },

    start() {
        this.modalList = []
    },
    newMsg(msg) {
        let modal = cc.instantiate(this.modal_msg)
        this.node.addChild(modal)
        modal.getComponent('modal_msg').init(msg)
        this.modalList.push(modal)
    },

    // 显示modal
    newMenu() {
        let modal = cc.instantiate(this.modal_menu)
        this.node.addChild(modal)
        modal.getComponent('modal_menu').init()
        this.modalList.push(modal)
    },

    newItemInfo(data) {
        let modal = cc.instantiate(this.modal_item_info)
        this.node.addChild(modal)
        modal.getComponent('ModalItemInfo').init(data)
        this.modalList.push(modal)

    },
    // update (dt) {},
    closeAllModals() {
        for (const key in this.modalList) {
            const ele = this.modalList[key]
            ele.active = false
        }
    }
});