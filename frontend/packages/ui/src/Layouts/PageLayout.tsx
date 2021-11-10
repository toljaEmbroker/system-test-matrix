import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ReactProps, RefForwardingComponent } from '@filecoin/types'

import { Colors } from '../styles/colors'
import { zIndex } from '../styles/constants'

import { PageLayoutSection } from './PageLayoutSection'
import { StackLayout } from './StackLayout'
import { GridLayout } from './GridLayout'
import { CoverLayout } from './CoverLayout'
import { PageLayoutHeader } from './PageLayoutHeader'

/**
 * Whether something (usually a sidebar) is in open or closed state.
 */
export type OpenState = 'open' | 'closed'

/**
 * The Page Layout state object.
 */
export interface PageLayoutState {
  /**
   * A React node to use to render the header. If navigation node is present header is not rendered.
   */
  header?: React.ReactNode
  /**
   * A React node to use to render the navigation sidebar.
   */
  navigation?: React.ReactNode
  /**
   * The open state of the navigation sidebar (whether the navigation is expanded - `'open'` or not - `'closed'`).
   */
  navigationState?: OpenState
}

/**
 * Actions exposed by the `usePageLayout()` hook.
 */
export interface PageLayoutActions {
  /**
   * Set the header React node (set to `null` to hide header).
   *
   * @param header A React node to render in the header area.
   */
  setHeader(
    header?:
      | React.ReactNode
      | ((previousState: PageLayoutState) => React.ReactNode),
  ): void
  /**
   * Set the navigation React node (set to `null` to hide navigation).
   *
   * @param navigation A React node to render in the navigation sidebar.
   */
  setNavigation(
    navigation?:
      | React.ReactNode
      | ((previousState: PageLayoutState) => React.ReactNode),
  ): void
  /**
   * Toggle navigation open state (i.e. toggle expanded/collapsed mode).
   */
  toggleNavigationState(): void
}

/**
 * Hook that stores and manages the `PageLayoutState`.
 *
 * @param initialState The initial `PageLayoutState` object.
 */
export function usePageLayout({
  header,
  navigation,
  navigationState = 'closed',
}: PageLayoutState = {}): PageLayoutState & PageLayoutActions {
  const [state, setState] = useState<PageLayoutState>({
    header,
    navigation,
    navigationState,
  })

  const setHeader = useCallback(
    (
      value:
        | React.ReactNode
        | ((previousState: PageLayoutState) => React.ReactNode),
    ) => {
      setState(previousState => {
        const header =
          typeof value === 'function' ? value(previousState) : value
        if (header !== previousState.header) {
          return {
            ...previousState,
            header,
          }
        }
        return previousState
      })
    },
    [],
  )

  const setNavigation = useCallback(
    (
      value:
        | React.ReactNode
        | ((previousState: PageLayoutState) => React.ReactNode),
    ) => {
      setState(previousState => {
        const navigation =
          typeof value === 'function' ? value(previousState) : value
        if (navigation !== previousState.navigation) {
          return {
            ...previousState,
            navigation,
          }
        }
        return previousState
      })
    },
    [],
  )

  const toggleNavigationState = useCallback((event?: React.MouseEvent) => {
    event?.preventDefault?.()
    setState(previousState => {
      if (previousState.navigation == null) {
        return previousState
      }
      return {
        ...previousState,
        navigationState:
          previousState.navigationState === 'open' ? 'closed' : 'open',
      }
    })
  }, [])

  return {
    ...state,
    setHeader,
    setNavigation,
    toggleNavigationState,
  }
}

/**
 * Props of `<PageLayout>` component.
 */
export type PageLayoutProps = ReactProps<'div'> &
  PageLayoutState &
  PageLayoutActions

/**
 * The `<PageLayout>` component represents a container which layouts the main areas of a page.
 */
export interface PageLayout
  extends RefForwardingComponent<PageLayoutProps, HTMLDivElement> {
  /**
   * The `<PageLayout.Section>` component is a container used to section off PageLayout content.
   */
  Section: typeof PageLayoutSection
  Header: typeof PageLayoutHeader
}

/**
 * The `<PageLayout>` component represents a container which layouts the main areas of a page.
 */
export const Page: PageLayout = Object.assign(
  React.forwardRef(function PageLayout(
    { className, children, header, navigation, ...props }: PageLayoutProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div {...props} className={className} ref={ref}>
        <PageContent gap={4}>{children}</PageContent>
        {header != null && header}
        {navigation != null && (
          <div className={'c-page-layout__nav'}>{navigation}</div>
        )}
      </div>
    )
  }),
  {
    Section: PageLayoutSection,
    Header: PageLayoutHeader,
  },
)

const HEADER_HEIGHT = 185
const NAV_WIDTH = 300
const CONTENT_MAX_WIDTH = 1100

export const PageLayout = styled(Page)`
  display: grid;
  position: relative;
  min-height: 100vh;
  z-index: 0;
  grid-template-columns: 0 100%;
  grid-template-rows: 0 100%;
  background: ${Colors.background};
  will-change: grid-template-columns;
  transition: grid-template-columns 0.3s;
  ${props =>
    props.header != null &&
    `
      grid-template-rows: ${HEADER_HEIGHT}px calc(100% - ${HEADER_HEIGHT}px);
  `}

  ${props =>
    props.navigation != null &&
    `
      grid-template-columns: ${NAV_WIDTH}px 1fr;
      
      .c-page-layout__nav {
        position: fixed;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        overflow-x: hidden;
        background: ${Colors.background};
        width: ${NAV_WIDTH}px;
        transform: translateX(-100%);
        transition: transform 0.4s ease;
        z-index: ${zIndex.layer300};
        will-change: transform;
        ${props =>
          props.navigationState === 'open' && 'transform: translateX(100%)'} 
      }
  `}
  
  .c-page-layout__header {
    position: sticky;
    left: 0;
    top: 0;
    width: 100vw;
    height: ${HEADER_HEIGHT}px;
    z-index: ${zIndex.layer200};
    background: ${Colors.headerBackground};
    border-bottom: 1px solid ${Colors.borderColor};
    padding: 5.5rem 3.75rem 2rem 3.75rem;

    &--logo {
      background: ${Colors.logoBackground};
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding-left: 2.75rem;
    }
  }

  ${GridLayout} {
    padding-right: 0;
    padding-left: 0;
  }
`

const PageContent = styled(StackLayout)`
  width: 100%;
  height: 100%;
  grid-column: 2;
  grid-row: 2;
  padding-bottom: 4rem;

  .c-page-layout__section {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: ${CONTENT_MAX_WIDTH}px;

    &:first-child {
      padding-top: 4rem;
    }
  }

  ${CoverLayout} {
    margin-top: auto;
    margin-bottom: auto;

    &:only-child {
      padding-top: 4rem;
      min-height: calc(100vh - 4rem);
    }
  }
`