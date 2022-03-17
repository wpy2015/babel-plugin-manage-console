//c --close
//n --name
//i --info
export const COMMAND_TYPES = ['c', 'n', 'i'];
export const COMMAND_C_VALUES = ['filename', 'tagName', 'loc', 'params', 'info']
export const COMMAND_C_VALUES_MAP = COMMAND_C_VALUES.reduce((r, c) => (r[c] = true, r), {})
export const COMMAND_TYPES_MAP = COMMAND_TYPES.reduce((r, c) => (r[c] = true, r), {})
export const COMMAND_PREFIX = '$lg';
export const INIT_CONF = {
    hiddenTags: [],
    groupCollapsed: false, //调试信息是否折叠
    showNoTags: true, //展示没有tag的
    filename: true, //显示文件名
    tagName: true, //显示tag名称
    loc: true, //显示位置信息
    params: true, //显示参数信息
    info: true //显示其他自定义附加信息
}
export const REG_TAG = /(?:^\$lg)[\s]+(?<tag>[^\-]+)[\s]*(?:[^\-]|$)/;
export const REG_COMMAND_TYPE = new RegExp(`(?<=\\-(?<type>${COMMAND_TYPES.join('|')})[\\s]+)(?<value>[^\\-]+)(?:[^\\-]|$)`, 'g');