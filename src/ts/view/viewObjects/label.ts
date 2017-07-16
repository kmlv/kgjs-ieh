/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        xPixelOffset?: number;
        yPixelOffset?: number;
        text: string;
    }

    export class Label extends ViewObject {

        private x: number;
        private y: number;
        private text: string;
        private fontSize: number;
        private element: any;
        private xPixelOffset: number;
        private yPixelOffset: number;

        constructor(def) {

            //establish property defaults
            def = _.defaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                updatables: [],
                constants: []
            });

            // define constant and updatable properties
            def.constants = def.constants.concat(['xPixelOffset','yPixelOffset','fontSize']);
            def.updatables = def.updatables.concat(['x', 'y','text']);

            super(def);

        }

        // create div for text
        draw(layer) {
            let label = this;

            label.element = layer.append('div')
                .attr('class','draggable')
                .style('position', 'absolute')
                .style('font-size', label.fontSize + 'pt');

            label.interactionHandler.addTrigger(label.element);

            return label;
        }

        // update properties
        update(force) {
            let label = super.update(force);
            if (label.hasChanged) {
                const x = label.xScale.scale(label.x) + (+label.xPixelOffset),
                    y = label.yScale.scale(label.y) + (+label.yPixelOffset);
                label.element.style('left', x + 'px');
                label.element.style('top', y + 'px');
                katex.render(label.text, label.element.node());
            }
            return label;
        }
    }

}