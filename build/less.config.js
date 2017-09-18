//modify-var  global-var
// less 头部，less定义同名，会被覆盖
let globalVar = {}

// 基础，通用的变量配置
globalVar.base = {
    // 主色
    'primary-color': 'red'
}

// 微信私有变量
globalVar.weixin = {
    'primary-color': '#3CAF36'
}

// 混合 私有变量
globalVar.hybrid = {
    
}

// 手Q
globalVar.shouq = {

}

// touch站
globalVar.touch = {

}

// less 末尾部，less定义同名，永远不会被覆盖
let modifyVar = {}

// 基础，通用的变量配置
modifyVar.base = {}

// 微信私有变量
modifyVar.weixin = {}

// 混合 私有变量
modifyVar.hybrid = {}

// 手Q
modifyVar.shouq = {}

// touch站
modifyVar.touch = {}

// 到处，私有合基础混合
module.exports = function(channel) {
    return {
        globalVars: Object.assign({}, globalVar.base, globalVar[channel] || {}),
        modifyVars: Object.assign({}, modifyVar.base, modifyVar[channel] || {})
    }
}