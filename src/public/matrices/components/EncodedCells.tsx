import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import {
  originAccesor, destinationAccesor, meanAccesor, stdAccesor,
} from '../utils/Accesors';
import { useMatrixContext } from '../utils/MatrixContext';
import { link } from '../utils/Interfaces';

import { useRenderEcondedCells } from '../hooks/useRenderEncodeCells';

export function EncodedCells() {
  const {
    data, cellSize, encoding, isSnr, meanScale, devScale, originScale, destinationScale,
  } = useMatrixContext();

  const ref = useRef<SVGGElement | null>(null);
  const cellRenderer = useRenderEcondedCells(meanScale, devScale, cellSize, isSnr);

  useEffect(() => {
    if (!ref.current) return;

    const g = d3
      .select(ref.current)
      .selectAll<SVGGElement, link>('.cell')
      .data(data, (d) => originAccesor(d) + destinationAccesor(d) + meanAccesor(d) + stdAccesor(d))
      .join(
        (enter) => enter
          .append('g')
          .attr('class', 'cell')
          .attr(
            'transform',
            (d: link) => `translate(${originScale(originAccesor(d))}, ${destinationScale(
              destinationAccesor(d),
            )})`,
          ),
        (update) => {
          update.selectAll('*').remove();
          return update.attr(
            'transform',
            (d: link) => `translate(${originScale(originAccesor(d))}, ${destinationScale(
              destinationAccesor(d),
            )})`,
          );
        },
        (exit) => exit.remove(),
      );

    cellRenderer(g, encoding);
  }, [data, originScale, destinationScale, cellRenderer, ref, encoding]);

  return <g ref={ref} />;
}
