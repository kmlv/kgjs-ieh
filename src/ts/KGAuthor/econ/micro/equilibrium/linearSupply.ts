/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearSupplyDefinition extends LineDefinition {
        yInterceptLabel?: string;
        draggable?: boolean;
        handles?: boolean;
    }

    export class EconLinearSupply extends Line {

        public yIntercept;
        public slope;
        private yInterceptPoint;

        constructor(def: EconLinearSupplyDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid'
            });

            if (def.draggable && typeof(def.slope) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.slope),
                    'expression': divideDefs(subtractDefs('drag.y',def.yIntercept),'drag.x')
                }]
            } else if (def.draggable && typeof(def.invSlope) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.invSlope),
                    'expression': divideDefs('drag.x',subtractDefs('drag.y',def.yIntercept))
                }]
            }

            super(def, graph);

            let ld = this;


            if (graph) {
                const subObjects = ld.subObjects;

                let yInterceptPointDef = {
                    coordinates: [0, ld.yIntercept],
                    color: def.color,
                    r: 4
                };

                if (def.draggable && typeof(ld.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(ld.yIntercept),
                        expression: addDefs(ld.yIntercept, 'drag.dy')
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                ld.yInterceptPoint = new Point(yInterceptPointDef, graph);

                if (def.handles) {
                    subObjects.push(ld.yInterceptPoint);
                }

            }

        }

        parseSelf(parsedData) {
            let ld = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[ld.name] = {
                yIntercept: ld.yIntercept,
                slope: ld.slope,
                invSlope: ld.invSlope
            };

            return parsedData;
        }

    }


}