/// <reference path="../../kg.ts" />

module KG {

    export interface InteractionHandlerDefinition extends UpdateListenerDefinition {
        viewObject: ViewObject;
        xDrag?: any;
        yDrag?: any;
        xDragUpdateParam?: string;
        yDragUpdateParam?: string;
        xDragUpdateValue?: string;
        yDragUpdateValue?: string;
    }

    export interface IInteractionHandler {
        addTrigger: (el:HTMLElement) => void;
    }

    export class InteractionHandler extends UpdateListener implements IInteractionHandler {

        private xDrag;
        private yDrag;

        constructor(def:InteractionHandlerDefinition) {
            def.updatables = ['xDrag','yDrag'];
            super(def);
            this.update();
        }

        private onDrag(handler) {

            // get scaled x and y coordiantes of the drag event
            let coords = {
                x: handler.def.viewObject.xScale.invert(d3.event.x),
                y: handler.def.viewObject.yScale.invert(d3.event.y)
            };

            // if horizontal dragging enabled, update the xDragUpdateParam with the evaluated value of xDragUpdateValue
            if(handler.xDrag) {
                handler.model.updateParam(handler.def.xDragUpdateParam, math.eval(handler.def.xDragUpdateValue,coords));
            }

            // if vertical dragging enabled, update the yDragUpdateParam with the evaluated value of yDragUpdateValue
            if(handler.yDrag) {
                handler.model.updateParam(handler.def.yDragUpdateParam, math.eval(handler.def.yDragUpdateValue,coords));
            }
        }

        addTrigger(element) {
            let handler = this;
            element.call(d3.drag().on('drag', function() {handler.onDrag(handler)}));
        }

    }

}