import { type as t } from './index'
import { REG_COMMAND_TYPE, REG_TAG, COMMAND_TYPES_MAP, COMMAND_C_VALUES_MAP, COMMAND_TYPES } from './constant'

export function isLgCmt({ type, value } = {}) {
    return type === 'CommentBlock' && value.slice(0, 3) === '$lg'
}
export function isBlockBody({ type } = {}) {
    return type === 'BlockStatement'
}
export function getListKey(path) {
    return Array.isArray(path.container) ? path.listKey : path.key;
}
export function getFuncName(path) {
    const parentPath = path.parentPath;
    const node = path.node;
    if (t.isVariableDeclarator(parentPath) && parentPath.node.id) {
        return parentPath.node.id.name;
    }
    if (t.isAssignmentExpression(parentPath)) {
        const leftNode = parentPath.node.left;
        if (t.isMemberExpression(leftNode)) {
            return leftNode.property.name;
        }
        return leftNode.name;
    }
    if (t.isObjectMethod(path)) {
        return path.node.key.name;
    }
    if (t.isClassMethod(path)) {
        return path.node.key.name;
    }
    if (node.id && node.id.name) {
        return node.id.name
    }
    return '匿名函数';
}
export function findLgCmt(cmts = []) {
    return cmts.filter(isLgCmt)[0]
}
export function getCmtVal(cmt) {
    // $lg test -c filename loc -n name
    let { groups: { tag } } = cmt.match(REG_TAG) || { groups: { tag: '' } },
        command_params = {},
        r;

    COMMAND_TYPES.forEach(t => command_params[t] = '');

    while (r = REG_COMMAND_TYPE.exec(cmt)) {
        let type = r.groups.type,
            value = r.groups.value.trim();
        if (!COMMAND_TYPES_MAP[type]) {
            console.warn(`未识别的参数类型${type},值${value}`);
            continue;
        }
        command_params[type] = value;
    }
    return {
        tag: tag.split(' ').filter(t => t),
        conf: command_params.c.split(' ').reduce((r, c) => {
            if (c) {
                COMMAND_C_VALUES_MAP[c] ? (r[c] = false) : console.warn(`未识别的配置参数${c}`)
            }
            return r;
        }, {}) || {},
        name: command_params.n,
        info: command_params.i
    }
}
export function log(args, type = 'log') {
    const consoleCallee = t.memberExpression(t.identifier('console'), t.identifier(type), false);
    return t.expressionStatement(t.callExpression(consoleCallee, args));
}