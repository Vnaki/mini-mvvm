/**
 * render function
 */

import VNode, { IVNodeData } from "./VNode";
import * as _ from '../../utils';


export default function h(type: string, text?: string): VNode;
export default function h(type: string, children?: VNode[]): VNode;
export default function h(type: string, data?: IVNodeData, text?: string): VNode;
export default function h(type: string, data?: IVNodeData, children?: VNode[]): VNode;

export default function h(type: string, b?: any, c?: any): VNode {
    let data: IVNodeData;
    let text: string;
    let children: VNode[];

    const bType = _.type(b);
    const cType = _.type(c);

    if (bType === 'object') {
        data = b;
        if (cType === 'array') {
            children = c;
        }
        else if (cType === 'string') {
            text = c;
        }
    }
    else if (bType === 'array') {
        children = b;
    }
    else if (bType === 'string') {
        text = b;
    }

    return new VNode(type, b, children, text);
}
