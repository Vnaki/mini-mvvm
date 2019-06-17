import h from "./lib/VDom/h";
import patch from "./lib/VDom";

const node = h('ul', [
    h('li', {
        attrs: {
            style: 'color:#f00',
            'data-name': 'tom'
        }
    }, 'nihao')
]);

patch(
    document.getElementById('app'),
    node
);

console.log(node.elm);
