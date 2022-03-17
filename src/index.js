export let type;
import { isBlockBody, getListKey, getFuncName, findLgCmt, getCmtVal, log } from './utils'
import { INIT_CONF } from './constant'

export default function ({ types: t }) {
    type = t;
    function handleComment(path, state) {
        const lgCmt = findLgCmt(path.node.leadingComments || []);
        if (!lgCmt) {
            return
        }

        const { conf, ...opts } = initOpts(lgCmt, state, path);

        if (!opts.showTag) {
            return;
        }

        let bodyPath = path.get('body'),
            bodyNode = path.node.body;

        if (!isBlockBody(bodyNode)) {
            bodyPath.replaceWith(
                t.blockStatement([
                    t.returnStatement(bodyNode)
                ])
            )
            bodyNode = path.node.body;
        }
        const key = getListKey(bodyPath);

        let groupLabel = opts.name;
        if (conf.tagName && opts.tag) {
            groupLabel += `(${opts.tag})`;
        }
        if (conf.info && opts.info) {
            groupLabel += `----${opts.info}`;
        }

        groupLabel = t.stringLiteral(groupLabel);

        let chileNode = [
            log([groupLabel], conf.groupCollapsed ? 'groupCollapsed' : 'group')
        ]

        if (conf.filename) {
            chileNode.push(log([t.stringLiteral(`文件: ${opts.filename}`)]));
        }
        if (conf.loc) {
            chileNode.push(log([t.stringLiteral(`位置: line-${path.node.loc.start.line},column-${path.node.loc.start.column}`)]));
        }
        if (conf.params && path.node.params.length) {
            chileNode.push(
                log([t.stringLiteral(`参数:`), path.node.params.reduce((res, param) => {
                    res.push(t.stringLiteral(param.name + ':'));
                    res.push(param);
                    res.push(t.stringLiteral('; '));
                    return res;
                }, []).reduce((res, param) => {
                    return t.binaryExpression('+', res, param)
                })])
            )
        }

        chileNode.push(log([groupLabel], 'groupEnd'))

        bodyPath.unshiftContainer(key, chileNode)
    }
    function initOpts(comment, state, path) {
        const cwd = state.cwd || '';
        const { conf, tag, name, info } = getCmtVal(comment.value);
        const res = {
            conf: {
                ...INIT_CONF,
                ...state.opts,
                ...conf,
            },
            name: name || getFuncName(path),
            filename: (state.filename && state.filename.substring(cwd.length + 1)) || 'unknown',
            tag,
            info,
        }
        const hiddenTagsSet = new Set(res.conf.hiddenTags);
        res.showTag = (!tag.length && res.conf.showNoTags) || !![...new Set(res.tag.filter(t => !hiddenTagsSet.has(t)))].length;
        return res;
    }
    return {
        visitor: {
            Program(path, state) {
                path.traverse({
                    FunctionDeclaration: handleComment,
                    FunctionExpression: handleComment,
                    ArrowFunctionExpression: handleComment,
                    ObjectMethod: handleComment,
                    ClassMethod: handleComment
                }, state)
            }
        }
    }
}