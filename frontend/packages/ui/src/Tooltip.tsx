import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import { Colors } from './styles/colors'

interface Props {
  element: JSX.Element
  children: any
  tooltipId?: string
  multiline?: boolean
  width?: number
  effect?: 'float' | 'solid'
  position?: 'top' | 'right' | 'bottom' | 'left'
}

export const Tooltip = ({ effect = 'float', ...props }: Props) => {
  const id = props.tooltipId || Math.random() * 100
  return (
    <>
      <span
        data-effect={effect}
        data-place={props.position}
        data-for={`${id}`}
        data-tip
      >
        {props.element}
      </span>
      <StyledTooltip data-element="tooltip" width={props.width} id={`${id}`}>
        {props.children}
      </StyledTooltip>
    </>
  )
}

const StyledTooltip = styled(ReactTooltip)<{ width: number }>`
  &.type-dark.__react_component_tooltip {
    box-shadow: 0 3px 6px 0 ${Colors.shadowColor};
    background-color: #fff;
    border: 1px solid ${Colors.borderColor};
    border-radius: 3px;
    color: ${Colors.textColor};
    text-transform: none;
    ${props => {
      return props.width ? `max-width: ${props.width}px;` : ''
    }}

    &.show {
      opacity: 1;
    }

    &.place-bottom {
      &::after {
        width: 12px;
        height: 12px;
        background: #fff;
        transform: rotate(45deg);
        border: 1px solid ${Colors.borderColor};
      }

      &::before {
        left: 50%;
        margin-left: -10px;
        top: 0;
        background: #fff;
        width: 16px;
        height: 8px;
        z-index: 9999999;
      }
    }

    &.place-right {
      &::after {
        width: 12px;
        height: 12px;
        background: #fff;
        transform: rotate(45deg);
        border: 1px solid ${Colors.borderColor};
        margin-top: -6px;
      }

      &::before {
        margin-left: 8px;
        margin-top: -8px;
        top: 50%;
        background: #fff;
        width: 10px;
        height: 16px;
        z-index: 9999999;
      }
    }
  }
`